# Cards Components

Esta carpeta contiene los componentes de tarjetas reutilizables para la visualización de información de vehículos e inspecciones técnicas.

## Componentes

### VehicleInfoCard
Componente para mostrar la información completa del vehículo.

**Props:**
- `vehicleData` (object): Datos del vehículo
- `isLoading` (boolean): Estado de carga
- `searchPlate` (string): Placa buscada
- `onImageClick` (function): Callback cuando se hace click en la imagen

### InspectionCard
Componente individual para mostrar una inspección técnica en formato de tarjeta.

**Props:**
- `inspection` (object): Datos de la inspección
  - `ESTADO`: Estado de la inspección (VIGENTE/VENCIDO)
  - `RESULTADO`: Resultado de la inspección
  - `NRO_CERTI`: Número de certificado
  - `REVISIONVIGENCIAINICIO`: Fecha de inicio de vigencia
  - `REVISIONVIGENCIAFINAL`: Fecha de fin de vigencia
  - `SRAZONSOCENTCER`: Centro de inspección
- `onShowDetails` (function): Callback para mostrar detalles completos

### InspectionModal
Modal para mostrar los detalles completos de una inspección técnica.

**Props:**
- `inspection` (object): Datos completos de la inspección
- `isOpen` (boolean): Estado del modal (abierto/cerrado)
- `onClose` (function): Callback para cerrar el modal

### ImageModal
Modal para mostrar la imagen del vehículo en tamaño completo.

**Props:**
- `imageBase64` (string): Imagen en formato base64
- `isOpen` (boolean): Estado del modal (abierto/cerrado)
- `onClose` (function): Callback para cerrar el modal

## Uso

```jsx
import { VehicleInfoCard, InspectionCard, InspectionModal, ImageModal } from './components/cards';

// VehicleInfoCard
<VehicleInfoCard
  vehicleData={data}
  isLoading={false}
  searchPlate="ABC123"
  onImageClick={() => setModalOpen(true)}
/>

// InspectionCard
<InspectionCard
  inspection={inspectionData}
  onShowDetails={handleShowDetails}
/>

// Modals
<InspectionModal
  inspection={selectedInspection}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>

<ImageModal
  imageBase64={imageData}
  isOpen={isImageModalOpen}
  onClose={() => setIsImageModalOpen(false)}
/>
```

## Estilos

Cada componente tiene su propio archivo CSS:
- `VehicleInfoCard.css`
- `InspectionCard.css`
- `InspectionModal.css`
- `ImageModal.css`

Los estilos están diseñados para ser consistentes con el tema general de la aplicación.
