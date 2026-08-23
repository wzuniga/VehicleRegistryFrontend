# Vehicle Registry Frontend

Aplicación React para gestión de placas de vehículos.

## 🚀 Tecnologías

- **React** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes reutilizables (Button, Input)
│   └── forms/           # Componentes de formularios
├── pages/               # Páginas de la aplicación
│   └── AddCarPlate.jsx  # Página para agregar placas
├── services/            # Servicios API
│   ├── api.js           # Configuración de axios
│   └── carPlateService.js  # Servicio de placas
├── hooks/               # Custom hooks
├── utils/               # Utilidades
└── styles/              # Estilos globales
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu URL del backend
```

## 🏃‍♂️ Ejecución

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🌐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 🚀 Despliegue a Producción

**Arquitectura actual (en vivo):** este build estático se sirve directamente desde Nginx en el mismo VPS que el backend (`137.184.208.111`) — no corre bajo Node/PM2 en producción, Nginx lee los archivos de `dist/` directo del disco. El backend vive en el mismo servidor, expuesto solo bajo `/api/*` (mismo origen, sin CORS). Ver el detalle completo (diagrama, config de Nginx) en el `README.md` de `VehicleRegistryBackend`.

```
Internet ──80──▶ Nginx (137.184.208.111)
                    ├── /      → este dist/ (estático)
                    └── /api/* → proxy a VehicleRegistryBackend (PM2, 127.0.0.1:3000)
```

### Variables de entorno de producción

`.env.production` (en este repo, ya versionado — no lleva secretos):
```env
VITE_API_BASE_URL=/api
```

Al ser una ruta relativa, el build funciona igual sea cual sea el dominio/IP con el que se acceda — todas las llamadas de `axios` van al mismo origen bajo `/api`, sin necesidad de configurar CORS en el backend.

### Actualizar en producción

```bash
cd /opt/VehicleRegistryFrontend
git pull origin main
npm install
npm run build   # regenera dist/, Nginx lo sirve automáticamente (no hace falta reiniciar nada)
```

El script `deploy.sh` hace exactamente esto. Como Nginx sirve `dist/` directo del disco, **no se necesita PM2 ni `serve` para el frontend en este despliegue** — `ecosystem.config.cjs` queda solo como alternativa por si en algún momento se sirve el frontend sin Nginx delante.

### Primera vez en un servidor nuevo

Ver la sección "Despliegue a Producción" del `README.md` de `VehicleRegistryBackend` para la instalación de Node/Nginx/PM2 y la config completa de Nginx (frontend + proxy `/api`).

## 📱 Rutas

- `/addcarplate` - Página para agregar nuevas placas

## 🎨 Componentes Reutilizables

### Input
```jsx
<Input
  label="Etiqueta"
  value={value}
  onChange={handleChange}
  placeholder="Placeholder"
  error="Mensaje de error"
/>
```

### Button
```jsx
<Button
  variant="primary" // primary, secondary, danger
  loading={false}
  onClick={handleClick}
>
  Texto del botón
</Button>
```

## 🔌 Servicios API

### carPlateService

```javascript
// Agregar placa
const result = await carPlateService.addPendingCarPlate('BNP276');

// Obtener placas pendientes
const result = await carPlateService.getPendingCarPlates();
```

## 📝 Mejores Prácticas

- ✅ Componentes reutilizables y modulares
- ✅ Separación de responsabilidades
- ✅ Manejo centralizado de errores
- ✅ Validación de formularios
- ✅ Variables de entorno para configuración
- ✅ Código documentado
- ✅ Estilos componentizados

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

