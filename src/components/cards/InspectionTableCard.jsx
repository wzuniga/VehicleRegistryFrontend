import { useState } from 'react';
import PropTypes from 'prop-types';
import './InspectionTableCard.css';

const InspectionTableCard = ({ inspectionData, isLoading, onShowDetails }) => {
  const [showAllInspections, setShowAllInspections] = useState(false);

  if (isLoading) {
    return (
      <div className="info-card">
        <div className="card-header">
          <h3>Inspección Técnica Vehicular</h3>
        </div>
        <div className="card-content">
          <div className="card-loader">
            <div className="small-loader"></div>
            <p>Cargando datos de inspección...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!inspectionData || inspectionData.length === 0) {
    return (
      <div className="info-card">
        <div className="card-header">
          <h3>Inspección Técnica Vehicular</h3>
        </div>
        <div className="card-content">
          <p className="no-data">No se encontraron datos de inspección técnica</p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-card">
      <div className="card-header">
        <h3>Inspección Técnica Vehicular</h3>
      </div>
      <div className="card-content">
        <div className="inspection-table-wrapper">
          <table className="inspection-table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Certificado</th>
                <th>Resultado</th>
                <th>Vigencia Final</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(showAllInspections ? inspectionData : inspectionData.slice(0, 2)).map((inspection, index) => (
                <tr key={index} className={inspection.ESTADO === 'VIGENTE' ? 'row-vigente' : inspection.ESTADO ? '' : 'row-desaprobado'}>
                  <td>
                    {inspection.ESTADO && inspection.ESTADO.trim() !== '' && (
                      <span className={`status-badge ${inspection.ESTADO === 'VIGENTE' ? 'vigente' : 'vencido'}`}>
                        {inspection.ESTADO}
                      </span>
                    )}
                  </td>
                  <td className="cert-number">{inspection.NRO_CERTI}</td>
                  <td className="result-text">{inspection.RESULTADO}</td>
                  <td>{inspection.REVISIONVIGENCIAFINAL}</td>
                  <td>
                    <button 
                      className="details-btn"
                      onClick={() => onShowDetails(inspection)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
              {inspectionData.length > 2 && !showAllInspections && (
                <tr className="show-more-row">
                  <td colSpan="5">
                    <button className="show-more-btn" onClick={() => setShowAllInspections(true)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                      Mostrar {inspectionData.length - 2} inspecciones más
                    </button>
                  </td>
                </tr>
              )}
              {showAllInspections && inspectionData.length > 2 && (
                <tr className="show-more-row">
                  <td colSpan="5">
                    <button className="show-more-btn" onClick={() => setShowAllInspections(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                      Mostrar menos
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

InspectionTableCard.propTypes = {
  inspectionData: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool.isRequired,
  onShowDetails: PropTypes.func.isRequired
};

export default InspectionTableCard;
