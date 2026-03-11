# ── Build stage ──────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Layer 1: Cache npm dependencies (chỉ re-run khi package files thay đổi)
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

# Layer 2: Build source (chỉ re-run khi source thay đổi)
COPY index.html vite.config.ts tsconfig.json postcss.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build

# ── Production stage ─────────────────────────────────────
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
