# Stage 1: Build the React app
FROM node:18-alpine3.17 as build
WORKDIR /app
COPY . /app
RUN yarn install --verbose
RUN yarn run build

# Stage 2: Set up Nginx to serve the React app
FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx html folder
COPY --from=build /app/dist /var/www/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
