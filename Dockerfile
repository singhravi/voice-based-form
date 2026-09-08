# ==========================================
# Stage 1: Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for optimal layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy project source files
COPY . .

# Build production bundle with TypeScript check
RUN npm run build

# ==========================================
# Stage 2: Production Stage with Nginx
# ==========================================
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
