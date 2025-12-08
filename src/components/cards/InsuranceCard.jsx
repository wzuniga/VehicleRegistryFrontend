import { useState } from 'react';
import PropTypes from 'prop-types';
import './InsuranceCard.css';

const InsuranceCard = ({ insuranceData, isLoading }) => {
  const [showAllSoat, setShowAllSoat] = useState(false);
  const [showAllInsurance, setShowAllInsurance] = useState(false);
  if (isLoading) {
    return (
      <div className="info-card">
        <div className="card-header">
          <h3>Información de Seguros (SOAT)</h3>
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
          <h3>Información de Seguros (SOAT)</h3>
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

  const isVigente = (endDate) => {
    if (!endDate) return false;
    const [day, month, year] = endDate.split('/');
    const endDateObj = new Date(year, month - 1, day);
    return endDateObj >= new Date();
  };

  return (
    <div className="info-card">
      <div className="card-header">
        <h3>Información de Seguros (SOAT)</h3>
      </div>
      <div className="card-content">
        <div className="insurance-summary">
          <div className="summary-item">
            <span className="summary-label">Total Accidentes SOAT</span>
            <span className="summary-value">{insuranceData.soatAccidents}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Accidentes Seguros</span>
            <span className="summary-value">{insuranceData.insuranceAccidents}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Accidentes CAT</span>
            <span className="summary-value">{insuranceData.catAccidents}</span>
          </div>
        </div>

        {soatData.length > 0 && (
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
                  {(showAllSoat ? soatData : soatData.slice(0, 2)).map((soat, index) => (
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
                  {soatData.length > 2 && !showAllSoat && (
                    <tr className="show-more-row">
                      <td colSpan="7">
                        <button className="show-more-btn" onClick={() => setShowAllSoat(true)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                          Mostrar {soatData.length - 2} pólizas más
                        </button>
                      </td>
                    </tr>
                  )}
                  {showAllSoat && soatData.length > 2 && (
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

        {insuranceDetailsData.length > 0 && (
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
                  {(showAllInsurance ? insuranceDetailsData : insuranceDetailsData.slice(0, 2)).map((insurance, index) => (
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
                  {insuranceDetailsData.length > 2 && !showAllInsurance && (
                    <tr className="show-more-row">
                      <td colSpan="7">
                        <button className="show-more-btn" onClick={() => setShowAllInsurance(true)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                          Mostrar {insuranceDetailsData.length - 2} pólizas más
                        </button>
                      </td>
                    </tr>
                  )}
                  {showAllInsurance && insuranceDetailsData.length > 2 && (
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
