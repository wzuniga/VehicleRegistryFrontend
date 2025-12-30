import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import './SearchHistory.css';

const SearchHistory = ({ onSelectPlate }) => {
  const [plates, setPlates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchPendingPlates();
  }, []);

  const fetchPendingPlates = async () => {
    try {
      const response = await api.get('/pending-car-plates');
      // Sort by createdAt desc
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPlates(sortedData);
    } catch (error) {
      console.error('Error fetching pending plates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-PE');
  };

  const handleSearch = (plate) => {
    if (onSelectPlate) {
      onSelectPlate(plate);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toUpperCase());
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter plates
  const filteredPlates = plates.filter(plate =>
    plate.plate.toUpperCase().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlates = filteredPlates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPlates.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="search-history-container">
      <div className="history-header">
        <h2>Placas Buscadas</h2>
        <div className="history-actions">
          <div className="history-search">
            <input
              type="text"
              placeholder="Buscar placa..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-history-input"
            />
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <button className="refresh-btn" onClick={fetchPendingPlates} title="Actualizar lista">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="history-loader">
          <div className="small-loader"></div>
          <p>Cargando historial...</p>
        </div>
      ) : plates.length === 0 ? (
        <div className="no-history">
          <p>No hay placas registradas recientemente.</p>
        </div>
      ) : (
        <>
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentPlates.length > 0 ? (
                  currentPlates.map((row) => (
                    <tr key={row.id}>
                      <td className="plate-cell">{row.plate}</td>
                      <td>{formatDate(row.createdAt)}</td>
                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleSearch(row.plate)}
                          title="Ver detalles"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                          </svg>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-results">No se encontraron resultados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Anterior
              </button>

              <span className="page-info">
                Página {currentPage} de {totalPages}
              </span>

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
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
