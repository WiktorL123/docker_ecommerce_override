FROM node:20-slim

RUN apt-get update && \
    apt-get install -y wget ca-certificates && \
    wget http://security.debian.org/debian-security/pool/updates/main/o/openssl/libssl1.1_1.1.1w-0+deb11u2_arm64.deb && \
    dpkg -i libssl1.1_1.1.1w-0+deb11u2_arm64.deb && \
    rm libssl1.1_1.1.1w-0+deb11u2_arm64.deb

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["node", "app.js"]
