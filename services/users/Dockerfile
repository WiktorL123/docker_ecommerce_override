FROM node:20-slim

WORKDIR /app

# Instalacja tylko potrzebnych bibliotek
RUN apt-get update && apt-get install -y \
    ca-certificates \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "app.js"]
