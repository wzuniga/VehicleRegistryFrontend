import PropTypes from 'prop-types';
import './InspectionModal.css';

const InspectionModal = ({ inspection, isOpen, onClose }) => {
  if (!isOpen || !inspection) return null;

  return (
    <div className="inspection-modal" onClick={onClose}>
      <div className="inspection-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalles de Inspección Técnica</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-inspection-header">
            <span className={`modal-status ${inspection.ESTADO === 'VIGENTE' ? 'vigente' : 'vencido'}`}>
              {inspection.ESTADO}
            </span>
            <span className="modal-result">{inspection.RESULTADO}</span>
          </div>
          
          <div className="modal-details-grid">
            <div className="modal-detail-item">
              <span className="modal-label">Placa</span>
              <span className="modal-value">{inspection.PLACA}</span>
            </div>
            <div className="modal-detail-item">
              <span className="modal-label">Certificado</span>
              <span className="modal-value">{inspection.NRO_CERTI}</span>
            </div>
            <div className="modal-detail-item">
              <span className="modal-label">Vigencia Inicio</span>
              <span className="modal-value">{inspection.REVISIONVIGENCIAINICIO}</span>
            </div>
            <div className="modal-detail-item">
              <span className="modal-label">Vigencia Final</span>
              <span className="modal-value">{inspection.REVISIONVIGENCIAFINAL}</span>
            </div>
            <div className="modal-detail-item">
              <span className="modal-label">Tipo de Ámbito</span>
              <span className="modal-value">{inspection.TIPO_AMBITO}</span>
            </div>
            <div className="modal-detail-item">
              <span className="modal-label">Tipo de Servicio</span>
              <span className="modal-value">{inspection.TIPO_SERVICIO}</span>
            </div>
            <div className="modal-detail-item">
              <span className="modal-label">Tipo de Documento</span>
              <span className="modal-value">{inspection.TIPODOCUMENTO}</span>
            </div>
            <div className="modal-detail-item full-width">
              <span className="modal-label">Centro de Inspección</span>
              <span className="modal-value">{inspection.SRAZONSOCENTCER}</span>
            </div>
            <div className="modal-detail-item full-width">
              <span className="modal-label">Dirección</span>
              <span className="modal-value">{inspection.DIRECCION}</span>
            </div>
            {inspection.OBSERVACION && (
              <div className="modal-detail-item full-width">
                <span className="modal-label">Observación</span>
                <span className="modal-value">{inspection.OBSERVACION}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

InspectionModal.propTypes = {
  inspection: PropTypes.shape({
    PLACA: PropTypes.string,
    NRO_CERTI: PropTypes.string,
    ESTADO: PropTypes.string,
    RESULTADO: PropTypes.string,
    REVISIONVIGENCIAINICIO: PropTypes.string,
    REVISIONVIGENCIAFINAL: PropTypes.string,
    TIPO_AMBITO: PropTypes.string,
    TIPO_SERVICIO: PropTypes.string,
    TIPODOCUMENTO: PropTypes.string,
    SRAZONSOCENTCER: PropTypes.string,
    DIRECCION: PropTypes.string,
    OBSERVACION: PropTypes.string
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default InspectionModal;
