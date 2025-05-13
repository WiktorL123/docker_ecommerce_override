import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors"
const app = express();
const prisma = new PrismaClient();
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

app.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await prisma.order.findMany()
        if (orders.length === 0) {
            return   res.status(404).json({ message: "No orders found" });
        }
        console.log(orders, req.body);
        return  res.status(200).json({ orders });
    }
    catch (error) {
        return   res.status(500).json({error: "server error", message: error.mesage});
    }
});

app.post('/', authMiddleware, async (req, res) => {
    const { product, quantity, userId } = req.body;

    try {
        if (product === undefined || quantity === undefined || userId === undefined) {
            return res.status(400).json({ message: "missing properties" });
        }

        if (typeof product !== 'string' || typeof quantity !== 'number' || typeof userId !== 'number' || quantity < 0 || userId < 0) {
            return res.status(400).json({ message: "invalid data" });
        }

        const order = await prisma.order.create({
            data: { product, quantity, userId }
        });

       return  res.status(201).json(order);
    } catch (error) {
      return   res.status(500).json({ error: "server error", message: error.message });
    }
});




app.delete('/:id', authMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const order = await prisma.order.delete({
            where: { id }
        });
        return res.status(200).json(order);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "not found" });
        }
        return res.status(500).json({ error: "server error", message: error.message });
    }
});


app.put('/:id', authMiddleware, async (req, res) => {
    const { product, quantity } = req.body;
    const id = parseInt(req.params.id);

    try {
        const updates = {};
        if (product) updates.product = product;
        if (quantity) updates.quantity = quantity;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const order = await prisma.order.update({
            where: { id },
            data: updates
        });

        return res.status(200).json(order);

    } catch (error) {
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: "not found" });
        }
        return res.status(500).json({ error: "server error", message: error.message });
    }
});


app.listen(4000, () => {
    console.log('Orders service running on port 4000');
});
