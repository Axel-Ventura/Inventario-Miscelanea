FROM node:20-alpine

WORKDIR /app

COPY src/frontend/package.json src/frontend/package-lock.json ./
RUN npm install

COPY src/frontend .

EXPOSE 3000

CMD ["npm", "run", "dev"]
