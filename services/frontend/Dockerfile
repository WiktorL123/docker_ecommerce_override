# Etap 1: Dev-only Node + Alpine
FROM node:18-alpine AS dev

# Katalog roboczy
WORKDIR /app

# Dla niektórych zależności (Vite, Tailwind) potrzebny bash i libc
RUN apk add --no-cache bash libc6-compat

# Kopiujemy tylko to, co potrzebne na tym etapie
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Dopiero teraz kopiujemy cały kod źródłowy
COPY . .

# Wystawiamy port Vite
EXPOSE 5173

# Start dev serwera
CMD ["npm", "run", "dev"]
