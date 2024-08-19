# Stage 1: Build the React app
FROM node:22-alpine3.19 as build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock (if present) to install dependencies first
COPY package*.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile --verbose

# Copy the rest of the application code
COPY . .

# Build the React app
RUN yarn run build

# Stage 2: Set up Nginx to serve the React app
FROM nginx:alpine

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
