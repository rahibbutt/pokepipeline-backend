# Stage 1: Build dependencies
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime image with PM2 and Nginx
FROM node:20-alpine

# Install PM2 and Nginx
RUN npm install -g pm2 && apk add --no-cache nginx

WORKDIR /app

# Copy built app and nginx config
COPY --from=builder /app /app
COPY nginx.conf /etc/nginx/http.d/default.conf

# Add PM2 config
COPY pm2.config.js .

# Set up Nginx logs (optional but good practice)
RUN mkdir -p /var/run/nginx /var/log/nginx

# Expose HTTP port
EXPOSE 80

# Run both PM2 and Nginx
CMD sh -c "nginx && pm2-runtime pm2.config.js"
#CMD ["l", "-f", "/dev/null"]
