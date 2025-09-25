import express from 'express';
import mariadb from 'mariadb'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

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



// Kosárhoz adás
app.post('/api/cart', async (req, res) => {
    const { userId, cocktailId, quantity } = req.body;
    if (!userId || !cocktailId || !quantity) {
        return res.status(400).json({ error: 'Hiányzó adatok' });
    }
    try {
        const result = await db.query(
            'INSERT INTO cart (user_id, cocktail_id, quantity) VALUES (?, ?, ?)',
            [userId, cocktailId, quantity]
        );
        res.status(201).json({ message: 'Kosár frissítve', cartId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Adatbázis hiba' });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server fut a ${PORT} porton`))