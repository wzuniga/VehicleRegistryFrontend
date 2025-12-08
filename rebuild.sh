#!/bin/bash

echo "🔧 Reconstruyendo con variables de producción..."

# Construir con modo producción explícito
NODE_ENV=production npm run build

# Verificar que dist existe
if [ ! -d "dist" ]; then
    echo "❌ Error: carpeta dist no se generó"
    exit 1
fi

# Verificar archivo de configuración (opcional - para debug)
echo ""
echo "📋 Verificando build..."
ls -la dist/

echo ""
echo "🔄 Recargando PM2..."
pm2 reload vehicle-registry-frontend

echo ""
echo "📊 Estado:"
pm2 status

echo ""
echo "📝 Logs (últimas 20 líneas):"
pm2 logs vehicle-registry-frontend --lines 20 --nostream

echo ""
echo "✅ Aplicación actualizada"
echo "🌐 URL: http://143.110.206.161:5173"
echo ""
echo "Para ver logs en tiempo real:"
echo "  pm2 logs vehicle-registry-frontend"
