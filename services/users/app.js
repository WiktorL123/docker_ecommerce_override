import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pkg;


const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

import fetch from 'node-fetch';

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Brak tokena' });

    try {
        const response = await fetch('http://auth:4000/verify', {
            method: 'POST',
            headers: { Authorization: authHeader }
        });

        const data = await response.json();

        if (!response.ok || !data.valid) {
            return res.status(401).json({ message: 'Token nieprawidłowy' });
        }

        req.userId = data.userId;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Błąd autoryzacji', message: err.message });
    }
};


app.get('/', async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM "User"');
        if (result.rows.length === 0){
            return res.status(404).json({message: 'no user found'})
        }
        res.status(200).json(result.rows)

    }catch(err){
        res.status(500).json({error:"server error", message:err.message});
    }


});
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO "User" (email, "hashedPassword") VALUES ($1, $2) RETURNING *',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed', message: err.message });
    }
});

app.delete('/:id', authMiddleware, async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const result = await pool.query(
            'DELETE FROM "User" WHERE id = $1 RETURNING *',
            [userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Deletion failed', message: err.message });
    }
});
app.put('/:id', authMiddleware, async (req, res) => {
    const userId = parseInt(req.params.id);
    const { email, password } = req.body;

    try {
        let query = 'UPDATE "User" SET ';
        const values = [];
        let index = 1;

        if (email) {
            query += `"email" = $${index++}, `;
            values.push(email);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `"hashedPassword" = $${index++}, `;
            values.push(hashedPassword);
        }

        if (values.length === 0) {
            return res.status(400).json({ message: 'Nothing to update' });
        }

        query = query.slice(0, -2) + ` WHERE id = $${index} RETURNING *`;
        values.push(userId);

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated', user: result.rows[0] });

    } catch (err) {
        res.status(500).json({ error: 'Update failed', message: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`🧠 Users service running on port ${PORT}`);
    console.log(process.env.DATABASE_URL)
});
