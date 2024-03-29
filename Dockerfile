FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Use npm ci to only install `dependencies` and not `devDependencies`
RUN npm ci --only=production

COPY . .

CMD ["node", "index.js"]
