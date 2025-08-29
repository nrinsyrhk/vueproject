# Base image for building the app
FROM node:16-alpine AS build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Vue 3 application
RUN npm run build

# Base image for serving the app
FROM nginx:stable-alpine AS production-stage

# Copy the built application from the build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a custom nginx configuration file if required
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default port used by nginx
EXPOSE 80

# Command to start nginx
CMD ["nginx", "-g", "daemon off;"]
