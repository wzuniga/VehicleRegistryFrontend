import { useState } from 'react';
import PropTypes from 'prop-types';
import './InsuranceCard.css';
import { useWarning } from '../../context/WarningContext';

const InsuranceCard = ({ insuranceData, isLoading }) => {
  const [showAllSoat, setShowAllSoat] = useState(false);
  const [showAllInsurance, setShowAllInsurance] = useState(false);
  const [showAllCat, setShowAllCat] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { openWarning } = useWarning();

  if (isLoading) {
    return (
      <div className="info-card">
        <div className="card-header">
          <h3>Accidentes con Seguros</h3>
        </div>
        <div className="card-content">
          <div className="card-loader">
            <div className="small-loader"></div>
            <p>Cargando datos de seguros...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!insuranceData) {
    return (
      <div className="info-card">
        <div className="card-header">
          <h3>Accidentes con Seguros</h3>
        </div>
        <div className="card-content">
          <p className="no-data">No se encontraron datos de seguros</p>
        </div>
      </div>
    );
  }

  // Parse HTML table to extract data
  const parseSoatTable = (htmlString) => {
    if (!htmlString) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const rows = doc.querySelectorAll('tbody tr');

    return Array.from(rows).map(row => {
      const cells = row.querySelectorAll('td');
      return {
        company: cells[0]?.textContent.trim() || '',
        vehicleClass: cells[1]?.textContent.trim() || '',
        usage: cells[2]?.textContent.trim() || '',
        accidents: cells[3]?.textContent.trim() || '0',
        policyNumber: cells[4]?.textContent.trim() || '',
        certificateNumber: cells[5]?.textContent.trim() || '',
        startDate: cells[6]?.textContent.trim() || '',
        endDate: cells[7]?.textContent.trim() || '',
        comment: cells[9]?.textContent.trim() || ''
      };
    });
  };

  const soatData = parseSoatTable(insuranceData.soatTableDetails);
  const insuranceDetailsData = parseSoatTable(insuranceData.insuranceTableDetails);
  const catData = parseSoatTable(insuranceData.catTableDetails);

  const isVigente = (endDate) => {
    if (!endDate) return false;
    const [day, month, year] = endDate.split('/');
    const endDateObj = new Date(year, month - 1, day);
    return endDateObj >= new Date();
  };

  const hasAccidents = insuranceData && (
    (insuranceData.soatAccidents > 0) ||
    (insuranceData.insuranceAccidents > 0) ||
    (insuranceData.catAccidents > 0)
  );

  const shouldShowWarning = hasAccidents;

  let warningTitle = "Información referencial";
  let warningMessages = [];

  if (hasAccidents) {
    warningMessages.push("Este vehículo registra accidentes en su historial.");
    warningTitle = "Registra accidentes";
  }

  const handleWarningClick = () => {
    if (!shouldShowWarning) return;

    const content = (
      <div className="warning-details">
        {hasAccidents && (
          <div className="warning-detail-item">
            <strong>Accidentes Registrados:</strong>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              {insuranceData.soatAccidents > 0 && <li>Reportados por SOAT: {insuranceData.soatAccidents}</li>}
              {insuranceData.insuranceAccidents > 0 && <li>Reportados por Otros Seguros: {insuranceData.insuranceAccidents}</li>}
              {insuranceData.catAccidents > 0 && <li>Reportados por AFOCAT: {insuranceData.catAccidents}</li>}
            </ul>
          </div>
        )}
      </div>
    );

    openWarning(warningTitle, content);
  };

  return (
    <div className="info-card">
      <div
        className="card-header"
        style={shouldShowWarning ? { backgroundColor: '#d19700', cursor: 'pointer' } : {}}
        onClick={handleWarningClick}
      >
        <h3>Accidentes con Seguros</h3>
        {shouldShowWarning && (
          <div className="warning-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        )}
      </div>
      <div className="card-content">
        <div className="insurance-summary">
          <div className="summary-item">
            <span className="summary-label">Accidentes SOAT</span>
            <span className="summary-value">{insuranceData.soatAccidents}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Accidentes Seguros Privados</span>
            <span className="summary-value">{insuranceData.insuranceAccidents}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Accidentes CAT</span>
            <span className="summary-value">{insuranceData.catAccidents}</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
          <button 
            className="show-more-btn" 
            onClick={() => setShowDetails(!showDetails)}
            style={{ 
              padding: '0.75rem 1.5rem',
              fontWeight: '600'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points={showDetails ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
            </svg>
            {showDetails ? 'Ocultar detalles' : 'Mostrar más detalles'}
          </button>
        </div>

        {showDetails && soatData.length > 0 && (
          <div className="insurance-section">
            <h4 className="section-title">Pólizas SOAT</h4>
            <div className="insurance-table-wrapper">
              <table className="insurance-table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Compañía</th>
                    <th>N.° Póliza</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Accidentes</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllSoat ? soatData : soatData.slice(0, 1)).map((soat, index) => (
                    <tr key={index} className={isVigente(soat.endDate) ? 'row-vigente' : 'row-vencido'}>
                      <td>
                        <span className={`status-badge ${isVigente(soat.endDate) ? 'vigente' : 'vencido'}`}>
                          {isVigente(soat.endDate) ? 'VIGENTE' : 'VENCIDO'}
                        </span>
                      </td>
                      <td className="company-name">{soat.company}</td>
                      <td className="policy-number">{soat.policyNumber}</td>
                      <td>{soat.startDate}</td>
                      <td>{soat.endDate}</td>
                      <td className="accidents-count">{soat.accidents}</td>
                      <td className="comment">{soat.comment || '-'}</td>
                    </tr>
                  ))}
                  {soatData.length > 1 && !showAllSoat && (
                    <tr className="show-more-row">
                      <td colSpan="7">
                        <button className="show-more-btn" onClick={() => setShowAllSoat(true)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                          Mostrar {soatData.length - 1} pólizas más
                        </button>
                      </td>
                    </tr>
                  )}
                  {showAllSoat && soatData.length > 1 && (
                    <tr className="show-more-row">
                      <td colSpan="7">
                        <button className="show-more-btn" onClick={() => setShowAllSoat(false)}>
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
        )}

        {showDetails && insuranceDetailsData.length > 0 && (
          <div className="insurance-section">
            <h4 className="section-title">Otros Seguros</h4>
            <div className="insurance-table-wrapper">
              <table className="insurance-table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Compañía</th>
                    <th>N.° Póliza</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Accidentes</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllInsurance ? insuranceDetailsData : insuranceDetailsData.slice(0, 1)).map((insurance, index) => (
                    <tr key={index} className={isVigente(insurance.endDate) ? 'row-vigente' : 'row-vencido'}>
                      <td>
                        <span className={`status-badge ${isVigente(insurance.endDate) ? 'vigente' : 'vencido'}`}>
                          {isVigente(insurance.endDate) ? 'VIGENTE' : 'VENCIDO'}
                        </span>
                      </td>
                      <td className="company-name">{insurance.company}</td>
                      <td className="policy-number">{insurance.policyNumber}</td>
                      <td>{insurance.startDate}</td>
                      <td>{insurance.endDate}</td>
                      <td className="accidents-count">{insurance.accidents}</td>
                      <td className="comment">{insurance.comment || '-'}</td>
                    </tr>
                  ))}
                  {insuranceDetailsData.length > 1 && !showAllInsurance && (
                    <tr className="show-more-row">
                      <td colSpan="7">
                        <button className="show-more-btn" onClick={() => setShowAllInsurance(true)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                          Mostrar {insuranceDetailsData.length - 1} pólizas más
                        </button>
                      </td>
                    </tr>
                  )}
                  {showAllInsurance && insuranceDetailsData.length > 1 && (
                    <tr className="show-more-row">
                      <td colSpan="7">
                        <button className="show-more-btn" onClick={() => setShowAllInsurance(false)}>
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
        )}

        {showDetails && catData.length > 0 && (
          <div className="insurance-section">
            <h4 className="section-title">Certificados CAT (AFOCAT)</h4>
            <div className="insurance-table-wrapper">
              <table className="insurance-table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>AFOCAT</th>
                    <th>N.° Certificado</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Accidentes</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllCat ? catData : catData.slice(0, 1)).map((cat, index) => (
                    <tr key={index} className={isVigente(cat.endDate) ? 'row-vigente' : 'row-vencido'}>
                      <td>
                        <span className={`status-badge ${isVigente(cat.endDate) ? 'vigente' : 'vencido'}`}>
                          {isVigente(cat.endDate) ? 'VIGENTE' : 'VENCIDO'}
                        </span>
                      </td>
                      <td className="company-name">{cat.company}</td>
                      <td className="policy-number">{cat.policyNumber || cat.certificateNumber}</td>
                      <td>{cat.startDate}</td>
                      <td>{cat.endDate}</td>
                      <td className="accidents-count">{cat.accidents}</td>
                      <td className="comment">{cat.comment || '-'}</td>
                    </tr>
                  ))}
                  {catData.length > 1 && !showAllCat && (
                    <tr className="show-more-row">
                      <td colSpan="7">
                        <button className="show-more-btn" onClick={() => setShowAllCat(true)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                          Mostrar {catData.length - 1} certificados más
                        </button>
                      </td>
                    </tr>
                  )}
                  {showAllCat && catData.length > 1 && (
                    <tr className="show-more-row">
                      <td colSpan="7">
                        <button className="show-more-btn" onClick={() => setShowAllCat(false)}>
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
        )}
      </div>
    </div>
  );
};

InsuranceCard.propTypes = {
  insuranceData: PropTypes.shape({
    soatAccidents: PropTypes.number,
    soatTableDetails: PropTypes.string,
    insuranceAccidents: PropTypes.number,
    insuranceTableDetails: PropTypes.string,
    catAccidents: PropTypes.number,
    catTableDetails: PropTypes.string
  }),
  isLoading: PropTypes.bool.isRequired
};

export default InsuranceCard;
