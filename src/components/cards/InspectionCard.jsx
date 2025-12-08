import PropTypes from 'prop-types';
import './InspectionCard.css';

const InspectionCard = ({ inspection, onShowDetails }) => {
  const isActive = inspection.ESTADO === 'VIGENTE';

  return (
    <div className={`inspection-card ${isActive ? 'active' : 'inactive'}`}>
      <div className="inspection-card-header">
        <span className={`inspection-badge ${isActive ? 'vigente' : 'vencido'}`}>
          {inspection.ESTADO}
        </span>
        <span className="inspection-result-text">{inspection.RESULTADO}</span>
      </div>
      <div className="inspection-card-body">
        <div className="inspection-info-item">
          <span className="inspection-label">Certificado</span>
          <span className="inspection-value">{inspection.NRO_CERTI}</span>
        </div>
        <div className="inspection-info-item">
          <span className="inspection-label">Vigencia Final</span>
          <span className="inspection-value">{inspection.REVISIONVIGENCIAFINAL}</span>
        </div>
      </div>
      <div className="inspection-card-footer">
        <button 
          className="details-button"
          onClick={() => onShowDetails(inspection)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Más detalles
        </button>
      </div>
    </div>
  );
};

InspectionCard.propTypes = {
  inspection: PropTypes.shape({
    ESTADO: PropTypes.string.isRequired,
    RESULTADO: PropTypes.string.isRequired,
    NRO_CERTI: PropTypes.string.isRequired,
    REVISIONVIGENCIAINICIO: PropTypes.string.isRequired,
    REVISIONVIGENCIAFINAL: PropTypes.string.isRequired,
    SRAZONSOCENTCER: PropTypes.string.isRequired
  }).isRequired,
  onShowDetails: PropTypes.func.isRequired
};

export default InspectionCard;
