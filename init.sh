#!/bin/bash
docker exec -it compose-auth-1 sh -c "npx prisma migrate dev --name init && npm run seed"
