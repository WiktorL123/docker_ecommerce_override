import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import cors from "cors"


const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors())

app.use(express.json());

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
    try {
        const users = await prisma.user.findMany();
        if (users.length === 0) {
            return res.status(404).json({ message: 'no user found' });
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'server error', message: err.message });
    }
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, hashedPassword }
        });
        console.log(req.body);
        res.status(201).json({ message: 'User registered', user });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed', message: err.message });
    }
});

app.delete('/:id', authMiddleware, async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.user.delete({
            where: { id: userId }
        });
        res.status(200).json({ message: 'User deleted', user });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ error: 'Deletion failed', message: err.message });
    }
});

app.put('/:id', authMiddleware, async (req, res) => {
    const userId = parseInt(req.params.id);
    const { email, password } = req.body;

    try {
        const updates = {};
        if (email) updates.email = email;
        if (password) updates.hashedPassword = await bcrypt.hash(password, 10);

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Nothing to update' });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updates
        });

        res.status(200).json({ message: 'User updated', user });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ error: 'Update failed', message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Users service running on port ${PORT}`);
    console.log(process.env.DATABASE_URL);
    console.log(process.env.NODE_ENV);
});
