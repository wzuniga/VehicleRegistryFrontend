import { useState } from 'react';
import PropTypes from 'prop-types';
import './ApesegSoatCard.css';

const ApesegSoatCard = ({ apesegSoatData, isLoading }) => {
    const [showAll, setShowAll] = useState(false);

    if (isLoading) {
        return (
            <div className="info-card">
                <div className="card-header">
                    <h3>SOAT (APESEG)</h3>
                </div>
                <div className="card-content">
                    <div className="card-loader">
                        <div className="small-loader"></div>
                        <p>Cargando historial de APESEG...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!apesegSoatData || apesegSoatData.length === 0) {
        return (
            <div className="info-card">
                <div className="card-header">
                    <h3>SOAT (APESEG)</h3>
                </div>
                <div className="card-content">
                    <p className="no-data">No se encontró historial en APESEG</p>
                </div>
            </div>
        );
    }

    // Sort data by date descending (DD/MM/YYYY)
    const sortedData = [...apesegSoatData].sort((a, b) => {
        const parseDate = (dateStr) => {
            if (!dateStr) return new Date(0);
            const [day, month, year] = dateStr.split('/');
            return new Date(year, month - 1, day);
        };
        return parseDate(b.fechaInicio) - parseDate(a.fechaInicio);
    });

    return (
        <div className="info-card">
            <div className="card-header">
                <h3>SOAT (APESEG)</h3>
            </div>
            <div className="card-content">
                <div className="insurance-table-wrapper">
                    <table className="insurance-table">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Compañía</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Uso</th>
                                <th>Clase</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(showAll ? sortedData : sortedData.slice(0, 1)).map((policy, index) => (
                                <tr key={index} className={policy.estado === 'VIGENTE' ? 'row-vigente' : 'row-vencido'}>
                                    <td>
                                        <span className={`status-badge ${policy.estado === 'VIGENTE' ? 'vigente' : 'vencido'}`}>
                                            {policy.estado}
                                        </span>
                                    </td>
                                    <td className="company-name">{policy.nombreCompania}</td>
                                    <td>{policy.fechaInicio}</td>
                                    <td>{policy.fechaFin}</td>
                                    <td>{policy.nombreUsoVehiculo}</td>
                                    <td>{policy.nombreClaseVehiculo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sortedData.length > 1 && (
                    <div className="show-more-container">
                        {!showAll ? (
                            <button className="show-more-btn" onClick={() => setShowAll(true)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                                Mostrar {sortedData.length - 1} pólizas más
                            </button>
                        ) : (
                            <button className="show-more-btn" onClick={() => setShowAll(false)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                                Mostrar menos
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

ApesegSoatCard.propTypes = {
    apesegSoatData: PropTypes.arrayOf(PropTypes.shape({
        nombreCompania: PropTypes.string,
        fechaInicio: PropTypes.string,
        fechaFin: PropTypes.string,
        numeroPoliza: PropTypes.string,
        nombreUsoVehiculo: PropTypes.string,
        nombreClaseVehiculo: PropTypes.string,
        estado: PropTypes.string
    })),
    isLoading: PropTypes.bool.isRequired
};

export default ApesegSoatCard;
