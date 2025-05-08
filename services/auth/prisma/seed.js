import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('haslo123', 10);
    const user = await prisma.user.create({
        data: {
            email: 'maniek@example.com',
            hashedPassword: hash,
            orders: {
                create: [
                    { product: 'Banany', quantity: 2 },
                    { product: 'Jabłka', quantity: 5 }
                ]
            }
        }
    });
    console.log('Seed complete:', user);
}

main()
    .then(() => prisma.$disconnect())
    .catch(err => {
        console.error(err);
        prisma.$disconnect();
        process.exit(1);
    });
