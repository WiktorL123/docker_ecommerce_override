import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import {PrismaClient} from "@prisma/client";
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
    const {email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({where: {email}});
        if (!user || user.hashedPassword !== password){
            res.status(404).json({message: "User not found"});
        }
        const token = jwt.sign({userId: user.id}, jwtSecret, {expiresIn: '1h'});
        res.status(200).json({token: token});
    }
    catch(e) {
        res.status(500).json({error:"Failed to login", message: e});
    }
})
await loadSecret();

app.listen(PORT, () => {
    console.log(`auth api started on port ${PORT}`);
})