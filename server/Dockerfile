# Use the official Node.js image as the base image
FROM node:20

USER root

ENV APP_NAME=310_project_server
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json /app
COPY package-lock.json /app

# Install dependencies
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application code to the working directory
COPY . /app
RUN chown -Rf 1001:0 /app && \
chmod -Rf g+rw /app

RUN mkdir /.npm
RUN chown -R 1001:0 "/.npm"

# Expose the port the app runs on
EXPOSE 5000

USER 1001

# Set the default command to run the backend in development mode
CMD ["npm", "run", "dev"]
