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
              <p className="image-hint">Click para ampliar</p>
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
