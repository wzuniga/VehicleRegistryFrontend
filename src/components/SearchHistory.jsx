import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import './SearchHistory.css';

/* Map each scraper letter to a human-readable source label */
const SOURCES = [
  { key: 'aIsLoaded', label: 'SUNARP' },
  { key: 'bIsLoaded', label: 'Consulta Veh.' },
  { key: 'cIsLoaded', label: 'SBS' },
  { key: 'dIsLoaded', label: 'Inspección' },
  { key: 'fIsLoaded', label: 'SOAT' },
  { key: 'gIsLoaded', label: 'SUNARP Conoce' },
];

const SourceTag = ({ label, loaded }) => (
  <span className={`sh-tag sh-tag--${loaded ? 'ok' : 'pending'}`}>
    {loaded ? (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ) : (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="12" cy="12" r="8" />
      </svg>
    )}
    {label}
  </span>
);

SourceTag.propTypes = { label: PropTypes.string, loaded: PropTypes.bool };

const SearchHistory = ({ onSelectPlate }) => {
  const [plates, setPlates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => { fetchPendingPlates(); }, []);

  const fetchPendingPlates = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/pending-car-plates');
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPlates(sorted);
    } catch (error) {
      console.error('Error fetching pending plates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toUpperCase());
    setCurrentPage(1);
  };

  const filteredPlates = plates.filter(p => p.plate.toUpperCase().includes(searchTerm));
  const totalPages = Math.ceil(filteredPlates.length / itemsPerPage);
  const currentPlates = filteredPlates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const loadedCount = (row) => SOURCES.filter(s => row[s.key]).length;

  return (
    <div className="sh-container">
      {/* Header */}
      <div className="sh-header">
        <div className="sh-header__left">
          <h2 className="sh-title">Historial de Placas</h2>
          <span className="sh-count">{filteredPlates.length} registros</span>
        </div>
        <div className="sh-header__right">
          <div className="sh-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar placa..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="sh-search__input"
            />
          </div>
          <button className="sh-refresh" onClick={fetchPendingPlates} title="Actualizar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="sh-legend">
        <span className="sh-legend__item sh-legend__item--ok">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Cargado
        </span>
        <span className="sh-legend__item sh-legend__item--pending">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="8" />
          </svg>
          Pendiente
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="sh-loader">
          <div className="sh-spinner" />
          <p>Cargando historial...</p>
        </div>
      ) : plates.length === 0 ? (
        <div className="sh-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M8 12h8M12 8v8" />
          </svg>
          <p>No hay placas registradas aún.</p>
        </div>
      ) : (
        <>
          <div className="sh-grid">
            {currentPlates.length > 0 ? currentPlates.map((row) => {
              const loaded = loadedCount(row);
              const total = SOURCES.length;
              const allDone = loaded === total;
              return (
                <div key={row.id} className={`sh-card ${allDone ? 'sh-card--complete' : ''}`}>
                  <div className="sh-card__top">
                    <span className="sh-card__plate">{row.plate}</span>
                    <span className={`sh-card__badge ${allDone ? 'sh-card__badge--ok' : 'sh-card__badge--partial'}`}>
                      {loaded}/{total}
                    </span>
                  </div>
                  <div className="sh-card__date">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {formatDate(row.createdAt)}
                  </div>
                  <div className="sh-card__tags">
                    {SOURCES.map(s => (
                      <SourceTag key={s.key} label={s.label} loaded={!!row[s.key]} />
                    ))}
                  </div>
                  <button className="sh-card__btn" onClick={() => onSelectPlate && onSelectPlate(row.plate)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    Ver consulta
                  </button>
                </div>
              );
            }) : (
              <div className="sh-no-results">No se encontraron resultados para &ldquo;{searchTerm}&rdquo;</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="sh-pagination">
              <button className="sh-page-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Anterior
              </button>
              <span className="sh-page-info">Página {currentPage} de {totalPages}</span>
              <button className="sh-page-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                Siguiente
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

SearchHistory.propTypes = {
  onSelectPlate: PropTypes.func
};

export default SearchHistory;
