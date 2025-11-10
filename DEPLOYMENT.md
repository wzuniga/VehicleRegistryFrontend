# Guía de Despliegue en Producción con PM2

## 📋 Requisitos Previos
- Node.js instalado
- PM2 instalado globalmente
- Servidor web (Nginx recomendado)

## 🚀 Pasos para Despliegue

### 1. Instalar PM2 globalmente
```bash
npm install -g pm2
```

### 2. Construir la aplicación para producción
```bash
npm run build
```
Esto generará la carpeta `dist/` con los archivos optimizados.

### 3. Instalar servidor HTTP estático
```bash
npm install -g serve
# O también puedes usar:
npm install --save-dev serve
```

### 4. Crear archivo de configuración PM2

Crea `ecosystem.config.cjs` en la raíz del proyecto:

```javascript
module.exports = {
  apps: [{
    name: 'vehicle-registry-frontend',
    script: 'serve',
    args: 'dist -s -l 5173',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5173
    }
  }]
};
```

### 5. Iniciar con PM2
```bash
# Iniciar la aplicación
pm2 start ecosystem.config.cjs

# Ver estado
pm2 status

# Ver logs
pm2 logs vehicle-registry-frontend

# Monitoreo
pm2 monit
```

### 6. Configurar PM2 para iniciar automáticamente
```bash
# Guardar la configuración actual
pm2 save

# Generar script de inicio automático
pm2 startup

# Ejecutar el comando que te muestra PM2 (específico para tu sistema)
```

## 🔄 Comandos Útiles de PM2

```bash
# Detener la aplicación
pm2 stop vehicle-registry-frontend

# Reiniciar la aplicación
pm2 restart vehicle-registry-frontend

# Recargar sin downtime
pm2 reload vehicle-registry-frontend

# Eliminar de PM2
pm2 delete vehicle-registry-frontend

# Ver logs en tiempo real
pm2 logs vehicle-registry-frontend --lines 100

# Limpiar logs
pm2 flush

# Información detallada
pm2 show vehicle-registry-frontend
```

## 🌐 Configuración de Nginx (Recomendado)

Crea `/etc/nginx/sites-available/vehicle-registry`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Activar configuración:
```bash
sudo ln -s /etc/nginx/sites-available/vehicle-registry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔐 Configuración con HTTPS (SSL)

Usando Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

## 📊 Monitoreo y Dashboard Web

```bash
# Instalar PM2 Web Dashboard
pm2 install pm2-server-monit

# O usar interfaz web
pm2 web
# Abre http://localhost:9615
```

## 🔄 Script de Actualización

Crea `deploy.sh`:

```bash
#!/bin/bash
echo "🚀 Iniciando despliegue..."

# Pull cambios
git pull origin main

# Instalar dependencias
npm install

# Construir
npm run build

# Reiniciar PM2
pm2 reload ecosystem.config.cjs

echo "✅ Despliegue completado"
```

Dar permisos:
```bash
chmod +x deploy.sh
```

## 📝 Variables de Entorno en Producción

Crea `.env.production`:
```env
VITE_API_BASE_URL=https://api.tu-dominio.com
```

Y modifica el build:
```bash
npm run build -- --mode production
```

## ⚠️ Troubleshooting

### Si PM2 no encuentra 'serve':
```bash
# Opción 1: Usar npx
pm2 start "npx serve dist -s -l 5173" --name vehicle-registry-frontend

# Opción 2: Ruta completa
which serve  # Obtener ruta
pm2 start /ruta/completa/serve -- dist -s -l 5173 --name vehicle-registry-frontend
```

### Si hay problemas de memoria:
```javascript
// En ecosystem.config.cjs
max_memory_restart: '500M'  // Ajustar según necesidad
```

## 🎯 Checklist de Despliegue

- [ ] Construir la aplicación (`npm run build`)
- [ ] Verificar variables de entorno
- [ ] Instalar PM2 globalmente
- [ ] Instalar serve
- [ ] Crear ecosystem.config.cjs
- [ ] Iniciar con PM2
- [ ] Configurar startup automático
- [ ] Configurar Nginx (opcional pero recomendado)
- [ ] Configurar SSL/HTTPS
- [ ] Verificar logs y monitoreo
- [ ] Probar la aplicación en producción

## 📱 Acceso

Una vez desplegado:
- Directamente: `http://tu-servidor:5173`
- Con Nginx: `http://tu-dominio.com`
- Con SSL: `https://tu-dominio.com`
