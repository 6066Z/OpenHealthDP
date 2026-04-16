# --- Build Stage ---
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source and config
COPY tsconfig.json ./
COPY src ./src
COPY config ./config

# Build TypeScript
RUN npm run build

# --- Production Stage ---
FROM node:20-slim

WORKDIR /app

# Install ONLY production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled code and config from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

# Security: Run as non-privileged user
USER node

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
