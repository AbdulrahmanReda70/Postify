# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package.json first
COPY package*.json ./

# Install deps inside container
RUN npm install

# Don’t copy source code here (local code will be mounted as a volume)
# COPY . .

# Start development server
CMD ["npm", "start"]
