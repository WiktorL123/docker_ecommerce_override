FROM node:20-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y libssl3 ca-certificates && apt-get clean

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]
