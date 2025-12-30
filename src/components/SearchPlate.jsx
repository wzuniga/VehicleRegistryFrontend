import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { VehicleInfoCard, InspectionTableCard, InspectionModal, ImageModal, InsuranceCard, SunarpCard, SunarpTimeline } from './cards';
import './SearchPlate.css';

import PropTypes from 'prop-types';

const SearchPlate = ({ initialPlate }) => {
  const [searchPlate, setSearchPlate] = useState(initialPlate || '');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Track if we have already triggered the initial search to prevent loops
  const hasInitialSearchTriggered = useRef(false);

  useEffect(() => {
    // Focus automático en el input cuando se monta el componente
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (initialPlate && !hasInitialSearchTriggered.current) {
      setSearchPlate(initialPlate);
      hasInitialSearchTriggered.current = true;
      // Small timeout to ensure state update is processed or just call logic directly
      // Better to call a function. But handleSearch uses `searchPlate` state.
      // We can pass the plate directly to a searchable function, or use the state.
      // Since setState is async, we shouldn't rely on `searchPlate` being updated immediately if we call handleSearch right now.
      // Instead, let's create a version of handleSearch that accepts a plate argument.
      handleSearch(initialPlate);
    }
  }, [initialPlate]);

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

  const loadingMessages = [
    'Estamos procesando tu solicitud...',
    'Buscando información de la placa...',
    'Consultando base de datos...',
    'Verificando datos...',
    'Casi listo...'
  ];

  const fetchVehicleData = async (plate) => {
    setIsLoadingVehicle(true);
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        const response = await api.get(`/vehicles/plate/${plate}`);
        if (response.data && Object.keys(response.data).length > 0) {
          setVehicleData(response.data);
          setIsLoadingVehicle(false);
          return;
        }
      } catch (error) {
        console.error(`Error al obtener datos del vehículo (intento ${attempts + 1}):`, error);
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setVehicleData(null);
    setIsLoadingVehicle(false);
  };

  const fetchInspectionData = async (plate) => {
    setIsLoadingInspection(true);
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        const response = await api.get(`/inspeccion-vehicular/plate/${plate}`);
        if (response.data?.data?.orResult && Array.isArray(response.data.data.orResult)) {
          const jsonString = response.data.data.orResult[0];
          const inspections = JSON.parse(jsonString);
          if (inspections && inspections.length > 0) {
            console.log('Datos de inspección obtenidos:', inspections);
            setInspectionData(inspections);
            setIsLoadingInspection(false);
            return;
          }
        }
      } catch (error) {
        console.error(`Error al obtener datos de inspección (intento ${attempts + 1}):`, error);
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setInspectionData(null);
    setIsLoadingInspection(false);
  };

  const fetchInsuranceData = async (plate) => {
    setIsLoadingInsurance(true);
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        const response = await api.get(`/sbs-insurance/plate/${plate}`);
        if (response.data && Object.keys(response.data).length > 0) {
          console.log('Datos de seguros obtenidos:', response.data);
          setInsuranceData(response.data);
          setIsLoadingInsurance(false);
          return;
        }
      } catch (error) {
        console.error(`Error al obtener datos de seguros (intento ${attempts + 1}):`, error);
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setInsuranceData(null);
    setIsLoadingInsurance(false);
  };

  const fetchSunarpData = async (plate) => {
    setIsLoadingSunarp(true);
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        const response = await api.get(`/sprl-sunarp/plate/${plate}`);
        if (response.data && Object.keys(response.data).length > 0) {
          console.log('Datos SUNARP obtenidos:', response.data);
          setSunarpData(response.data);
          setIsLoadingSunarp(false);
          return;
        }
      } catch (error) {
        console.error(`Error al obtener datos SUNARP (intento ${attempts + 1}):`, error);
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setSunarpData(null);
    setIsLoadingSunarp(false);
  };

  const handleSearch = async (plateOverride, forceWait = false) => {
    const plateToSearch = typeof plateOverride === 'string' ? plateOverride : searchPlate;

    if (!plateToSearch || !plateToSearch.trim()) return;

    // Update state if we are searching from argument
    if (typeof plateOverride === 'string' && plateOverride !== searchPlate) {
      setSearchPlate(plateOverride);
    }

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
      const response = await api.post('/pending-car-plates', { plate: plateToSearch });
      console.log('Respuesta pending-car-plates:', response.data);

      setTimeout(() => {
        clearInterval(messageInterval);
        setIsLoading(false);
        setSearchCompleted(true);
        fetchVehicleData(plateToSearch);
        fetchInspectionData(plateToSearch);
        fetchInsuranceData(plateToSearch);
        fetchSunarpData(plateToSearch);
      }, 5000);
    } catch (error) {
      console.error('Error al buscar placa:', error);
      clearInterval(messageInterval);

      // Si es 409, pasar directamente sin esperar, SALVO que se fuerce la espera (update)
      if (error.response?.status === 409 && !forceWait) {
        setIsLoading(false);
        setSearchCompleted(true);
        fetchVehicleData(plateToSearch);
        fetchInspectionData(plateToSearch);
        fetchInsuranceData(plateToSearch);
        fetchSunarpData(plateToSearch);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setSearchCompleted(true);
          fetchVehicleData(plateToSearch);
          fetchInspectionData(plateToSearch);
          fetchInsuranceData(plateToSearch);
          fetchSunarpData(plateToSearch);
        }, 5000);
      }
    }
  };

  const handleUpdate = async () => {
    if (!searchPlate || !searchPlate.trim()) return;

    try {
      // Call PATCH endpoint to reset plate data
      await api.patch(`/pending-car-plates/plate/${searchPlate}/reset-all`);
      console.log(`Placa ${searchPlate} reseteada exitosamente`);

      // Restart the search process with loading messages and FORCED WAIT
      handleSearch(searchPlate, true);
    } catch (error) {
      console.error('Error al resetear la placa:', error);
      // Even if reset fails, try to search anyway, forcing wait to show process attempts
      handleSearch(searchPlate, true);
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
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Ingresa tu placa"
          value={searchPlate}
          onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <div className="search-actions">
          {searchCompleted ? (
            <>
              <button
                className="search-button update-btn"
                onClick={handleUpdate}
                title="Actualizar datos"
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </button>
              <button
                className="search-button"
                onClick={handleNewSearch}
                title="Nueva búsqueda"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </>
          ) : (
            <button className="search-button" onClick={handleSearch} disabled={isLoading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          )}
        </div>
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

          <SunarpTimeline
            sunarpData={sunarpData}
            insuranceData={insuranceData}
          />

          <SunarpCard
            sunarpData={sunarpData}
            isLoading={isLoadingSunarp}
          />

          <InsuranceCard
            insuranceData={insuranceData}
            isLoading={isLoadingInsurance}
          />

          <InspectionTableCard
            inspectionData={inspectionData}
            isLoading={isLoadingInspection}
            onShowDetails={handleShowInspectionDetails}
          />
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
