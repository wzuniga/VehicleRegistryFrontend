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

# Nginx sirve dist/ directo del disco: no hace falta reiniciar ningún proceso,
# el nuevo build queda disponible de inmediato en la siguiente petición.
# (Si en tu servidor usas el modo alternativo con PM2 + serve, ver DEPLOYMENT.md)

echo -e "${GREEN}✅ Despliegue completado exitosamente!${NC}"
echo -e "${GREEN}🌐 dist/ actualizado. Nginx ya lo está sirviendo.${NC}"
