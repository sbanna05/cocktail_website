import express from 'express';
import mariadb from 'mariadb'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function(data) {
    const safeData = JSON.parse(JSON.stringify(data, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v
    ));
    return oldJson.call(this, safeData);
  }
  next();
});

//adatbázis
const db = await mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'cocktailheaven'
})

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


// Új felhasználó hozzáadása
app.post('/api/users', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Hiányzó adatok' });
    }

    try {
        const result = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );

        // insertId ellenőrzés MariaDB-nél
        const insertId = result.insertId ? Number(result.insertId) : null;
        return res.status(201).json({ message: 'Felhasználó hozzáadva', userId: insertId });
    } catch (err) {
        // Ha az email már létezik (UNIQUE constraint)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ez az email már foglalt' });
        }
        console.error(err); // backend logban jelenjen meg a pontos hiba
        return res.status(500).json({ error: 'Adatbázis hiba', message: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Hiányzó adatok' });
    try {
        const rows = await db.query(
            'SELECT id, name, password FROM users WHERE name = ?',
            [username]
        );

        if (!rows.length) return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó' });
        const user = rows[0];

        // Egyszerű példa: plaintext jelszó (később bcrypt)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Hibás jelszó' });
        }
        // Visszaadjuk a userId-t és a nevet
        res.json({ userId: Number(user.id) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Szerverhiba' });
    }
});

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


// Kosárhoz adás
app.post('/api/cart', async (req, res) => {
    console.log("body:", req.body)
    const { userId, quantity, beverageId, essentialId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'Hiányzó adatok' });
    }
    try {
        let carts = await db.query("Select * from carts where user_id = ?", [userId]);
        let cartId;

        if (carts.length === 0) {
            let result = await db.query("insert into carts (user_id) values (?)", [userId]);
            cartId = result.insertId;
        } else cartId = carts[0].id

        console.log(cartId);

        let sql = `select * from cart_items
                where cart_id = ?`;
        let params;
        if (beverageId) {
            sql += " and beverage_id = ?;";
            params = [cartId, beverageId];
        } else if (essentialId) {
            sql += " and essential_id = ?;";
            params = [cartId, essentialId];
        } else {
            return res.status(400).json({ error: "Hiányzó termék ID" });
        }
        console.log(sql)

        let items = await db.query(sql, params)

        console.log("cartitems:", items)

        if (items.length > 0) {
            await db.query(`update cart_items Set quantity = quantity + ?
                    Where id = ?`,
                [quantity || 1, items[0].id])
        } else {
            await db.query(`INSERT INTO cart_items
                 (cart_id, beverage_id, essential_id, quantity) VALUES (?, ?, ?, ?)`,
                [cartId, beverageId || null, essentialId || null, quantity || 1]
            );
        }

        res.json({ message: "Hozzáadva a kosárhoz!", cartId });
    } catch (err) {
        res.status(500).json({ error: 'Adatbázis hiba' });
    }
});

app.get('/api/cart/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const carts = await db.query("Select * from carts where user_id = ?", [userId])
        if (!carts.length) return res.json({ items: [] });

        const cartId = carts[0].id;

        const orderItems = await db.query(`
            SELECT ci.id, ci.quantity, 
                    ci.beverage_id, 
                    ci.essential_id,
                    COALESCE(b.name, e.name) AS name,
                    COALESCE(b.price, e.price) AS price
            FROM cart_items ci
            LEFT JOIN beverages b ON ci.beverage_id = b.id
            LEFT JOIN essentials e ON ci.essential_id = e.id
            WHERE ci.cart_id = ?
         `, [cartId]);

        res.json({ orderItems })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Hiba a kosár lekéréséhez.' })
    }
})

app.post('/api/orders', async (req, res) => {
    const { userId, orderItems, total } = req.body;
    if (!userId || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ error: "Hiányzó adatok a rendeléshez" });
  }
  console.log("orderItems:", orderItems)

    try {
        const orderItemsJSON = JSON.stringify(orderItems || req.body.orderItems);
        const result = await db.query("insert into orders (user_id, total, order_items) values (?,?,?)",
            [userId, total, orderItemsJSON]
        )
        const orderId = result.insertId

        //stock frissítés
        for(let item of orderItems){
            if(item.beverageId){
                await db.query("update beverages set stock = stock - ? where name = ? and stock >= ?"
                    ,[item.quantity, item.name, item.quantity]
                )
            }
            if(item.essentialId){
                await db.query("update essentials set stock = stock - ? where name = ? and stock >= ?"
                    ,[item.quantity, item.name, item.quantity]
                )
            }
        }
        // Kosár ürítése
        await db.query("DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)", [userId]);

        res.json({ message: 'Rendelés létrehozva', orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Hiba a rendelés mentésekor' });
    }
});


app.post("/api/contact" , async(req, res) =>{
    const {sender_name, sender_email, sender_phone, message} = req.body;
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