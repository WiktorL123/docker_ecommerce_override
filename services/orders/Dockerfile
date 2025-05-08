FROM node:20-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y libssl3 ca-certificates && apt-get clean

COPY services/orders/package*.json ./
RUN npm install

COPY services/auth/node_modules/@prisma ./node_modules/@prisma
COPY services/auth/node_modules/.prisma ./node_modules/.prisma

COPY services/orders/. .

CMD ["node", "app.js"]
