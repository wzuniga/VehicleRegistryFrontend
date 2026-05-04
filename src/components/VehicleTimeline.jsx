import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './VehicleTimeline.css';

// ── Config ─────────────────────────────────────────────────────────────────────
const INSURANCE_KEYWORDS = ['PACIFICO', 'SEGUROS', 'REASEGUROS', 'RIMAC', 'MAPFRE', 'POSITIVA', 'INTERSEGURO'];

const EVENT_CONFIG = {
  transfer:           { label: 'Compra / Venta',           color: '#3b82f6', critical: false },
  insurance_transfer: { label: 'Alerta SUNARP',            color: '#f97316', critical: true  },
  registration:       { label: 'Registro SUNARP',          color: '#6366f1', critical: false },
  accident:           { label: 'Accidente SBS',            color: '#ef4444', critical: true  },
  soat_expired:       { label: 'SOAT Vencido',             color: '#dc2626', critical: true  },
  soat:               { label: 'SOAT Vigente',             color: '#10b981', critical: false },
  inspection:         { label: 'Inspección Vigente',       color: '#8b5cf6', critical: false },
  inspection_expired: { label: 'Inspección Vencida',       color: '#dc2626', critical: true  },
};

// ── Utils ──────────────────────────────────────────────────────────────────────
const parseDMY = (str) => {
  if (!str) return null;
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
};

const parseHTMLTable = (html) => {
  if (!html) return [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return Array.from(doc.querySelectorAll('tbody tr')).map(row => {
      const c = Array.from(row.querySelectorAll('td'));
      return {
        company:           c[0]?.textContent.trim() || '',
        accidents:         parseInt(c[3]?.textContent.trim()) || 0,
        policyNumber:      c[4]?.textContent.trim() || '',
        certificateNumber: c[5]?.textContent.trim() || '',
        startDate:         c[6]?.textContent.trim() || '',
        endDate:           c[7]?.textContent.trim() || '',
      };
    });
  } catch { return []; }
};

