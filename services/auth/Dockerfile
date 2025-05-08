FROM node:20-slim

WORKDIR /app

# Zainstaluj minimalne biblioteki systemowe wymagane przez Prisma
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["node", "app.js"]
