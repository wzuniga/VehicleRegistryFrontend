import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import './SunarpTimeline.css';

const SunarpTimeline = ({ sunarpData, insuranceData }) => {
    // 1. Hooks MUST be at the top level, before any returns
    // State for Tooltip Portal
    const [hoveredRecord, setHoveredRecord] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const scrollRef = useRef(null);
    const prevZoomRef = useRef(1);
    const zoomOriginRef = useRef(null); // Used to specify a pivot point for zoom

    // Drag to zoom state
    const [dragStart, setDragStart] = useState(null);
    const [dragCurrent, setDragCurrent] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle global mouse events for dragging
    useEffect(() => {
        if (dragStart === null) return; // Only activate listeners when a drag is in progress

        const handleWindowMouseMove = (e) => {
            if (scrollRef.current) {
                const rect = scrollRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                // Clamp x to the bounds of the container to prevent selection going too far
                const clampedX = Math.max(0, Math.min(rect.width, x));
                setDragCurrent(clampedX);
            }
        };

        const handleWindowMouseUp = () => {
            if (scrollRef.current && dragCurrent !== null) {
                const width = Math.abs(dragCurrent - dragStart);
                const threshold = 10;

                if (width > threshold) {
                    const container = scrollRef.current;
                    const containerWidth = container.clientWidth;
                    const currentScrollLeft = container.scrollLeft;

                    // Calculate absolute position in content of the selection midpoint
                    const midPointViewport = (Math.min(dragStart, dragCurrent) + Math.max(dragStart, dragCurrent)) / 2;
                    const absolutePointInContent = currentScrollLeft + midPointViewport;

                    const zoomFactor = containerWidth / width;
                    let targetZoom = zoomLevel * zoomFactor;

                    targetZoom = Math.min(targetZoom, 12);
                    targetZoom = Math.max(targetZoom, 1);

                    // Store absolute content position and where we want it to appear in viewport
                    zoomOriginRef.current = {
                        absolutePoint: absolutePointInContent,
                        target: containerWidth / 2,
                        // Flag to distinguish from wheel zoom
                        isDragZoom: true
                    };

                    setZoomLevel(targetZoom);
                }
            }
            setDragStart(null);
            setDragCurrent(null);
        };

        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [dragStart, dragCurrent, zoomLevel]); // Re-run effect if dragStart changes (start/end drag) or zoomLevel changes (to get latest value)

    // Adjust scroll to zoom from mouse position or center
    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const prevZoom = prevZoomRef.current;

            if (zoomLevel !== prevZoom) {
                const scale = zoomLevel / prevZoom;
                let newScrollLeft;
                let isDragZoom = false;

                if (zoomOriginRef.current && zoomOriginRef.current.isDragZoom) {
                    // Drag-to-zoom: we have absolute position in content
                    const absolutePoint = zoomOriginRef.current.absolutePoint;
                    const target = zoomOriginRef.current.target;

                    // Scale the absolute point
                    const newAbsolutePoint = absolutePoint * scale;
                    newScrollLeft = newAbsolutePoint - target;
                    isDragZoom = true;

                    zoomOriginRef.current = null;
                } else {
                    // Wheel zoom or button zoom: calculate from current position
                    let pivot, target;
                    if (zoomOriginRef.current && typeof zoomOriginRef.current === 'object') {
                        pivot = zoomOriginRef.current.pivot;
                        target = zoomOriginRef.current.target;
                        zoomOriginRef.current = null;
                    } else if (zoomOriginRef.current) {
                        pivot = zoomOriginRef.current;
                        target = pivot;
                        zoomOriginRef.current = null;
                    } else {
                        pivot = container.clientWidth / 2;
                        target = pivot;
                    }

                    const pointInContent = container.scrollLeft + pivot;
                    const newPointInContent = pointInContent * scale;
                    newScrollLeft = newPointInContent - target;
                }

                if (isDragZoom) {
                    // For drag zoom, wait for DOM to update before scrolling
                    requestAnimationFrame(() => {
                        if (scrollRef.current) {
                            const maxScroll = Math.max(0, scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
                            scrollRef.current.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
                        }
                    });
                } else {
                    // For wheel/button zoom, immediate scroll is fine
                    const newScrollWidth = container.scrollWidth * scale;
                    const maxScroll = Math.max(0, newScrollWidth - container.clientWidth);
                    container.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
                }

                prevZoomRef.current = zoomLevel;
            }
        }
    }, [zoomLevel]);

    const handleMouseDown = (e) => {
        // Only start drag on left click and if we are hitting the wrapper (not a button)
        // Note: Timeline dots stop propagation or handle events separately if needed?
        // Actually, dots just handle mouseEnter. Click passes through.
        if (e.button === 0 && scrollRef.current) {
            const rect = scrollRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            setDragStart(x);
            setDragCurrent(x); // Initialize dragCurrent to dragStart
        }
    };

    const handleMouseEnter = (e, record) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const popupWidth = 280;
        const margin = 12; // Gap from screen edge
        const viewportWidth = window.innerWidth;

        // Calculate dot center in relative viewport coords
        const dotCenterX = rect.left + (rect.width / 2);

        // Clamp the center of the popup so it doesn't go off screen
        // Min X: half popup width + margin
        // Max X: viewport width - half popup width - margin
        const minX = (popupWidth / 2) + margin;
        const maxX = viewportWidth - (popupWidth / 2) - margin;

        const clampedCenterX = Math.max(minX, Math.min(maxX, dotCenterX));

        // Calculate the difference to shift the arrow back to the dot
        const arrowOffset = dotCenterX - clampedCenterX;

        // Position above the dot
        setTooltipPosition({
            top: rect.top + window.scrollY,
            left: clampedCenterX + window.scrollX,
            arrowOffset: arrowOffset
        });
        setHoveredRecord(record);
    };

    const handleMouseLeave = () => {
        setHoveredRecord(null);
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.5, 8)); // Max zoom 8x
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.5, 1)); // Min zoom 1x
    };

    const handleResetZoom = () => {
        setZoomLevel(1);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // When zooming with wheel, we want the point under the mouse (pivot) 
        // to remain under the mouse (target)
        zoomOriginRef.current = { pivot: x, target: x };

        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    // Helper functions
    const parseInsuranceDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length !== 3) return null;
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    const parseInsuranceHtml = (htmlString) => {
        if (!htmlString) return [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const rows = doc.querySelectorAll('tbody tr');
        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 8) return null;
            return {
                company: cells[0]?.textContent.trim(),
                accidents: parseInt(cells[3]?.textContent.trim() || '0', 10),
                policyNumber: cells[4]?.textContent.trim(),
                startDate: cells[6]?.textContent.trim(),
                endDate: cells[7]?.textContent.trim(),
            };
        }).filter(Boolean);
    };

    // Combine Data Logic
    // We do this calculation every render. Could use useMemo if performance issues arise.
    let combinedData = [...(sunarpData || [])];

    if (insuranceData) {
        const soatRecords = parseInsuranceHtml(insuranceData.soatTableDetails);
        const insuranceRecords = parseInsuranceHtml(insuranceData.insuranceTableDetails);
        const catRecords = parseInsuranceHtml(insuranceData.catTableDetails);
        const allInsurance = [...soatRecords, ...insuranceRecords, ...catRecords];
        // Filter for accidents > 0
        const accidentRecords = allInsurance.filter(r => r.accidents > 0);

        const accidentTimelineEvents = accidentRecords.map((r, i) => ({
            id: `accident-${i}`,
            registrationDate: parseInsuranceDate(r.startDate),
            category: 'ACCIDENTE',
            actType: 'SINIESTRO REGISTRADO',
            naturalParticipants: r.company,
            legalParticipants: `Póliza: ${r.policyNumber}`,
            notes: `Se registraron ${r.accidents} accidente(s) en el periodo del seguro. Fin de vigencia: ${r.endDate}`,
            isAccident: true
        })).filter(r => r.registrationDate);

        combinedData = [...combinedData, ...accidentTimelineEvents];

        // Check for expired SOAT
        if (soatRecords.length > 0) {
            // Sort by end date descending to find the latest policy
            const sortedSoat = [...soatRecords].sort((a, b) => {
                const dateA = new Date(parseInsuranceDate(a.endDate));
                const dateB = new Date(parseInsuranceDate(b.endDate));
                return dateB - dateA;
            });

            const latestSoat = sortedSoat[0];
            if (latestSoat && latestSoat.endDate) {
                const endDateStr = parseInsuranceDate(latestSoat.endDate);
                if (endDateStr) {
                    const endDate = new Date(endDateStr);
                    const today = new Date();
                    // Reset time parts for accurate date comparison
                    today.setHours(0, 0, 0, 0);
                    endDate.setHours(0, 0, 0, 0);

                    if (endDate < today) {
                        const expiredSoatEvent = {
                            id: 'expired-soat-warning',
                            registrationDate: new Date().toISOString().split('T')[0], // Today
                            category: 'ALERTA',
                            actType: 'SOAT VENCIDO',
                            naturalParticipants: latestSoat.company,
                            legalParticipants: `Póliza: ${latestSoat.policyNumber}`,
                            notes: `El SOAT venció el ${latestSoat.endDate}. Se recomienda regularizar su situación.`,
                            isExpiredSoat: true
                        };
                        combinedData.push(expiredSoatEvent);
                    }
                }
            }
        }
    }

    // Early return if no data at all
    if (combinedData.length === 0) {
        return null;
    }

    // Ordenar por fecha de registro ascendente
    const sortedData = combinedData.sort((a, b) => {
        const dateA = new Date(a.registrationDate);
        const dateB = new Date(b.registrationDate);
        return dateA - dateB;
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getParticipants = (record) => {
        if (record.naturalParticipants) return record.naturalParticipants;
        if (record.legalParticipants) return record.legalParticipants;
        return 'Sin participantes registrados';
    };

    // Calcular rango de fechas y posiciones
    const dates = sortedData.map(d => new Date(d.registrationDate).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const totalDuration = maxDate - minDate;

    // Si min y max son iguales (solo 1 registro o registros en el mismo ms), evitar división por cero
    const isSinglePoint = totalDuration === 0;

    const getPositionStyle = (dateString) => {
        if (isSinglePoint) return { left: '50%', alignment: 'center' };

        const date = new Date(dateString).getTime();
        // Calcular porcentaje
        let percentage = ((date - minDate) / totalDuration) * 100;

        // Clamp entre 0 y 100 por si acaso
        percentage = Math.max(0, Math.min(100, percentage));

        let alignment = 'center';
        if (percentage < 30) alignment = 'left';
        else if (percentage > 70) alignment = 'right';

        return { left: `${percentage}%`, alignment };
    };

    // Calculate Years for Markers
    const minYear = new Date(minDate).getFullYear();
    const maxYear = new Date(maxDate).getFullYear();
    const yearMarkers = [];

    // Only generate markers if we have a valid range
    if (!isSinglePoint && totalDuration > 0) {
        const totalYearRange = maxYear - minYear;
        // Calculate step to keep markers under 10 (approx)
        // If range is 20, step should be 2 or 3.
        // Math.ceil(20 / 10) = 2.
        const step = totalYearRange > 10 ? Math.ceil(totalYearRange / 10) : 1;

        for (let year = minYear; year <= maxYear + 1; year += step) {
            const date = new Date(year, 0, 1).getTime(); // Jan 1st of year
            if (date >= minDate && date <= maxDate + (totalDuration * 0.1)) { // Allow a bit of overflow for visual continuity
                // Calculate position using same logic
                let percentage = ((date - minDate) / totalDuration) * 100;
                if (percentage >= 0 && percentage <= 100) {
                    yearMarkers.push({ year, left: `${percentage}%` });
                }
            }
        }
    }

    return (
        <div className="info-card timeline-card">
            <div className="card-header timeline-header">
                <h3>Línea de Tiempo Registral</h3>
                <div className="timeline-controls">
                    <button onClick={handleZoomOut} disabled={zoomLevel <= 1} className="zoom-btn" title="Alejar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <span className="zoom-level">{(zoomLevel * 100).toFixed(0)}%</span>
                    <button onClick={handleZoomIn} disabled={zoomLevel >= 8} className="zoom-btn" title="Acercar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <button onClick={handleResetZoom} disabled={zoomLevel === 1} className="zoom-btn" title="Restablecer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <path d="M3 3v5h5"></path>
                        </svg>
                    </button>
                </div>
                {false && (
                    <div className="warning-icon" title="Información referencial">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                )}
            </div>
            <div className={`card-content timeline-content ${zoomLevel > 1 ? 'is-zoomed' : ''}`}>
                <div
                    className="timeline-scroll-wrapper"
                    onWheel={handleWheel}
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    style={{
                        cursor: dragStart !== null ? 'col-resize' : 'grab',
                        position: 'relative',
                        userSelect: 'none' // Prevent text selection while dragging
                    }}
                >
                    {dragStart !== null && dragCurrent !== null && (
                        <div
                            className="timeline-selection-overlay"
                            style={{
                                left: Math.min(dragStart, dragCurrent),
                                width: Math.abs(dragCurrent - dragStart)
                            }}
                        />
                    )}
                    <div className="timeline-container" style={{ width: `${zoomLevel * 100}%` }}>

                        {/* Year Markers Layer */}
                        <div className="timeline-years">
                            {yearMarkers.map(marker => (
                                <div key={marker.year} className="year-marker" style={{ left: marker.left }}>
                                    <span className="year-label">{marker.year}</span>
                                    <div className="year-tick"></div>
                                </div>
                            ))}
                        </div>

                        <div className="timeline-line"></div>
                        <div className="timeline-items">
                            {sortedData.map((record, index) => {
                                const style = getPositionStyle(record.registrationDate);
                                const actTypeUpper = record.actType?.toUpperCase() || '';
                                const categoryUpper = record.category?.toUpperCase() || '';

                                const isWarning = actTypeUpper.includes('CAMBIO DE MOTOR') || record.isExpiredSoat;
                                const isDanger = actTypeUpper.includes('ANOTACIÓN DE EMBARGO') ||
                                    actTypeUpper.includes('ANOTACION DE EMBARGO') ||
                                    categoryUpper.includes('REEMPLACAMIENTO') ||
                                    record.isAccident;

                                let itemClass = 'timeline-item';
                                if (isDanger) itemClass += ' danger';
                                else if (isWarning) itemClass += ' warning';

                                if (record.isAccident) itemClass += ' accident-node';
                                if (record.isExpiredSoat) itemClass += ' expired-soat-node';

                                return (
                                    <div
                                        key={record.id || index}
                                        className={itemClass}
                                        style={{ left: style.left }}
                                    >
                                        <div className="timeline-dot-wrapper">
                                            <div
                                                className="timeline-dot"
                                                onMouseEnter={(e) => handleMouseEnter(e, record)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {record.isAccident && (
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                )}
                                                {record.isExpiredSoat && (
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="timeline-date">{formatDate(record.registrationDate)}</div>
                                        </div>
                                        {/* Removed inline popup */}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Render Portal Tooltip */}
            {hoveredRecord && createPortal(
                <div
                    className="timeline-popup-portal"
                    style={{
                        top: tooltipPosition.top - 15, // Gap above dot
                        left: tooltipPosition.left
                    }}
                >
                    <div className="popup-header">
                        <span className="popup-date">{formatDate(hoveredRecord.registrationDate)}</span>
                        <span className="popup-category">
                            {hoveredRecord.category}
                            {hoveredRecord.isAccident && <span style={{ marginLeft: '8px', fontSize: '0.7em', background: '#e12305', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>PELIGRO</span>}
                            {hoveredRecord.isExpiredSoat && <span style={{ marginLeft: '8px', fontSize: '0.7em', background: '#d19700', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>VENCIDO</span>}
                        </span>
                    </div>
                    <div className="popup-body">
                        <div className="popup-row">
                            <span className="popup-label">Acto / Detalle:</span>
                            <span className="popup-value">{hoveredRecord.actType}</span>
                        </div>
                        <div className="popup-row">
                            <span className="popup-label">Participantes / Info:</span>
                            <span className="popup-value">{getParticipants(hoveredRecord)}</span>
                        </div>
                        {hoveredRecord.notes && (
                            <div className="popup-row">
                                <span className="popup-label">Notas:</span>
                                <span className="popup-value">{hoveredRecord.notes}</span>
                            </div>
                        )}
                    </div>
                    {/* Little arrow at bottom */}
                    <div className="popup-arrow" style={{ left: `calc(50% + ${tooltipPosition.arrowOffset || 0}px)` }}></div>
                </div>,
                document.body
            )}
        </div>
    );
};

SunarpTimeline.propTypes = {
    sunarpData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            registrationDate: PropTypes.string,
            category: PropTypes.string,
            actType: PropTypes.string,
            naturalParticipants: PropTypes.string,
            legalParticipants: PropTypes.string,
            notes: PropTypes.string
        })
    ),
    insuranceData: PropTypes.object
};

export default SunarpTimeline;
