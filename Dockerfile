# Stage 1: Build dependencies
FROM node:20-slim AS builder

WORKDIR /app

# Install build tools for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime image with PM2 and Nginx
FROM node:20-slim

# Install PM2 and Nginx
RUN npm install -g pm2 && \
    apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built app and nginx config
COPY --from=builder /app /app
COPY nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Add PM2 config
COPY pm2.config.js .

# Set up Nginx logs
RUN mkdir -p /var/run/nginx /var/log/nginx

# Expose HTTP port
EXPOSE 80

# Run both PM2 and Nginx
CMD sh -c "nginx && pm2-runtime pm2.config.js"
