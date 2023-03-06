FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ENV MONGODB_URL=mongodb://mongo:27017/mydatabase
ENV REDIS_URL=redis://redis:6379
ENV SUPER_ADMIN='summethsusubros@gmail.com'

EXPOSE 3000

CMD ["npm", "start"]
