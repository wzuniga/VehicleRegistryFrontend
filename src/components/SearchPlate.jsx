import { useState } from 'react';
import api from '../services/api';
import { VehicleInfoCard, InspectionModal, ImageModal, InsuranceCard, SunarpCard } from './cards';
import './SearchPlate.css';

const SearchPlate = () => {
  const [searchPlate, setSearchPlate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [inspectionData, setInspectionData] = useState(null);
  const [isLoadingInspection, setIsLoadingInspection] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [insuranceData, setInsuranceData] = useState(null);
  const [isLoadingInsurance, setIsLoadingInsurance] = useState(false);
  const [sunarpData, setSunarpData] = useState(null);
  const [isLoadingSunarp, setIsLoadingSunarp] = useState(false);
  const [showAllInspections, setShowAllInspections] = useState(false);

  const loadingMessages = [
    'Estamos procesando tu solicitud...',
    'Buscando información de la placa...',
    'Consultando base de datos...',
    'Verificando datos...',
    'Casi listo...'
  ];

  const fetchVehicleData = async (plate) => {
    setIsLoadingVehicle(true);
    try {
      const response = await api.get(`/vehicles/plate/${plate}`);
      setVehicleData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del vehículo:', error);
      setVehicleData(null);
    } finally {
      setIsLoadingVehicle(false);
    }
  };

  const fetchInspectionData = async (plate) => {
    setIsLoadingInspection(true);
    try {
      const response = await api.get(`/inspeccion-vehicular/plate/${plate}`);
      if (response.data?.data?.orResult && Array.isArray(response.data.data.orResult)) {
        const jsonString = response.data.data.orResult[0];
        const inspections = JSON.parse(jsonString);
        console.log('Datos de inspección obtenidos:', inspections);
        setInspectionData(inspections);
      }
    } catch (error) {
      console.error('Error al obtener datos de inspección:', error);
      setInspectionData(null);
    } finally {
      setIsLoadingInspection(false);
    }
  };

  const fetchInsuranceData = async (plate) => {
    setIsLoadingInsurance(true);
    try {
      const response = await api.get(`/sbs-insurance/plate/${plate}`);
      console.log('Datos de seguros obtenidos:', response.data);
      setInsuranceData(response.data);
    } catch (error) {
      console.error('Error al obtener datos de seguros:', error);
      setInsuranceData(null);
    } finally {
      setIsLoadingInsurance(false);
    }
  };

  const fetchSunarpData = async (plate) => {
    setIsLoadingSunarp(true);
    try {
      const response = await api.get(`/sprl-sunarp/plate/${plate}`);
      console.log('Datos SUNARP obtenidos:', response.data);
      setSunarpData(response.data);
    } catch (error) {
      console.error('Error al obtener datos SUNARP:', error);
      setSunarpData(null);
    } finally {
      setIsLoadingSunarp(false);
    }
  };

  const handleSearch = async () => {
    if (!searchPlate.trim()) return;

    setIsLoading(true);
    setSearchCompleted(false);
    setVehicleData(null);
    setInspectionData(null);
    let messageIndex = 0;
    setLoadingMessage(loadingMessages[0]);

    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 1000);

    try {
      const response = await api.post('/pending-car-plates', { plate: searchPlate });
      console.log('Respuesta pending-car-plates:', response.data);
      
      setTimeout(() => {
        clearInterval(messageInterval);
        setIsLoading(false);
        setSearchCompleted(true);
        fetchVehicleData(searchPlate);
        fetchInspectionData(searchPlate);
        fetchInsuranceData(searchPlate);
        fetchSunarpData(searchPlate);
      }, 5000);
    } catch (error) {
      console.error('Error al buscar placa:', error);
      clearInterval(messageInterval);
      setTimeout(() => {
        setIsLoading(false);
        setSearchCompleted(true);
        fetchVehicleData(searchPlate);
        fetchInspectionData(searchPlate);
        fetchInsuranceData(searchPlate);
        fetchSunarpData(searchPlate);
      }, 5000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNewSearch = () => {
    setSearchPlate('');
    setSearchCompleted(false);
    setVehicleData(null);
    setIsLoadingVehicle(false);
    setInspectionData(null);
    setIsLoadingInspection(false);
    setSelectedInspection(null);
    setIsInspectionModalOpen(false);
    setInsuranceData(null);
    setIsLoadingInsurance(false);
    setSunarpData(null);
    setIsLoadingSunarp(false);
  };

  const handleShowInspectionDetails = (inspection) => {
    setSelectedInspection(inspection);
    setIsInspectionModalOpen(true);
  };

  return (
    <div className={`search-plate-container ${searchCompleted || isLoading ? 'loading' : ''}`}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Ingresa tu placa"
          value={searchPlate}
          onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        {searchCompleted ? (
          <button className="search-button" onClick={handleNewSearch}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        ) : (
          <button className="search-button" onClick={handleSearch} disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        )}
      </div>

      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loading-message">{loadingMessage}</p>
        </div>
      )}

      {searchCompleted && (
        <div className="results-container">
          <VehicleInfoCard
            vehicleData={vehicleData}
            isLoading={isLoadingVehicle}
            searchPlate={searchPlate}
            onImageClick={() => setIsImageModalOpen(true)}
          />

          <SunarpCard
            sunarpData={sunarpData}
            isLoading={isLoadingSunarp}
          />

          <InsuranceCard
            insuranceData={insuranceData}
            isLoading={isLoadingInsurance}
          />

          <div className="info-card">
            <div className="card-header">
              <h3>Inspección Técnica Vehicular</h3>
            </div>
            <div className="card-content">
              {isLoadingInspection ? (
                <div className="card-loader">
                  <div className="small-loader"></div>
                  <p>Cargando datos de inspección...</p>
                </div>
              ) : inspectionData && inspectionData.length > 0 ? (
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
                              onClick={() => handleShowInspectionDetails(inspection)}
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
              ) : (
                <p className="no-data">No se encontraron datos de inspección técnica</p>
              )}
            </div>
          </div>
        </div>
      )}

      <ImageModal
        imageBase64={vehicleData?.imageBase64}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />

      <InspectionModal
        inspection={selectedInspection}
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
      />
    </div>
  );
};

export default SearchPlate;