// ── Normalize all sources → unified events ─────────────────────────────────────
const normalizeEvents = (sunarpData, apesegSoatData, inspectionData, insuranceData) => {
  const events = [];
  const today = new Date();

  if (sunarpData?.length) {
    sunarpData.forEach((r, i) => {
      const date = r.registrationDate ? new Date(r.registrationDate) : null;
      if (!date || isNaN(date)) return;
      const cat = (r.category || '').toUpperCase();
      const actUp = (r.actType || '').toUpperCase();
      const participants = `${r.naturalParticipants || ''} ${r.legalParticipants || ''}`.toUpperCase();
      const isInsuranceTx =
        INSURANCE_KEYWORDS.some(k => participants.includes(k)) ||
        cat.includes('CAMBIO DE CARACTER') ||
        cat.includes('CAMBIO DE PLACA') ||
        actUp.includes('ADJUDICACION') ||
        actUp.includes('MEDIDA CAUTELAR') ||
        actUp.includes('SEGURO');
      const isTransfer = cat.includes('TRANSFERENCIA') || cat.includes('INSCRIPCI');
      const type = isInsuranceTx ? 'insurance_transfer' : isTransfer ? 'transfer' : 'registration';
      events.push({
        id: `sunarp-${i}`, date, type,
        title: isInsuranceTx ? 'Transferencia a compañía de seguros'
          : isTransfer ? 'Compra / Venta'
          : 'Registro SUNARP',
        details: {
          'Fecha': date.toLocaleDateString('es-PE'),
          'Categoría': r.category || '—',
          'Tipo de acto': r.actType || '—',
          'Participante': r.naturalParticipants || r.legalParticipants || '—',
          ...(r.notes ? { 'Notas': r.notes } : {}),
        },
      });
    });
  }

  if (apesegSoatData?.length) {
    apesegSoatData.forEach((s, i) => {
      const date = parseDMY(s.fechaFin) || parseDMY(s.fechaInicio);
      if (!date) return;
      const expired = s.estado === 'VENCIDO';
      events.push({
        id: `soat-${i}`, date, type: expired ? 'soat_expired' : 'soat',
        title: `SOAT ${expired ? 'Vencido' : 'Vigente'}`,
        details: {
          'Compañía': s.nombreCompania || '—',
          'Vigencia': `${s.fechaInicio || '—'} – ${s.fechaFin || '—'}`,
          'Estado': s.estado || '—',
          'Uso': s.nombreUsoVehiculo || '—',
          'Póliza': s.numeroPoliza || '—',
        },
      });
    });
  }

  if (inspectionData?.length) {
    inspectionData.forEach((insp, i) => {
      const date = parseDMY(insp.REVISIONVIGENCIAFINAL);
      if (!date) return;
      const expired = date < today;
      events.push({
        id: `insp-${i}`, date, type: expired ? 'inspection_expired' : 'inspection',
        title: `Rev. Técnica ${expired ? 'Vencida' : 'Vigente'}`,
        details: {
          'Certificado': insp.NRO_CERTI || '—',
          'Resultado': insp.RESULTADO || '—',
          'Estado': insp.ESTADO || (expired ? 'VENCIDO' : 'VIGENTE'),
          'Vencimiento': insp.REVISIONVIGENCIAFINAL || '—',
        },
      });
    });
  }

  const parseAccidents = (html, tipo) => {
    parseHTMLTable(html).forEach((row, i) => {
      if (row.accidents <= 0) return;
      const date = parseDMY(row.startDate) || parseDMY(row.endDate);
      if (!date) return;
      events.push({
        id: `acc-${tipo}-${i}`, date, type: 'accident',
        title: `Accidente ${tipo} (${row.accidents})`,
        details: {
          'Tipo': tipo,
          'Compañía': row.company || '—',
          'Accidentes': String(row.accidents),
          'Póliza': row.policyNumber || row.certificateNumber || '—',
          'Período': `${row.startDate || '—'} – ${row.endDate || '—'}`,
        },
      });
    });
  };
  if (insuranceData) {
    parseAccidents(insuranceData.soatTableDetails, 'SOAT');
    parseAccidents(insuranceData.insuranceTableDetails, 'Seguro privado');
    parseAccidents(insuranceData.catTableDetails, 'CAT / AFOCAT');
  }

  // All SOATs except the most recent → gray (non-critical)
  // Most recent SOAT keeps its real color: green (vigente) or red (vencido)
  const allSoats = events
    .filter(e => e.type === 'soat' || e.type === 'soat_expired')
    .sort((a, b) => b.date - a.date);
  allSoats.slice(1).forEach(e => { e.critical = false; e.color = '#94a3b8'; });

  // Only the most recent expired inspection is critical — older ones become gray
  const inspExpired = events.filter(e => e.type === 'inspection' || e.type === 'inspection_expired').sort((a, b) => b.date - a.date);
  inspExpired.slice(1).forEach(e => { e.critical = false; e.color = '#94a3b8'; });

  return events.sort((a, b) => a.date - b.date);
};

// ── Axis ticks ──────────────────────────────────────────────────────────────────
const computeAxisTicks = (viewStart, viewEnd) => {
  const rangeMs = viewEnd - viewStart;
  const rangeYears = rangeMs / (365.25 * 24 * 3600e3);
  const ticks = [];
  let d = new Date(viewStart);

  if (rangeYears < 0.5) {
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    while (d <= viewEnd) { if (d >= viewStart) ticks.push(new Date(d)); d.setDate(d.getDate() + 7); }
  } else if (rangeYears < 2) {
    d = new Date(d.getFullYear(), d.getMonth(), 1);
    while (d <= viewEnd) { if (d >= viewStart) ticks.push(new Date(d)); d.setMonth(d.getMonth() + 1); }
  } else if (rangeYears < 6) {
    d = new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
    while (d <= viewEnd) { if (d >= viewStart) ticks.push(new Date(d)); d.setMonth(d.getMonth() + 3); }
  } else {
    d = new Date(d.getFullYear(), 0, 1);
    while (d <= viewEnd) { if (d >= viewStart) ticks.push(new Date(d)); d.setFullYear(d.getFullYear() + 1); }
  }
  return ticks;
};

