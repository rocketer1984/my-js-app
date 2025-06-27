FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other files
COPY . .

# Expose port your backend listens on
EXPOSE 3000

# Start backend server
CMD ["node", "server.js"]