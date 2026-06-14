FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --prefer-offline --no-audit

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --prefer-offline --no-audit

COPY --from=builder /app/dist ./dist

COPY server.js .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