const formatTick = (date, rangeYears) => {
  if (rangeYears < 0.5) return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  if (rangeYears < 2) return date.toLocaleDateString('es-PE', { month: 'short', year: '2-digit' });
  return String(date.getFullYear());
};

// ── Event Icons ──────────────────────────────────────────────────────────────────
const EventIcon = ({ type, size = 22, color: colorOverride }) => {
  const color = colorOverride ?? EVENT_CONFIG[type]?.color ?? '#6366f1';
  const s = size;
  switch (type) {
    case 'transfer':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="2" fill={color} opacity="0.18" stroke={color} strokeWidth="1.8"/>
          <line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth="1.8"/>
          <line x1="6" y1="15" x2="10" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <line x1="14" y1="15" x2="18" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'insurance_transfer':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill={color} opacity="0.18" stroke={color} strokeWidth="1.8"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="17" r="0.8" fill={color}/>
        </svg>
      );
    case 'accident':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {/* Left car */}
          <rect x="0" y="10" width="10" height="5" rx="1.5" fill={color}/>
          <rect x="1" y="7" width="7" height="5" rx="1" fill={color} opacity="0.7"/>
          <circle cx="2" cy="16" r="1.4" fill="white" stroke={color} strokeWidth="1.1"/>
          <circle cx="8" cy="16" r="1.4" fill="white" stroke={color} strokeWidth="1.1"/>
          {/* Right car (mirrored) */}
          <rect x="14" y="10" width="10" height="5" rx="1.5" fill={color}/>
          <rect x="16" y="7" width="7" height="5" rx="1" fill={color} opacity="0.7"/>
          <circle cx="16" cy="16" r="1.4" fill="white" stroke={color} strokeWidth="1.1"/>
          <circle cx="22" cy="16" r="1.4" fill="white" stroke={color} strokeWidth="1.1"/>
          {/* Impact X */}
          <line x1="10.5" y1="8" x2="13.5" y2="14" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
          <line x1="13.5" y1="8" x2="10.5" y2="14" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'soat':
    case 'soat_expired':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} opacity="0.18" stroke={color} strokeWidth="1.8"/>
          {type === 'soat'
            ? <polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            : <><line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/></>}
        </svg>
      );
    case 'inspection':
    case 'inspection_expired':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill={color} opacity="0.18" stroke={color} strokeWidth="1.8"/>
          <polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="1.5"/>
          {type === 'inspection'
            ? <polyline points="9 13 11 15 15 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            : <><line x1="9" y1="11" x2="15" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="11" x2="9" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></>}
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill={color} opacity="0.18" stroke={color} strokeWidth="1.8"/>
        </svg>
      );
  }
};

// ── Main Component ──────────────────────────────────────────────────────────────
const LINE_Y = 130;
const TRACK_HEIGHT = 270;
const LEVEL_STEP = 40;
const CONNECTOR_BASE = 18;

