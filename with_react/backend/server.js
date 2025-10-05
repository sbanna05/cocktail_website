import express from 'express';
import mariadb from 'mariadb'
import cors from 'cors'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const oldJson = res.json;
    res.json = function (data) {
        const safeData = JSON.parse(JSON.stringify(data, (_, v) =>
            typeof v === 'bigint' ? v.toString() : v
        ));
        return oldJson.call(this, safeData);
    }
    next();
});

//database connection
const db = await mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

// JWT helper
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(req, res, next) {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ error: 'Nincs token' });
    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Érvénytelen token formátum' });
    }
    const token = parts[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Érvénytelen token' });
        req.user = decoded;
        next();
    });
}

app.get('/api/cocktails', async (req, res) => {
    try {
        const rows = await db.query('Select * from cocktails');
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: 'Adatbázis hiba' })
    }
})

app.get('/api/signatures', async (req, res) => {
    try {
        const rows = await db.query('Select * from signatures');
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: 'Adatbázis hiba' })
    }
})

app.get("/api/beverages", async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM beverages");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Szerverhiba a beverages lekérésekor" });
    }
});

// ===== 2. Essentials API =====
app.get("/api/essentials", async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM essentials");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Szerverhiba az essentials lekérésekor" });
    }
});


// Új felhasználó hozzáadása
app.post('/api/users', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Hiányzó adatok' });
    }
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const result = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [username, email, hash]
        );
        const insertId = result.insertId ? Number(result.insertId) : null;
        return res.status(201).json({ message: 'Felhasználó hozzáadva', userId: insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ez az email már foglalt' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Adatbázis hiba', message: err.message });
    }
});


app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Hiányzó adatok' });

  try {
    const rows = await db.query('SELECT id, name, email, password FROM users WHERE name = ?', [username]);
    if (!rows.length) return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Hibás jelszó' });

    const token = generateToken({ id: user.id, name: user.name, email: user.email });
    res.json({ token, user: { id: Number(user.id), name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Szerverhiba' });
  }
});


app.post('/api/cart', verifyToken, async (req, res) => {
  // req.user.id a tokenből
  const { quantity, beverageId, essentialId } = req.body;
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: 'Hiányzó user azonosító' });

  try {
    // van-e cart userhez
    let carts = await db.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    let cartId;
    if (carts.length === 0) {
      const result = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cartId = result.insertId;
    } else cartId = carts[0].id;

    // check existing cart item (cart + beverage/essential)
    let sql = 'SELECT * FROM cart_items WHERE cart_id = ?';
    let params;
    if (beverageId) {
      sql += ' AND beverage_id = ?';
      params = [cartId, beverageId];
    } else if (essentialId) {
      sql += ' AND essential_id = ?';
      params = [cartId, essentialId];
    } else {
      return res.status(400).json({ error: 'Hiányzó termék ID' });
    }

    const items = await db.query(sql, params);
    if (items.length > 0) {
      await db.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity || 1, items[0].id]);
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, beverage_id, essential_id, quantity) VALUES (?, ?, ?, ?)',
        [cartId, beverageId || null, essentialId || null, quantity || 1]
      );
    }
    res.json({ message: 'Hozzáadva a kosárhoz!', cartId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Adatbázis hiba' });
  }
});

app.get('/api/cart', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const carts = await db.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (!carts.length) return res.json({ orderItems: [] });

    const cartId = carts[0].id;
    const orderItems = await db.query(`
      SELECT ci.id, ci.quantity, ci.beverage_id, ci.essential_id,
             COALESCE(b.name, e.name) AS name,
             COALESCE(b.price, e.price) AS price
      FROM cart_items ci
      LEFT JOIN beverages b ON ci.beverage_id = b.id
      LEFT JOIN essentials e ON ci.essential_id = e.id
      WHERE ci.cart_id = ?
    `, [cartId]);

    res.json({ orderItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hiba a kosár lekéréséhez.' });
  }
});


app.delete('/api/cart/item/:itemId', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;
  try {
    const carts = await db.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (!carts.length) return res.status(404).json({ error: 'Nincs kosár ehhez a felhasználóhoz' });
    const cartId = carts[0].id;

    const result = await db.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [itemId, cartId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Nincs ilyen tétel a kosárban' });

    res.json({ message: 'Tétel törölve a kosárból' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hiba a tétel törlésekor' });
  }
});


app.post('/api/orders', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { orderItems, total } = req.body;
  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0)
    return res.status(400).json({ error: 'Hiányzó adatok a rendeléshez' });

  try {
    const orderItemsJSON = JSON.stringify(orderItems);
    const result = await db.query('INSERT INTO orders (user_id, total, order_items) VALUES (?, ?, ?)', [userId, total, orderItemsJSON]);
    const orderId = result.insertId;

    // Update stock (példa: csökkentés név alapján — célszerű ID-re módosítani)
    for (const item of orderItems) {
      if (item.beverageId) {
        await db.query('UPDATE beverages SET stock = stock - ? WHERE id = ? AND stock >= ?', [item.quantity, item.beverageId, item.quantity]);
      }
      if (item.essentialId) {
        await db.query('UPDATE essentials SET stock = stock - ? WHERE id = ? AND stock >= ?', [item.quantity, item.essentialId, item.quantity]);
      }
    }

    // Clear cart
    await db.query('DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)', [userId]);

    res.json({ message: 'Rendelés létrehozva', orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hiba a rendelés mentésekor' });
  }
});

app.post("/api/contact", async (req, res) => {
    const { sender_name, sender_email, sender_phone, message } = req.body;
    if (!sender_name || !sender_email || !sender_phone || !message) {
        return res.status(400).json({ error: "Hiányzó adatok a küldéshez" });
    }
    try {
        const result = await db.query("Insert into messages(sender_name, sender_email, sender_phone, message) values(?,?,?,?)",
            [sender_name, sender_email, sender_phone, message])
        const messageId = result.insertId;
        res.json({ message: 'Üzenet elküldve', messageId });

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ error: "Adatbázis hiba" });
    }
})


const PORT = 5000;
app.listen(PORT, () => console.log(`Server fut a ${PORT} porton`))