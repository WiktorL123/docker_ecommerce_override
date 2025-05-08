import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('supersekretnehaslo', 10);
    await prisma.user.upsert({
        where: { email: 'maniek@example.com' },
        update: {},
        create: {
            email: 'maniek@example.com',
            hashedPassword: hash
        }
    });
}

main()
    .then(() => {
        console.log(' Seed complete');
        return prisma.$disconnect();
    })
    .catch(e => {
        console.error(' Seed failed', e);
        return prisma.$disconnect();
    });