const VehicleTimeline = ({ sunarpData, apesegSoatData, inspectionData, insuranceData }) => {
  const containerRef = useRef(null);
  const [viewRange, setViewRange] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [containerWidth, setContainerWidth] = useState(700);

  const dragRef = useRef({ active: false, startFrac: 0, endFrac: 0 });
  const [dragBox, setDragBox] = useState(null);
  const touchRef = useRef({ active: false, initialDist: 0, initialCenter: 0, initialRange: null });

  // ── Data ──
  const allEvents = useMemo(
    () => normalizeEvents(sunarpData, apesegSoatData, inspectionData, insuranceData),
    [sunarpData, apesegSoatData, inspectionData, insuranceData]
  );

  useEffect(() => {
    if (!allEvents.length) return;
    const start = new Date(allEvents[0].date);
    start.setMonth(start.getMonth() - 3);
    const lastEventDate = allEvents[allEvents.length - 1].date;
    const end = new Date(Math.max(new Date(), lastEventDate));
    end.setMonth(end.getMonth() + 3);
    setViewRange({ start, end });
  }, [allEvents]);

  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setContainerWidth(e.contentRect.width));
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Computed ──
  const rangeMs = viewRange ? viewRange.end - viewRange.start : 1;
  const rangeYears = rangeMs / (365.25 * 24 * 3600e3);

  const filteredEvents = useMemo(() =>
    filter === 'critical' ? allEvents.filter(e => (e.critical ?? EVENT_CONFIG[e.type]?.critical)) : allEvents,
    [allEvents, filter]
  );

  const layoutedEvents = useMemo(() => {
    if (!viewRange) return [];
    const THRESHOLD = 0.04;
    const withPos = filteredEvents
      .filter(e => e.date >= viewRange.start && e.date <= viewRange.end)
      .map(e => ({ ...e, x: (e.date - viewRange.start) / rangeMs }));

    const groups = [];
    withPos.forEach(ev => {
      const g = groups.find(g => Math.abs(g.cx - ev.x) <= THRESHOLD);
      if (g) g.events.push(ev); else groups.push({ cx: ev.x, events: [ev] });
    });
    const placed = [];
    groups.forEach(g => g.events.forEach((ev, i) =>
      placed.push({ ...ev, above: i % 2 === 0, level: Math.floor(i / 2) })
    ));
    return placed;
  }, [filteredEvents, viewRange, rangeMs]);

  const axisTicks = useMemo(() =>
    viewRange ? computeAxisTicks(viewRange.start, viewRange.end) : [],
    [viewRange]
  );

  const todayX = viewRange
    ? Math.max(0, Math.min(1, (new Date() - viewRange.start) / rangeMs))
    : null;

  const selectedEvent = layoutedEvents.find(e => e.id === selectedEventId) || null;

  // ── Zoom: desktop drag ──
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    dragRef.current = { active: true, startFrac: frac, endFrac: frac };
    setDragBox(null);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    const rect = containerRef.current.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    dragRef.current.endFrac = frac;
    const minX = Math.min(dragRef.current.startFrac, frac) * rect.width;
    const maxX = Math.max(dragRef.current.startFrac, frac) * rect.width;
    if (maxX - minX > 6) setDragBox({ left: minX, width: maxX - minX });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const { startFrac, endFrac } = dragRef.current;
    setDragBox(null);
    if (Math.abs(endFrac - startFrac) > 0.02 && viewRange) {
      const lo = Math.min(startFrac, endFrac);
      const hi = Math.max(startFrac, endFrac);
      setViewRange({
        start: new Date(viewRange.start.getTime() + lo * rangeMs),
        end: new Date(viewRange.start.getTime() + hi * rangeMs),
      });
      setSelectedEventId(null);
    }
  }, [viewRange, rangeMs]);

  const resetZoom = useCallback(() => {
    if (!allEvents.length) return;
    const start = new Date(allEvents[0].date);
    start.setMonth(start.getMonth() - 3);
    const lastEventDate = allEvents[allEvents.length - 1].date;
    const end = new Date(Math.max(new Date(), lastEventDate));
    end.setMonth(end.getMonth() + 3);
    setViewRange({ start, end });
  }, [allEvents]);

  // ── Zoom: mobile pinch ──
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 2) return;
    const t0 = e.touches[0], t1 = e.touches[1];
    const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
    const rect = containerRef.current.getBoundingClientRect();
    const cx = ((t0.clientX + t1.clientX) / 2 - rect.left) / rect.width;
    touchRef.current = { active: true, initialDist: dist, initialCenter: cx,
      initialRange: viewRange ? { start: new Date(viewRange.start), end: new Date(viewRange.end) } : null };
  }, [viewRange]);

  const handleTouchMove = useCallback((e) => {
    if (!touchRef.current.active || e.touches.length !== 2) return;
    const { initialDist, initialCenter, initialRange } = touchRef.current;
    if (!initialRange) return;
    const t0 = e.touches[0], t1 = e.touches[1];
    const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
    const scale = initialDist / Math.max(dist, 1);
    const initMs = initialRange.end - initialRange.start;
    const newMs = Math.max(7 * 86400000, Math.min(initMs * scale, 30 * 365 * 86400000));
    const centerMs = initialRange.start.getTime() + initialCenter * initMs;
    setViewRange({
      start: new Date(centerMs - initialCenter * newMs),
      end: new Date(centerMs + (1 - initialCenter) * newMs),
    });
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(() => { touchRef.current.active = false; }, []);

  // ── Event click ──
  const handleEventClick = useCallback((e, id) => {
    e.stopPropagation();
    setSelectedEventId(prev => prev === id ? null : id);
  }, []);

  if (allEvents.length === 0) {
    return (
      <div className="vtl-empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span>Sin datos suficientes para la línea de tiempo</span>
      </div>
    );
  }

  if (!viewRange) return null;

  // ── Popup position computation ──
  const POPUP_H = 160; // estimated max height
  const getPopupPos = (ev) => {
    const iconSize = ev.type === 'accident' ? 28 : 22;
    const yOffset = CONNECTOR_BASE + ev.level * LEVEL_STEP;
    const iconTop = ev.above
      ? LINE_Y - yOffset - iconSize
      : LINE_Y + yOffset;
    const popupW = Math.min(240, containerWidth - 16);
    let left = ev.x * containerWidth - popupW / 2;
    left = Math.max(4, Math.min(left, containerWidth - popupW - 4));
    // Prefer placing popup on same side as event; flip if it would overflow
    let top;
    if (ev.above) {
      top = iconTop - POPUP_H - 6;
      if (top < 4) top = LINE_Y + CONNECTOR_BASE + 8; // not enough room above → below line
    } else {
      top = iconTop + iconSize + 6;
      if (top + POPUP_H > TRACK_HEIGHT) top = iconTop - POPUP_H - 6; // flip above
      if (top < 4) top = 4;
    }
    return { left, top, width: popupW };
  };

  return (
    <div className="vtl-wrapper">
      {/* ── Toolbar ── */}
      <div className="vtl-toolbar">
        <div className="vtl-legend">
          {Object.entries(EVENT_CONFIG).map(([type, cfg]) => (
            type.includes('inspection') || type.includes('inspection_expired') || type.includes('soat') || type.includes('soat_expired') ? '' :
              <span key={type} className="vtl-legend__item">
                <EventIcon type={type} size={14} />
                <span style={{ color: cfg.color }}>{cfg.label}</span>
              </span>
          ))}
          <span key={'inspection_expired'} className="vtl-legend__item">
            <EventIcon type={'inspection_expired'} size={14} />
            <EventIcon type={'inspection'} size={14} />
            <span style={{ color: EVENT_CONFIG['inspection'].color }}>{EVENT_CONFIG['inspection'].label}</span>
          </span>
          <span key={'soat_expired'} className="vtl-legend__item">
            <EventIcon type={'soat_expired'} size={14} />
            <EventIcon type={'soat'} size={14} />
            <span style={{ color: EVENT_CONFIG['soat'].color }}>{EVENT_CONFIG['soat'].label}</span>
          </span>
        </div>
        <div className="vtl-controls">
          <label className="vtl-filter-label">
            <input type="radio" name="vtl-filter" checked={filter === 'all'} onChange={() => setFilter('all')} />
            Todo
          </label>
          <label className="vtl-filter-label">
            <input type="radio" name="vtl-filter" checked={filter === 'critical'} onChange={() => setFilter('critical')} />
            Solo críticos
          </label>
          <button className="vtl-reset-btn" onClick={resetZoom} title="Restablecer zoom">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M3.51 9a9 9 0 1 1-.29 4.5"/><polyline points="1 4 3.51 9 9 6.5"/>
            </svg>
            Reset
          </button>
        </div>
      </div>

      <p className="vtl-hint">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Arrastra para hacer zoom · Doble clic para restablecer · Toca para más info
      </p>

      {/* ── Track ── */}
      <div
        ref={containerRef}
        className="vtl-track"
        style={{ height: TRACK_HEIGHT }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={resetZoom}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setSelectedEventId(null)}
      >
        {/* Axis ticks */}
        {axisTicks.map((tick, i) => {
          const x = (tick - viewRange.start) / rangeMs;
          if (x < 0 || x > 1) return null;
          return (
            <div key={i} className="vtl-tick" style={{ left: `${x * 100}%`, top: LINE_Y }}>
              <div className="vtl-tick__mark" />
              <span className="vtl-tick__label">{formatTick(tick, rangeYears)}</span>
            </div>
          );
        })}

        {/* Timeline bar */}
        <div className="vtl-line" style={{ top: LINE_Y }} />

        {/* Today marker */}
        {todayX >= 0 && todayX <= 1 && (
          <div className="vtl-today" style={{ left: `${todayX * 100}%` }}>
            <div className="vtl-today__line" style={{ top: 0, height: TRACK_HEIGHT }} />
            <span className="vtl-today__label" style={{ top: LINE_Y }}>Hoy</span>
          </div>
        )}

        {/* Events */}
        {layoutedEvents.map(ev => {
          const cfg = EVENT_CONFIG[ev.type] || EVENT_CONFIG.registration;
          const iconSize = ev.type === 'accident' ? 28 : 22;
          const yOffset = CONNECTOR_BASE + ev.level * LEVEL_STEP;
          const iconTop = ev.above
            ? LINE_Y - yOffset - iconSize
            : LINE_Y + yOffset;
          const connTop = ev.above ? iconTop + iconSize : LINE_Y + 2;
          const connH = Math.max(0, ev.above ? LINE_Y - iconTop - iconSize : iconTop - LINE_Y - 2);
          const isSelected = ev.id === selectedEventId;

          return (
            <div key={ev.id} style={{ position: 'absolute', left: `${ev.x * 100}%`, top: 0 }}>
              {/* Connector */}
              <div className="vtl-connector" style={{
                top: connTop,
                height: connH,
                background: ev.color ?? cfg.color,
                left: '50%',
                transform: 'translateX(-50%)',
              }} />
              {/* Icon */}
              <div
                className={`vtl-node ${isSelected ? 'vtl-node--selected' : ''}`}
                style={{ top: iconTop, '--node-color': ev.color ?? cfg.color }}
                onClick={e => handleEventClick(e, ev.id)}
                role="button"
                tabIndex={0}
                aria-label={ev.title}
                onKeyDown={e => e.key === 'Enter' && handleEventClick(e, ev.id)}
              >
                <EventIcon type={ev.type} size={iconSize} color={ev.color} />
              </div>
            </div>
          );
        })}

        {/* Popup — rendered at track level for correct absolute positioning */}
        {selectedEvent && (() => {
          const pos = getPopupPos(selectedEvent);
          const cfg = EVENT_CONFIG[selectedEvent.type] || EVENT_CONFIG.registration;
          return (
            <div
              className="vtl-popup"
              style={{ left: pos.left, top: pos.top, width: pos.width }}
              onClick={e => e.stopPropagation()}
            >
              <div className="vtl-popup__header" style={{ borderColor: selectedEvent.color ?? cfg.color }}>
                <EventIcon type={selectedEvent.type} size={16} color={selectedEvent.color} />
                <span className="vtl-popup__title">{selectedEvent.title}</span>
                <button className="vtl-popup__close" onClick={() => setSelectedEventId(null)} aria-label="Cerrar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="vtl-popup__body">
                {Object.entries(selectedEvent.details).map(([k, v]) => (
                  <div key={k} className="vtl-popup__row">
                    <span className="vtl-popup__key">{k}</span>
                    <span className="vtl-popup__val">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Drag selection box */}
        {dragBox && (
          <div className="vtl-selection" style={{
            left: dragBox.left, width: dragBox.width, top: 0, height: '100%',
          }} />
        )}
      </div>
    </div>
  );
};

VehicleTimeline.propTypes = {
  sunarpData:     PropTypes.array,
  apesegSoatData: PropTypes.array,
  inspectionData: PropTypes.array,
  insuranceData:  PropTypes.object,
};

export default VehicleTimeline;
