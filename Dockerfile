## BUILD APP
FROM node:16-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build


## CONTAINERIZE BUILT APP
FROM node:current-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --production
COPY --from=builder /app/build .

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "server.js"]
