FROM node:23-alpine

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --only=production --omit=dev


COPY prisma ./prisma
RUN npx prisma generate

COPY ./dist ./ 

EXPOSE 3000

CMD node main
