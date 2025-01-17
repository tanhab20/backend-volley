FROM cypress/included:12.10.0

WORKDIR /app

COPY /package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "runOnChrome"]
