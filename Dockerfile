# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY src/frontend/package*.json ./

# Evita errores de dependencias
RUN npm install --legacy-peer-deps

COPY src/frontend .

# Build de producción
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Solo copiar lo necesario
COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]