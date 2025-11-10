#!/bin/bash

echo "🚀 Iniciando despliegue de Vehicle Registry Frontend..."

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Pull cambios del repositorio
echo -e "${BLUE}📥 Obteniendo últimos cambios...${NC}"
git pull origin main

# Instalar/actualizar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

# Construir aplicación
echo -e "${BLUE}🔨 Construyendo aplicación...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error construyendo aplicación${NC}"
    exit 1
fi

# Instalar serve si no está instalado
if ! command -v serve &> /dev/null; then
    echo -e "${BLUE}📦 Instalando serve globalmente...${NC}"
    npm install -g serve
fi

# Verificar si PM2 está corriendo la app
if pm2 describe vehicle-registry-frontend > /dev/null 2>&1; then
    echo -e "${BLUE}🔄 Recargando aplicación con PM2...${NC}"
    pm2 reload ecosystem.config.cjs
else
    echo -e "${BLUE}🚀 Iniciando aplicación con PM2...${NC}"
    pm2 start ecosystem.config.cjs
fi

# Guardar configuración de PM2
pm2 save

# Mostrar estado
echo -e "${BLUE}📊 Estado de la aplicación:${NC}"
pm2 status

echo -e "${GREEN}✅ Despliegue completado exitosamente!${NC}"
echo -e "${GREEN}🌐 Aplicación disponible en: http://localhost:5173${NC}"
