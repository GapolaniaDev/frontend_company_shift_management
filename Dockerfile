# Angular dev: usa Node 20 (alpine = más liviano)
FROM node:20-alpine

WORKDIR /app

# Evita prompts de analytics y mejora file-watching en Docker
ENV NG_CLI_ANALYTICS=ci
ENV CHOKIDAR_USEPOLLING=true

# Instala deps
COPY package*.json ./
RUN npm ci

# Copia el código
COPY . .

# Expone el puerto del dev server
EXPOSE 4200

# Ejecuta Angular CLI sirviendo en 0.0.0.0
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]
