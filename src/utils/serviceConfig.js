export const CONFIG_KEY = 'autocheck_service_config';

export const DEFAULT_SERVICE_CONFIG = {
  vehicleInfo: true,
  inspection: true,
  insurance: true,
  sunarp: true,
  soatApeseg: true,
};

export const readServiceConfig = () => {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (!stored) return { ...DEFAULT_SERVICE_CONFIG };
    return { ...DEFAULT_SERVICE_CONFIG, ...JSON.parse(stored) };
  } catch {
    return { ...DEFAULT_SERVICE_CONFIG };
  }
};

export const writeServiceConfig = (config) => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    // silently fail
  }
};
