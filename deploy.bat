@echo off
echo ========================================
echo   Vehicle Registry Frontend - Deploy
echo ========================================
echo.

echo [1/5] Obteniendo ultimos cambios...
git pull origin main
if errorlevel 1 goto error

echo.
echo [2/5] Instalando dependencias...
call npm install
if errorlevel 1 goto error

echo.
echo [3/5] Construyendo aplicacion...
call npm run build
if errorlevel 1 goto error

echo.
echo [4/5] Reiniciando con PM2...
pm2 describe vehicle-registry-frontend >nul 2>&1
if errorlevel 1 (
    echo Iniciando aplicacion con PM2...
    pm2 start ecosystem.config.cjs
) else (
    echo Recargando aplicacion con PM2...
    pm2 reload ecosystem.config.cjs
)
if errorlevel 1 goto error

echo.
echo [5/5] Guardando configuracion PM2...
pm2 save
if errorlevel 1 goto error

echo.
echo ========================================
echo   Estado de la aplicacion:
echo ========================================
pm2 status

echo.
echo ========================================
echo   DESPLIEGUE EXITOSO!
echo   Aplicacion: http://localhost:5173
echo ========================================
goto end

:error
echo.
echo ========================================
echo   ERROR en el despliegue
echo ========================================
exit /b 1

:end
