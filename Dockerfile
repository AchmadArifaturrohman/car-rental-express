# Use a compatible Node.js image as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app and apply migrations
CMD ["sh", "-c", "npx prisma migrate dev && yarn dev"]