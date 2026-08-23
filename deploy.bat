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
echo ========================================
echo   DESPLIEGUE EXITOSO!
echo   dist/ actualizado. Nginx lo sirve directo, no hace falta reiniciar nada.
echo ========================================
goto end

:error
echo.
echo ========================================
echo   ERROR en el despliegue
echo ========================================
exit /b 1

:end
