#!/bin/sh

echo "🟡 Czekam na bazę danych..."
sleep 5

echo "🔁 Migracja i generowanie klienta Prisma..."
npx prisma migrate dev --name init && npm run seed

echo "✅ Start aplikacji"
node app.js
