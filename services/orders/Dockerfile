FROM node:20-bookworm

WORKDIR /app

# 1. Instalacja zależności systemowych
RUN apt-get update && apt-get install -y libssl3 ca-certificates && apt-get clean

# 2. Kopiujemy package.json i instalujemy zależności
COPY services/orders/package*.json ./
RUN npm install

# 3. Kopiujemy schema.prisma i ewentualne migracje z auth
COPY services/auth/prisma ./prisma

# 4. Generujemy Prisma Clienta (używając schema z auth)
RUN npx prisma generate

# 5. Kopiujemy resztę kodu aplikacji
COPY services/orders/. .

# 6. Uruchomienie API
CMD ["node", "app.js"]

