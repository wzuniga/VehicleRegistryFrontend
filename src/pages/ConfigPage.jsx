import { useState } from 'react';
import { readServiceConfig, writeServiceConfig } from '../utils/serviceConfig';
import './ConfigPage.css';

const SERVICES = [
  {
    key: 'vehicleInfo',
    label: 'Información vehicular',
    description: 'Datos del vehículo: marca, modelo, año, color, propietario e imagen.',
    endpoint: '/vehicles/plate/{placa}',
  },
  {
    key: 'sunarp',
    label: 'Historial SUNARP',
    description: 'Historial registral de transferencias de propiedad y cambios de titularidad.',
    endpoint: '/sprl-sunarp/plate/{placa}',
  },
  {
    key: 'insurance',
    label: 'Historial de seguros (SBS)',
    description: 'Accidentes reportados ante la SBS: SOAT, seguros privados y certificados CAT.',
    endpoint: '/sbs-insurance/plate/{placa}',
  },
  {
    key: 'inspection',
    label: 'Inspección técnica',
    description: 'Historial de revisiones técnicas vehiculares y vigencia del último certificado.',
    endpoint: '/inspeccion-vehicular/plate/{placa}',
  },
  {
    key: 'soatApeseg',
    label: 'SOAT APESEG',
    description: 'Pólizas SOAT emitidas: estado de vigencia, compañía aseguradora y uso del vehículo.',
    endpoint: '/soat-apeseg/plate/{placa}',
  },
];

const ConfigPage = () => {
  const [config, setConfig] = useState(() => readServiceConfig());

  const handleToggle = (key) => {
    const updated = { ...config, [key]: !config[key] };
    setConfig(updated);
    writeServiceConfig(updated);
  };

  const enabledCount = Object.values(config).filter(Boolean).length;

  return (
    <div className="config-page">
      <div className="config-page__header">
        <div className="config-page__header-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <div>
          <h2 className="config-page__title">Configuración de servicios</h2>
          <p className="config-page__subtitle">
            Activa o desactiva los servicios de consulta. Los servicios desactivados no realizarán
            peticiones al servidor ni mostrarán datos, lo que mejora la velocidad de carga.
          </p>
        </div>
      </div>

      <div className="config-page__notice">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>
          {enabledCount === SERVICES.length
            ? 'Todos los servicios están activos.'
            : `${enabledCount} de ${SERVICES.length} servicios activos. Los cambios se aplican en la próxima búsqueda.`}
        </span>
      </div>

      <div className="config-page__cards">
        {SERVICES.map((service) => (
          <label
            key={service.key}
            className={`config-card ${config[service.key] ? 'config-card--enabled' : 'config-card--disabled'}`}
            htmlFor={`toggle-${service.key}`}
          >
            <div className="config-card__info">
              <span className="config-card__label">{service.label}</span>
              <span className="config-card__desc">{service.description}</span>
              <span className="config-card__endpoint">{service.endpoint}</span>
            </div>
            <div className="config-card__toggle-wrap">
              <input
                type="checkbox"
                id={`toggle-${service.key}`}
                className="config-card__checkbox"
                checked={config[service.key]}
                onChange={() => handleToggle(service.key)}
              />
              <span className="config-card__toggle" aria-hidden="true">
                <span className="config-card__toggle-thumb" />
              </span>
              <span className={`config-card__status ${config[service.key] ? 'config-card__status--on' : 'config-card__status--off'}`}>
                {config[service.key] ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ConfigPage;
