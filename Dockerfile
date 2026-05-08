# =============================================
# DOCKERFILE — FitTracker Frontend (Angular)
# Multi-stage build : build + serve avec Nginx
# =============================================

# ── STAGE 1 : Build Angular ──────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copie les fichiers de dépendances en premier (cache Docker)
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm ci --silent

# Copie le reste du code source
COPY . .

# Build de production Angular
RUN npm run build -- --configuration production

# ── STAGE 2 : Serve avec Nginx ───────────────
FROM nginx:1.25-alpine AS production

# Supprime la config Nginx par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie le build Angular vers Nginx
COPY --from=builder /app/dist/projet-angular /usr/share/nginx/html

# Copie la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80
EXPOSE 80

# Démarre Nginx
CMD ["nginx", "-g", "daemon off;"]
