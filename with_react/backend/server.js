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

app.get('/api/cocktails', async (req, res) =>{
    try{
        const rows = await db.query('Select * from cocktails');
        res.json(rows)
    }catch(err){
    res.status(500).json({error: 'Adatbázis hiba'})
    }
})

app.get('/api/signatures', async (req, res) =>{
    try{
        const rows = await db.query('Select * from signatures');
        res.json(rows)
    }catch(err){
    res.status(500).json({error: 'Adatbázis hiba'})
    }
})


const PORT = 5000;
app.listen(PORT, () => console.log(`Server fut a ${PORT} porton`))