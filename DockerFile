FROM node

WORKDIR /app

COPY package.json /app

COPY tsconfig.json .

RUN npm install && npm install typescript -g

COPY . .

ENV PORT 4444

VOLUME [ "/app" ]

RUN  tsc

EXPOSE $PORT

CMD ["node", "dist/index.js"]
