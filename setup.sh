#!/bin/bash

echo "=========================================="
echo "  Setup Inicial - Vehicle Registry"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar Node.js
echo -e "${BLUE}[1/5] Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Instala Node.js desde: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Verificar npm
echo -e "${BLUE}[2/5] Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Instalar dependencias del proyecto
echo -e "${BLUE}[3/5] Instalando dependencias del proyecto...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencias instaladas${NC}"

# Instalar PM2 globalmente
echo -e "${BLUE}[4/5] Instalando PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error instalando PM2${NC}"
        echo "Intenta con: sudo npm install -g pm2"
        exit 1
    fi
    echo -e "${GREEN}✓ PM2 instalado${NC}"
else
    echo -e "${GREEN}✓ PM2 ya está instalado${NC}"
fi

# Instalar serve globalmente
echo -e "${BLUE}[5/5] Instalando serve...${NC}"
if ! command -v serve &> /dev/null; then
    npm install -g serve
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error instalando serve${NC}"
        echo "Intenta con: sudo npm install -g serve"
        exit 1
    fi
    echo -e "${GREEN}✓ serve instalado${NC}"
else
    echo -e "${GREEN}✓ serve ya está instalado${NC}"
fi

# Construir aplicación
echo ""
echo -e "${BLUE}Construyendo aplicación...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error construyendo aplicación${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Aplicación construida${NC}"

# Resumen
echo ""
echo "=========================================="
echo -e "${GREEN}  ✅ Setup completado exitosamente${NC}"
echo "=========================================="
echo ""
echo "Comandos disponibles:"
echo "  pm2 start ecosystem.config.cjs  - Iniciar app"
echo "  pm2 status                      - Ver estado"
echo "  pm2 logs                        - Ver logs"
echo "  ./deploy.sh                     - Desplegar"
echo ""
echo "Para iniciar ahora:"
echo "  pm2 start ecosystem.config.cjs"
echo "  pm2 save"
echo ""
