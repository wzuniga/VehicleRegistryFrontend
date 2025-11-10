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

