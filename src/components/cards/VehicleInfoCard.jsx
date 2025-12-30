import PropTypes from 'prop-types';
import './VehicleInfoCard.css';

const VehicleInfoCard = ({
  vehicleData,
  isLoading,
  searchPlate,
  onImageClick
}) => {
  if (isLoading) {
    return (
      <div className="info-card">
        <div className="card-header">
          <h3>Información del Vehículo</h3>
        </div>
        <div className="card-content">
          <div className="card-loader">
            <div className="small-loader"></div>
            <p>Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicleData) {
    return (
      <div className="info-card">
        <div className="card-header">
          <h3>Información del Vehículo</h3>
        </div>
        <div className="card-content">
          <p className="no-data">No se encontraron datos del vehículo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-card">
      <div className="card-header">
        <h3>Información del Vehículo</h3>
        {false && (
          <div className="warning-icon" title="Información referencial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        )}
      </div>
      <div className="card-content">
        <div className="vehicle-info">
          {vehicleData.imageBase64 ? (
            <div className="vehicle-image-container">
              <img
                src={`data:image/jpeg;base64,${vehicleData.imageBase64}`}
                alt="Vehículo"
                className="vehicle-image"
                onClick={onImageClick}
              />
            </div>
          ) : (
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Placa</span>
                <span className="info-value">{vehicleData.currentPlate || searchPlate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Marca</span>
                <span className="info-value">{vehicleData.brand || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Modelo</span>
                <span className="info-value">{vehicleData.model || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Año</span>
                <span className="info-value">{vehicleData.modelYear || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Color</span>
                <span className="info-value">{vehicleData.color || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado</span>
                <span className="info-value">{vehicleData.state || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Serie</span>
                <span className="info-value">{vehicleData.serialNumber || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Motor</span>
                <span className="info-value">{vehicleData.engineNumber || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Placa Anterior</span>
                <span className="info-value">{vehicleData.previousPlate || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Propietario</span>
                <span className="info-value">{vehicleData.owners || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sucursal</span>
                <span className="info-value">{vehicleData.branchOffice || 'N/A'}</span>
              </div>
              {vehicleData.notes && vehicleData.notes !== 'NINGUNA' && (
                <div className="info-item full-width">
                  <span className="info-label">Notas</span>
                  <span className="info-value">{vehicleData.notes}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

VehicleInfoCard.propTypes = {
  vehicleData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  searchPlate: PropTypes.string.isRequired,
  onImageClick: PropTypes.func
};

export default VehicleInfoCard;
