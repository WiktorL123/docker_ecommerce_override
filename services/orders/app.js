import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', async (req, res) => {
    const orders = await prisma.order.findMany();
    res.json(orders);
});

app.listen(4000, () => {
    console.log(' Orders service running on port 4000');
});
