#!/bin/sh

echo " Czekam na bazę danych..."
sleep 5

echo " Migracja..."
npx prisma migrate deploy

echo " Start aplikacji..."
node app.js
