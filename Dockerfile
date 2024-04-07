FROM node:lts-alpine3.19
WORKDIR /app
COPY package*.json .
RUN ["npm", "i"]
COPY . .
EXPOSE 5173 
CMD ["npm", "run", "dev"]
