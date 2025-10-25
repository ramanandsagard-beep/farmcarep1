FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
ENV PORT=3001 NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main.js"]
