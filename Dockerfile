# Usar Node.js 20 como imagen base
FROM --platform=linux/arm64 node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Instala Angular CLI globalmente
RUN npm install -g @angular/cli


# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias, incluyendo las opcionales
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer puerto 4200
EXPOSE 4200

# Asegurar que Angular se sirva en todas las IPs
ENV HOST 0.0.0.0

# Comando por defecto para correr Angular
CMD ["tail", "-f", "/dev/null"]
