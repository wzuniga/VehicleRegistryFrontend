import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
  VehicleInfoCard,
  InspectionTableCard,
  InspectionModal,
  ImageModal,
  InsuranceCard,
  SunarpCard,
  ApesegSoatCard,
} from '../components/cards';
import { readServiceConfig } from '../utils/serviceConfig';
import VehicleTimeline from '../components/VehicleTimeline';
import './NewSearchPage.css';

const LOADING_MESSAGES = [
  'Estamos buscando tu carro',
  'Consultando SUNARP',
  'Historial de accidentes',
  'Verificando inspección técnica',
  'Obteniendo tu consulta vehicular',
];

const PLATE_REGEX = /^[A-Z0-9]{6}$/;
const RECENT_KEY = 'autocheck_recent_searches';

const loadRecent = () => {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
  catch { return []; }
};

const saveRecent = (plate, prev) => {
  const updated = [plate, ...prev.filter(p => p !== plate)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  return updated;
};

/* ---- Collapsible card component ---- */
const CollapsibleCard = ({ title, isLoading, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="nsp-card">
      <button
        className="nsp-card__header"
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
      >
        <span className="nsp-card__title">{title}</span>
        <div className="nsp-card__meta">
          {isLoading ? (
            <span className="nsp-card__badge nsp-card__badge--loading">
              <span className="nsp-mini-spinner" aria-hidden="true" />
              cargando
            </span>
          ) : (
            <span className="nsp-card__badge nsp-card__badge--done">listo</span>
          )}
          <svg
            className={`nsp-card__chevron ${isOpen ? 'nsp-card__chevron--open' : ''}`}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>
      {/* Use visibility trick to preserve child state */}
      <div className="nsp-card__body" style={{ display: isOpen ? 'block' : 'none' }}>
        {children}
      </div>
    </div>
  );
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
const NewSearchPage = () => {
  const [searchParams] = useSearchParams();

  // Phase machine
  const [phase, setPhase] = useState('idle'); // 'idle' | 'loading' | 'results'

  // Input
  const [plate, setPlate] = useState('');
  const [plateError, setPlateError] = useState('');
  const inputRef = useRef(null);

  // Loading message rotation
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const minLoadingDone = useRef(false);

  // Per-service data + loading
  const [vehicleData, setVehicleData] = useState(null);
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(false);

  const [inspectionData, setInspectionData] = useState(null);
  const [isLoadingInspection, setIsLoadingInspection] = useState(false);

  const [insuranceData, setInsuranceData] = useState(null);
  const [isLoadingInsurance, setIsLoadingInsurance] = useState(false);

  const [sunarpData, setSunarpData] = useState(null);
  const [isLoadingSunarp, setIsLoadingSunarp] = useState(false);

  const [apesegSoatData, setApesegSoatData] = useState(null);
  const [isLoadingApesegSoat, setIsLoadingApesegSoat] = useState(false);

  // Modals
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

  // Track which services were enabled at the time of search
  const enabledRef = useRef(readServiceConfig());

  // Track current searched plate for display
  const searchedPlateRef = useRef('');

  // Last processed timestamp from server
  const [processedAt, setProcessedAt] = useState(null);

  // Recent searches (last 5, persisted in localStorage)
  const [recentSearches, setRecentSearches] = useState(loadRecent);

  // ---- Auto-focus on idle ----
  useEffect(() => {
    if (phase === 'idle' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  // ---- Loading message rotation ----
  useEffect(() => {
    if (phase !== 'loading') return;
    setLoadingMsgIdx(0);
    const interval = setInterval(() => {
      setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [phase]);

  // ---- Transition loading → results (first data wins, with min 500ms guard) ----
  useEffect(() => {
    if (phase !== 'loading') return;
    const anyData = vehicleData || inspectionData || insuranceData || sunarpData || apesegSoatData;
    if (anyData && minLoadingDone.current) {
      setPhase('results');
    }
  }, [phase, vehicleData, inspectionData, insuranceData, sunarpData, apesegSoatData]);

  // ---- 10-second hard timeout ----
  useEffect(() => {
    if (phase !== 'loading') return;
    const t = setTimeout(() => {
      minLoadingDone.current = true;
      setPhase('results');
    }, 10000);
    return () => clearTimeout(t);
  }, [phase]);

  // ---- Query param auto-search on mount ----
  const hasAutoSearched = useRef(false);
  useEffect(() => {
    const p = searchParams.get('plate');
    if (p && !hasAutoSearched.current) {
      hasAutoSearched.current = true;
      const upper = p.toUpperCase();
      setPlate(upper);
      doSearch(upper);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------------------------------------------------
     FETCH FUNCTIONS — independent retry loops (50 attempts, 2s each)
     ---------------------------------------------------------------- */
  const fetchVehicleData = async (p) => {
    await pollWithIncrementalUpdates({
      setLoading: setIsLoadingVehicle,
      setData: setVehicleData,
      request: () => api.get(`/vehicles/plate/${p}`),
      extract: (data) => (data && Object.keys(data).length > 0 ? data : null),
    });
  };

  const fetchInspectionData = async (p) => {
    await pollWithIncrementalUpdates({
      setLoading: setIsLoadingInspection,
      setData: setInspectionData,
      request: () => api.get(`/inspeccion-vehicular/plate/${p}`),
      extract: (data) => {
        if (!data?.data?.orResult || !Array.isArray(data.data.orResult)) return null;
        try {
          const inspections = JSON.parse(data.data.orResult[0]);
          return inspections && inspections.length > 0 ? inspections : null;
        } catch {
          return null;
        }
      },
    });
  };

  const fetchInsuranceData = async (p) => {
    await pollWithIncrementalUpdates({
      setLoading: setIsLoadingInsurance,
      setData: setInsuranceData,
      request: () => api.get(`/sbs-insurance/plate/${p}`),
      extract: (data) => (data && Object.keys(data).length > 0 ? data : null),
    });
  };

  const fetchSunarpData = async (p) => {
    await pollWithIncrementalUpdates({
      setLoading: setIsLoadingSunarp,
      setData: setSunarpData,
      request: () => api.get(`/sprl-sunarp/plate/${p}`),
      extract: (data) => (data && Object.keys(data).length > 0 ? data : null),
    });
  };

  const fetchApesegSoatData = async (p) => {
    await pollWithIncrementalUpdates({
      setLoading: setIsLoadingApesegSoat,
      setData: setApesegSoatData,
      request: () => api.get(`/soat-apeseg/plate/${p}`),
      extract: (data) => (Array.isArray(data) && data.length > 0 ? data : null),
    });
  };

  const pollWithIncrementalUpdates = async ({ setLoading, setData, request, extract }) => {
    setLoading(true);
    let attempts = 0;
    let foundData = false;
    let stablePolls = 0;
    let lastSignature = null;

    while (attempts < 50) {
      try {
        const res = await request();
        const parsed = extract(res.data);

        if (parsed !== null) {
          foundData = true;
          const nextSignature = JSON.stringify(parsed);

          if (nextSignature !== lastSignature) {
            setData(parsed);
            lastSignature = nextSignature;
            stablePolls = 0;
          } else {
            stablePolls += 1;
          }

          // Stop once data stops changing in consecutive polls.
          if (stablePolls >= 2) break;
        }
      } catch {
        // Continue polling
      }

      attempts++;
      if (attempts < 50) await new Promise(r => setTimeout(r, 2000));
    }

    if (!foundData) setData(null);
    setLoading(false);
  };

  /* ----------------------------------------------------------------
     doSearch — separated so it can be called with a plate argument
     ---------------------------------------------------------------- */

  const timeAgo = (dateStr) => {
    if (!dateStr) return null;
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'hoy';
    if (days === 1) return 'hace 1 día';
    if (days < 7) return `hace ${days} días`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`;
    const months = Math.floor(days / 30);
    return months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
  };

  const isOlderThanOneMonth = (dateStr) => {
    if (!dateStr) return false;
    return Date.now() - new Date(dateStr).getTime() > 30 * 24 * 3600 * 1000;
  };

  const fetchPlateRecord = async (target) => {
    try {
      const res = await api.get(`/pending-car-plates/plate/${target}`);
      return res.data?.createdAt || null;
    } catch {
      // Fallback: search in list
      try {
        const res = await api.get('/pending-car-plates');
        const record = res.data?.find(r => r.plate === target);
        return record?.createdAt || null;
      } catch { return null; }
    }
  };

  const fireFetches = (target, cfg, delay = 0) => {
    const run = () => {
      if (cfg.vehicleInfo) fetchVehicleData(target);
      if (cfg.inspection) fetchInspectionData(target);
      if (cfg.insurance) fetchInsuranceData(target);
      if (cfg.sunarp) fetchSunarpData(target);
      if (cfg.soatApeseg) fetchApesegSoatData(target);
    };
    if (delay > 0) setTimeout(run, delay); else run();
  };

  const doSearch = async (target) => {
    // Reset all data
    setVehicleData(null);
    setInspectionData(null);
    setInsuranceData(null);
    setSunarpData(null);
    setApesegSoatData(null);
    setIsLoadingVehicle(false);
    setIsLoadingInspection(false);
    setIsLoadingInsurance(false);
    setIsLoadingSunarp(false);
    setIsLoadingApesegSoat(false);
    setIsImageModalOpen(false);
    setSelectedInspection(null);
    setIsInspectionModalOpen(false);
    setProcessedAt(null);

    minLoadingDone.current = false;
    searchedPlateRef.current = target;

    // Save to recent searches
    setRecentSearches(prev => saveRecent(target, prev));

    // Snapshot config at search time
    const cfg = readServiceConfig();
    enabledRef.current = cfg;

    setPhase('loading');

    // Min 500ms to avoid flash
    setTimeout(() => { minLoadingDone.current = true; }, 500);

    try {
      await api.post('/pending-car-plates', { plate: target });
      // New plate — wait before polling
      setProcessedAt(new Date().toISOString());
      fireFetches(target, cfg, 3000);
    } catch (err) {
      if (err.response?.status === 409) {
        // Plate already exists — fetch its record date
        const createdAt = await fetchPlateRecord(target);
        setProcessedAt(createdAt);

        if (isOlderThanOneMonth(createdAt)) {
          // Auto-reprocess: data is stale (> 1 month)
          try {
            await api.patch(`/pending-car-plates/plate/${target}/reset-all`);
            await api.patch(`/pending-car-plates/plate/${target}/touch-created-at`);
          } catch { /* continue */ }
          setProcessedAt(new Date().toISOString());
          fireFetches(target, cfg, 3000);
        } else {
          // Recent data — fire immediately
          fireFetches(target, cfg);
        }
      } else {
        // Other error — short wait
        fireFetches(target, cfg, 3000);
      }
    }
  };

  /* ---- handleSearch from form ---- */
  const handleSearch = () => {
    const target = plate.trim().toUpperCase();
    if (!PLATE_REGEX.test(target)) {
      setPlateError('La placa debe tener exactamente 6 caracteres alfanuméricos (letras y números).');
      return;
    }
    setPlateError('');
    setPlate(target);
    doSearch(target);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  /* ---- Force reprocess ---- */
  const handleForce = async () => {
    const target = searchedPlateRef.current;
    if (!target) return;
    try { await api.patch(`/pending-car-plates/plate/${target}/reset-all`); } catch { /* proceed anyway */ }
    setProcessedAt(new Date().toISOString());
    doSearch(target);
  };

  /* ---- Warnings computed from data ---- */
  const warnings = useMemo(() => {
    const list = [];

    // SBS accidents
    if (insuranceData) {
      const total =
        (insuranceData.soatAccidents || 0) +
        (insuranceData.insuranceAccidents || 0) +
        (insuranceData.catAccidents || 0);
      if (total > 0) {
        list.push({
          severity: 'danger',
          message: `Este vehículo registra ${total} accidente${total !== 1 ? 's' : ''} en SBS`,
        });
      }
    }

    // Expired inspection
    if (inspectionData && inspectionData.length > 0) {
      const latest = inspectionData[0];
      if (latest.REVISIONVIGENCIAFINAL) {
        const [d, m, y] = latest.REVISIONVIGENCIAFINAL.split('/');
        const expiry = new Date(y, m - 1, d);
        if (expiry < new Date()) {
          list.push({ severity: 'danger', message: 'Revisión técnica vehicular vencida' });
        }
      }
    }

    // Insurance company in SUNARP history
    if (sunarpData && Array.isArray(sunarpData)) {
      const transferCount = sunarpData.filter((record) => {
        const cat = (record.category || '').toUpperCase();
        return cat.includes('TRANSFERENCIA DE PROPIEDAD') || cat.includes('INSCRIPCION DE VEHICULO');
      }).length;
      if (transferCount > 3) {
        list.push({
          severity: 'danger',
          message: `Este vehículo registra ${transferCount} transferencias de propiedad en SUNARP`,
        });
      }

      const cambioCaracteristicas = sunarpData.some((record) => {
        const cat = (record.category || '').toUpperCase();
        return cat.includes('CAMBIO DE CARACTER');
      });
      if (cambioCaracteristicas) {
        list.push({
          severity: 'warning',
          message: 'El vehículo registra cambio de características en SUNARP — posible cambio de uso (taxi u otro)',
        });
      }

      const keywords = ['PACIFICO', 'SEGUROS', 'REASEGUROS'];
      const hasInsuranceTx = sunarpData.some((record) => {
        const combined = `${record.naturalParticipants || ''} ${record.legalParticipants || ''}`.toUpperCase();
        return keywords.some(k => combined.includes(k));
      });
      if (hasInsuranceTx) {
        list.push({
          severity: 'warning',
          message: 'Posible pérdida total — el vehículo fue transferido a una compañía de seguros',
        });
      }
    }

    // Taxi usage
    if (apesegSoatData && Array.isArray(apesegSoatData)) {
      const isTaxi = apesegSoatData.some(
        (s) => s.nombreUsoVehiculo?.toUpperCase() === 'TAXI'
      );
      if (isTaxi) {
        list.push({ severity: 'warning', message: 'Vehículo registrado como taxi en alguna póliza SOAT' });
      }

      // Expired latest SOAT
      const sorted = [...apesegSoatData].sort((a, b) => {
        const parse = (str) => {
          if (!str) return 0;
          const [dd, mm, yy] = str.split('/');
          return new Date(yy, mm - 1, dd).getTime();
        };
        return parse(b.fechaInicio) - parse(a.fechaInicio);
      });
      if (sorted[0]?.estado === 'VENCIDO') {
        list.push({ severity: 'warning', message: 'El SOAT más reciente está vencido' });
      }
    }

    return list;
  }, [insuranceData, inspectionData, sunarpData, apesegSoatData]);

  /* ================================================================
     RENDER
     ================================================================ */
  const cfg = enabledRef.current;
  const isCollapsed = phase !== 'idle';

  return (
    <div className="nsp-page">
      {/* ---- Hero spacer (animates to collapse) ---- */}
      <div className={`nsp-hero-spacer ${isCollapsed ? 'nsp-hero-spacer--collapsed' : ''}`} />

      {/* ---- Search zone (stays near top after spacer collapses) ---- */}
      <div className="nsp-search-zone">
        {phase === 'idle' && (
          <p className="nsp-search-hint">Ingresa la placa del vehículo para consultar su historial</p>
        )}
        <div className={`nsp-search-bar ${isCollapsed ? 'nsp-search-bar--compact' : ''}`}>
          <div className="nsp-input-row">
            <input
              ref={inputRef}
              type="text"
              className={`nsp-input ${plateError ? 'nsp-input--error' : ''}`}
              placeholder="Ej. ABC123"
              value={plate}
              maxLength={6}
              onChange={(e) => {
                setPlate(e.target.value.toUpperCase());
                if (plateError) setPlateError('');
              }}
              onKeyDown={handleKeyDown}
              disabled={phase === 'loading'}
              aria-label="Placa del vehículo"
            />
            <button
              className="nsp-search-btn"
              onClick={handleSearch}
              disabled={phase === 'loading'}
              aria-label="Buscar"
            >
              <span className="nsp-btn-icon-wrap" aria-hidden="true">
                {phase === 'loading' && <span className="nsp-btn-spinner" />}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
            </button>
          </div>
          {plateError && <p className="nsp-input-error" role="alert">{plateError}</p>}
        </div>
      </div>

      {/* ---- Phase B: Loading ---- */}
      {phase === 'loading' && (
        <div className="nsp-loader">
          <div className="nsp-loader__spinner" aria-hidden="true" />
          <p className="nsp-loader__message" key={loadingMsgIdx} aria-live="polite">
            {LOADING_MESSAGES[loadingMsgIdx]}
          </p>
          <p className="nsp-loader__plate">{searchedPlateRef.current}</p>
        </div>
      )}

      {/* ---- Phase C: Results ---- */}
      {phase === 'results' && (
        <div className="nsp-results">
          {/* Recent searches row + force button */}
          <div className="nsp-recents">
            {recentSearches.map((p, idx) => {
              const isActive = p === searchedPlateRef.current;
              return (
                <button
                  key={p}
                  className={`nsp-recent-chip ${isActive ? 'nsp-recent-chip--active' : ''} ${idx >= 2 ? 'nsp-recent-chip--hide-mobile' : ''}`}
                  onClick={() => {
                    if (!isActive) {
                      setPlate(p);
                      doSearch(p);
                    }
                  }}
                  disabled={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`Buscar placa ${p}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  {p}
                </button>
              );
            })}
            <button
              className="nsp-force-btn"
              onClick={handleForce}
              disabled={phase === 'loading'}
              aria-label="Forzar reprocesamiento"
              title="Forzar reprocesamiento del servidor"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Reprocesar
            </button>
          </div>
          {processedAt && (
            <p className="nsp-processed-info">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Datos consultados {timeAgo(processedAt)}
              {isOlderThanOneMonth(processedAt) && (
                <span className="nsp-processed-info__stale"> · reprocesado automáticamente</span>
              )}
            </p>
          )}

          {/* Quick summary panel */}
          <div className="nsp-summary">
            {/* Último dueño */}
            <div className="nsp-summary__item">
              <span className="nsp-summary__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <div className="nsp-summary__info">
                <span className="nsp-summary__label">Último dueño</span>
                <span className="nsp-summary__value">
                  {isLoadingSunarp
                    ? <span className="nsp-summary__dots">···</span>
                    : (() => {
                        if (!sunarpData || !Array.isArray(sunarpData) || sunarpData.length === 0) return '—';
                        const sorted = [...sunarpData].sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
                        const lastTransfer = sorted.find(r => {
                          const cat = r.category?.toUpperCase() || '';
                          const act = r.actType?.toUpperCase() || '';
                          return cat.includes('TRANSFERENCIA DE PROPIEDAD') ||
                            cat.includes('INSCRIPCIÓN DE VEHÍCULO') ||
                            cat.includes('INSCRIPCION DE VEHICULO') ||
                            act.includes('PRIMERA INSCRIPCIÓN DE DOMINIO') ||
                            act.includes('PRIMERA INSCRIPCION DE DOMINIO');
                        }) || sorted[0];
                        return lastTransfer.naturalParticipants || lastTransfer.legalParticipants || '—';
                      })()
                  }
                </span>
              </div>
            </div>

            {/* SOAT vigente */}
            {(() => {
              const soatVigente = !isLoadingApesegSoat && apesegSoatData?.length
                ? (() => {
                    const sorted = [...apesegSoatData].sort((a, b) => {
                      const p = s => { if (!s) return 0; const [d,m,y] = s.split('/'); return new Date(y,m-1,d).getTime(); };
                      return p(b.fechaInicio) - p(a.fechaInicio);
                    });
                    return sorted[0]?.estado === 'VIGENTE' ? 'yes' : 'no';
                  })()
                : null;
              return (
                <div className={`nsp-summary__item ${soatVigente === 'yes' ? 'nsp-summary__item--success' : soatVigente === 'no' ? 'nsp-summary__item--danger' : ''}`}>
                  <span className="nsp-summary__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  <div className="nsp-summary__info">
                    <span className="nsp-summary__label">SOAT vigente</span>
                    {isLoadingApesegSoat
                      ? <span className="nsp-summary__dots">···</span>
                      : !apesegSoatData?.length
                        ? <span className="nsp-summary__badge nsp-summary__badge--unknown">Sin datos</span>
                        : soatVigente === 'yes'
                          ? <span className="nsp-summary__badge nsp-summary__badge--yes">Sí</span>
                          : <span className="nsp-summary__badge nsp-summary__badge--no">No</span>
                    }
                  </div>
                </div>
              );
            })()}

            {/* Inspección vigente */}
            {(() => {
              const inspVigente = !isLoadingInspection && inspectionData?.length
                ? (() => {
                    const latest = inspectionData[0];
                    if (!latest.REVISIONVIGENCIAFINAL) return null;
                    const [d, m, y] = latest.REVISIONVIGENCIAFINAL.split('/');
                    return new Date(y, m - 1, d) >= new Date() ? 'yes' : 'no';
                  })()
                : null;
              return (
                <div className={`nsp-summary__item ${inspVigente === 'yes' ? 'nsp-summary__item--success' : inspVigente === 'no' ? 'nsp-summary__item--danger' : ''}`}>
                  <span className="nsp-summary__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </span>
                  <div className="nsp-summary__info">
                    <span className="nsp-summary__label">Inspección vigente</span>
                    {isLoadingInspection
                      ? <span className="nsp-summary__dots">···</span>
                      : !inspectionData?.length || !inspectionData[0].REVISIONVIGENCIAFINAL
                        ? <span className="nsp-summary__badge nsp-summary__badge--unknown">Sin datos</span>
                        : inspVigente === 'yes'
                          ? <span className="nsp-summary__badge nsp-summary__badge--yes">Sí</span>
                          : <span className="nsp-summary__badge nsp-summary__badge--no">No</span>
                    }
                  </div>
                </div>
              );
            })()}

            {/* Accidentes SBS */}
            {(() => {
              const accidentState = !isLoadingInsurance && insuranceData
                ? (((insuranceData.soatAccidents || 0) + (insuranceData.insuranceAccidents || 0) + (insuranceData.catAccidents || 0)) > 0 ? 'yes' : 'no')
                : null;
              return (
                <div className={`nsp-summary__item ${accidentState === 'yes' ? 'nsp-summary__item--danger' : accidentState === 'no' ? 'nsp-summary__item--success' : ''}`}>
                  <span className="nsp-summary__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </span>
                  <div className="nsp-summary__info">
                    <span className="nsp-summary__label">Accidentes SBS</span>
                    {isLoadingInsurance
                      ? <span className="nsp-summary__dots">···</span>
                      : (() => {
                          if (!insuranceData)
                            return <span className="nsp-summary__badge nsp-summary__badge--unknown">Sin datos</span>;
                          const total = (insuranceData.soatAccidents || 0) + (insuranceData.insuranceAccidents || 0) + (insuranceData.catAccidents || 0);
                          return total > 0
                            ? <span className="nsp-summary__badge nsp-summary__badge--no">Sí</span>
                            : <span className="nsp-summary__badge nsp-summary__badge--yes">No</span>;
                        })()
                    }
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Vehicle Timeline */}
          <VehicleTimeline
            sunarpData={sunarpData}
            apesegSoatData={apesegSoatData}
            inspectionData={inspectionData}
            insuranceData={insuranceData}
          />

          {/* Alert banners */}
          {warnings.length > 0 && (
            <section className="nsp-alerts" aria-label="Alertas del vehículo">
              {warnings.map((w, i) => (
                <div
                  key={i}
                  className={`nsp-alert nsp-alert--${w.severity}`}
                  role="alert"
                >
                  <span className="nsp-alert__icon" aria-hidden="true">
                    {w.severity === 'danger' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    )}
                  </span>
                  <span className="nsp-alert__text">{w.message}</span>
                </div>
              ))}
            </section>
          )}

          {/* Collapsible data cards */}
          <div className="nsp-cards">
            {cfg.vehicleInfo && (
              <CollapsibleCard title="Información vehicular" isLoading={isLoadingVehicle}>
                <VehicleInfoCard
                  vehicleData={vehicleData}
                  isLoading={isLoadingVehicle}
                  searchPlate={searchedPlateRef.current}
                  onImageClick={() => setIsImageModalOpen(true)}
                />
              </CollapsibleCard>
            )}

            {cfg.sunarp && (
              <CollapsibleCard title="Historial SUNARP" isLoading={isLoadingSunarp}>
                <SunarpCard
                  sunarpData={sunarpData}
                  isLoading={isLoadingSunarp}
                />
              </CollapsibleCard>
            )}

            {cfg.insurance && (
              <CollapsibleCard title="Historial de seguros (SBS)" isLoading={isLoadingInsurance}>
                <InsuranceCard
                  insuranceData={insuranceData}
                  isLoading={isLoadingInsurance}
                />
              </CollapsibleCard>
            )}

            {cfg.soatApeseg && (
              <CollapsibleCard title="SOAT APESEG" isLoading={isLoadingApesegSoat}>
                <ApesegSoatCard
                  apesegSoatData={apesegSoatData}
                  isLoading={isLoadingApesegSoat}
                />
              </CollapsibleCard>
            )}

            {cfg.inspection && (
              <CollapsibleCard title="Inspección técnica" isLoading={isLoadingInspection}>
                <InspectionTableCard
                  inspectionData={inspectionData}
                  isLoading={isLoadingInspection}
                  onShowDetails={(insp) => {
                    setSelectedInspection(insp);
                    setIsInspectionModalOpen(true);
                  }}
                />
              </CollapsibleCard>
            )}
          </div>
        </div>
      )}

      {/* ---- Modals ---- */}
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

export default NewSearchPage;
