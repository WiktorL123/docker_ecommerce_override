import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcryptjs';
const app = express();
const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient()
app.use(express.json());

let jwtSecret;

const loadSecret = async () => {
    try{
        jwtSecret = await fs.readFile('/run/secrets/jwt_secret', 'utf8');
        console.log("JWT secret found ");
    }
    catch(e){
        console.error('failed do load JWT', e);
        process.exit(1);
    }
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.hashedPassword);
        if (!match) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({ token });

    } catch (e) {
        return res.status(500).json({ error: "Failed to login", message: e.message });
    }
});

await loadSecret();

app.post('/verify', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ valid: false, message: 'Brak tokena' });

    const token = authHeader.split(' ')[1]; // oczekujemy 'Bearer <token>'
    try {
        const payload = jwt.verify(token, jwtSecret);
        res.status(200).json({ valid: true, userId: payload.userId });
    } catch (err) {
        res.status(401).json({ valid: false, message: 'Nieprawidłowy token' });
    }
});


app.listen(PORT, () => {
    console.log(`auth api started on port ${PORT}`);
})