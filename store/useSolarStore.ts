import { create } from 'zustand';

interface SolarState {
    latitude: number;
    longitude: number; // New Longitude
    declination: number;
    hourAngle: number;
    // Lab Mode State
    labMode: 'physics' | 'panel';
    panelTilt: number; // 0 to 90
    panelAzimuth: number; // 0 to 360
    isLocked: boolean;
    // Info State
    activeInfo: string | null; // For modal descriptions
    showSunPath: boolean;
    setLatitude: (lat: number) => void;
    setLongitude: (lon: number) => void;
    setDeclination: (dec: number) => void;
    setHourAngle: (ha: number) => void;
    setLabMode: (mode: 'physics' | 'panel') => void;
    setPanelTilt: (angle: number) => void;
    setPanelAzimuth: (angle: number) => void;
    setIsLocked: (locked: boolean) => void;
    setActiveInfo: (info: string | null) => void;
    setShowSunPath: (show: boolean) => void;
}

export const useSolarStore = create<SolarState>((set) => ({
    latitude: 45,
    longitude: 0,
    declination: 23,
    hourAngle: 0,
    labMode: 'physics',
    panelTilt: 30, // Default optimal-ish for many latitudes
    panelAzimuth: 180, // Facing South default
    isLocked: false,
    activeInfo: null,
    showSunPath: false,
    setLatitude: (lat) => set({ latitude: lat }),
    setLongitude: (lon) => set({ longitude: lon }),
    setDeclination: (dec) => set({ declination: dec }),
    setHourAngle: (ha) => set({ hourAngle: ha }),
    setLabMode: (mode) => set({ labMode: mode }),
    setPanelTilt: (t) => set({ panelTilt: t }),
    setPanelAzimuth: (a) => set({ panelAzimuth: a }),
    setIsLocked: (locked) => set({ isLocked: locked }),
    setActiveInfo: (info) => set({ activeInfo: info }),
    setShowSunPath: (show) => set({ showSunPath: show }),
}));
