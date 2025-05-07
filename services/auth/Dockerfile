FROM node:20-bookworm

WORKDIR /app

# libssl3 jest dostępny w Debian Bookworm (node:20-bookworm)
RUN apt-get update && apt-get install -y libssl3 ca-certificates && apt-get clean

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["node", "app.js"]
