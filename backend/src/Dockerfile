FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDeps for TypeScript build)
RUN npm ci

# Copy source
COPY . .

# Build TypeScript → dist/
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Railway injects PORT at runtime — don't hardcode EXPOSE
EXPOSE 8080

CMD ["node", "dist/index.js"]