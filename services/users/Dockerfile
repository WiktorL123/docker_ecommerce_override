FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY services/users/package*.json ./
RUN npm install

COPY services/auth/prisma ./prisma
RUN npx prisma generate

COPY services/users/. .

CMD ["node", "app.js"]
