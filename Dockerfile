From node:19.4

ENV DEV_DATABASE_URL="postgres://admin:password@postgressql/meeting_dev" \
    TEST_DATABASE_URL="" \
    DATABASE_URL="" 

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node","app.js"]
