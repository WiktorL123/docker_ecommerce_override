#!/bin/bash
echo "incjowanie danych w User..."
docker exec -it compose-auth-1 sh -c "npx prisma migrate dev --name init && npm run seed"
#sleep 2
#echo "inicjowanie danych w Order..."
docker exec -it compose-orders-1 sh -c "npx prisma migrate dev --name init_orders && npm run seed"
