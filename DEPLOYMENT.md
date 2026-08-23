# Guía de Despliegue en Producción

## Enfoque actual (en uso): Nginx sirviendo el build estático directo

**Este es el método realmente desplegado**, en el mismo VPS que el backend (`137.184.208.111`, ver `DEPLOYMENT.md`/`README.md` de `VehicleRegistryBackend`). Nginx lee los archivos de `dist/` directo del disco — no hace falta un proceso Node ni PM2 corriendo para el frontend.

### 1. Construir la aplicación para producción
```bash
npm install
npm run build
```
Esto genera `dist/` usando `.env.production` (`VITE_API_BASE_URL=/api`, ruta relativa al mismo origen — sin CORS).

### 2. Nginx sirve `dist/` y proxya `/api`

Un solo `server` block en Nginx cubre frontend + backend (ver el detalle completo, con el `location /api/`, en el README de `VehicleRegistryBackend`):

```nginx
server {
    listen 80;
    server_name tu-dominio.com;   # o tu IP

    root /opt/VehicleRegistryFrontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;   # necesario por React Router (SPA)
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/vehicle-registry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Actualizar en producción

```bash
cd /opt/VehicleRegistryFrontend
./deploy.sh   # git pull + npm install + npm run build. Nginx recoge el nuevo dist/ solo, sin reiniciar nada.
```

### 4. HTTPS (cuando haya un dominio)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

No hace falta cambiar `VITE_API_BASE_URL` al pasar a HTTPS: al ser una ruta relativa (`/api`), sigue apuntando al mismo origen.

---

## Alternativa: PM2 + `serve` (solo si no se usa Nginx delante)

Si en algún escenario se necesita correr el frontend como su propio proceso (por ejemplo detrás de un load balancer que no puede servir archivos estáticos), `ecosystem.config.cjs` ya trae esta opción lista:

```bash
npm install -g pm2 serve
npm run build
pm2 start ecosystem.config.cjs   # sirve dist/ con `serve` en el puerto 5173
pm2 save
pm2 startup
```

Comandos útiles: `pm2 status`, `pm2 logs vehicle-registry-frontend`, `pm2 restart vehicle-registry-frontend`, `pm2 monit`.

Si se usa este modo, Nginx pasaría a hacer proxy hacia `http://127.0.0.1:5173` en vez de servir `dist/` directo — pero **esto no es lo desplegado actualmente**.

## ⚠️ Troubleshooting

### Si el build se queda "Killed" (sin terminar, sin error claro)
Es OOM (memoria insuficiente) — típico en droplets pequeños (≤1GB RAM) corriendo `vite build`. Solución: habilitar swap en el servidor.
```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Si PM2 no encuentra 'serve' (solo aplica al modo alternativo)
```bash
pm2 start "npx serve dist -s -l 5173" --name vehicle-registry-frontend
```

## 🎯 Checklist de Despliegue

- [ ] `npm install && npm run build`
- [ ] `.env.production` con `VITE_API_BASE_URL=/api`
- [ ] Nginx configurado (sirviendo `dist/` + proxy `/api/`)
- [ ] Swap habilitado si el servidor tiene poca RAM
- [ ] SSL/HTTPS configurado (si hay dominio)
- [ ] Probar la aplicación en producción
