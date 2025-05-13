#!/bin/sh
echo "start-dev ...."
echo "🟡 Czekam na bazę danych..."
sleep 5

echo "🔁 Migracja i generowanie klienta Prisma..."
npx prisma migrate deploy && npm run seed

echo "✅ Start aplikacji"
node app.js
