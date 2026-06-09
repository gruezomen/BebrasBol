FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npm run prisma:generate

COPY . .

EXPOSE 4102

CMD ["sh", "-c", "npx prisma migrate deploy --schema prisma/schema.prisma && npm run dev"]
