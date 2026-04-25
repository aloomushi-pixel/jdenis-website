FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# Ensure uploads directory exists and is writable
RUN mkdir -p uploads && chown -R node:node uploads

EXPOSE 4000

# Run as non-root user for security
USER node

CMD ["npm", "start"]
