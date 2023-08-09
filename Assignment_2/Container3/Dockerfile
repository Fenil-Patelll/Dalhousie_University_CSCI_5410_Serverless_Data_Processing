# Use the Node.js 18.14 base image
FROM node:18.14.0

# Set the working directory in the container
WORKDIR /app

# Copy all the files and folders to the container
COPY . .

RUN npm uninstall bcrypt
RUN npm install bcryptjs
RUN npm install bcrypt

# Expose the port on which the application will run (change it if necessary)
EXPOSE 3003

# Start the application
CMD ["node", "app.js"]
