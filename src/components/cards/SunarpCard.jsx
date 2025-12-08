import { useState } from 'react';
import PropTypes from 'prop-types';
import './SunarpCard.css';

const SunarpCard = ({ sunarpData, isLoading }) => {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="info-card">
        <div className="card-header">
          <h3>Historial Registral SUNARP</h3>
        </div>
        <div className="card-content">
          <div className="card-loader">
            <div className="small-loader"></div>
            <p>Cargando historial registral...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!sunarpData || sunarpData.length === 0) {
    return (
      <div className="info-card">
        <div className="card-header">
          <h3>Historial Registral SUNARP</h3>
        </div>
        <div className="card-content">
          <p className="no-data">No se encontró historial registral</p>
        </div>
      </div>
    );
  }

  // Ordenar por fecha de registro descendente (más reciente primero)
  const sortedData = [...sunarpData].sort((a, b) => {
    const dateA = new Date(a.registrationDate);
    const dateB = new Date(b.registrationDate);
    return dateB - dateA;
  });

  // Buscar la última transferencia de propiedad
  const lastTransfer = sortedData.find(record => 
    record.category?.toUpperCase().includes('TRANSFERENCIA DE PROPIEDAD')
  );

  const getOwnerName = (record) => {
    if (!record) return '-';
    return record.naturalParticipants || record.legalParticipants || '-';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="info-card">
      <div className="card-header">
        <h3>Historial Registral SUNARP</h3>
      </div>
      <div className="card-content">
        <div className="sunarp-summary">
          <div className="summary-item">
            <span className="summary-label">Última Transferencia</span>
            <span className="summary-value-text">{formatDate(lastTransfer?.registrationDate)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Propietario Actual</span>
            <span className="summary-value-text">{getOwnerName(lastTransfer)}</span>
          </div>
        </div>

        <div className="sunarp-table-wrapper">
          <table className="sunarp-table">
            <thead>
              <tr>
                <th>F. Registro</th>
                <th>Categoría</th>
                <th>Tipo de Acto</th>
                <th>Participantes</th>
                {/* <th>Notas</th> */}
              </tr>
            </thead>
            <tbody>
              {(showAll ? sortedData : sortedData.slice(0, 2)).map((record, index) => (
                <tr key={record.id} className={index === 0 ? 'latest-record' : ''}>
                  <td>{formatDate(record.registrationDate)}</td>
                  <td className="category-text">{record.category}</td>
                  <td className="act-type">{record.actType}</td>
                  <td className="participants">
                    {record.naturalParticipants && (
                      <div className="participant-item">
                        <span className="participant-label">Natural:</span>
                        <span>{record.naturalParticipants}</span>
                      </div>
                    )}
                    {record.legalParticipants && (
                      <div className="participant-item">
                        <span className="participant-label">Jurídico:</span>
                        <span>{record.legalParticipants}</span>
                      </div>
                    )}
                    {!record.naturalParticipants && !record.legalParticipants && '-'}
                  </td>
                  {/* <td className="notes">{record.notes || '-'}</td> */}
                </tr>
              ))}
              {sortedData.length > 2 && !showAll && (
                <tr className="show-more-row">
                  <td colSpan="4">
                    <button className="show-more-btn" onClick={() => setShowAll(true)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                      Mostrar {sortedData.length - 2} registros más
                    </button>
                  </td>
                </tr>
              )}
              {showAll && sortedData.length > 2 && (
                <tr className="show-more-row">
                  <td colSpan="4">
                    <button className="show-more-btn" onClick={() => setShowAll(false)}>
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

SunarpCard.propTypes = {
  sunarpData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      version: PropTypes.number,
      registrationDate: PropTypes.string,
      presentationDate: PropTypes.string,
      category: PropTypes.string,
      actType: PropTypes.string,
      naturalParticipants: PropTypes.string,
      legalParticipants: PropTypes.string,
      notes: PropTypes.string,
      plateNumber: PropTypes.string
    })
  ),
  isLoading: PropTypes.bool.isRequired
};

export default SunarpCard;
