# Use Node.js 18 as the base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all remaining application files
COPY . .

# Expose port 3000 (where your app runs)
EXPOSE 3000

# Command to run when container starts
CMD ["node", "src/app.js"]