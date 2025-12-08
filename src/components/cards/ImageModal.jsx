import PropTypes from 'prop-types';
import './ImageModal.css';

const ImageModal = ({ imageBase64, isOpen, onClose }) => {
  if (!isOpen || !imageBase64) return null;

  return (
    <div className="image-modal" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
        <img 
          src={`data:image/jpeg;base64,${imageBase64}`} 
          alt="Vehículo ampliado" 
          className="modal-image"
        />
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  imageBase64: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ImageModal;
