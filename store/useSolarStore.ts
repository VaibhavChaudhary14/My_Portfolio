import { create } from 'zustand';

interface SolarState {
    latitude: number;
    declination: number;
    hourAngle: number;
    // Lab Mode State
    labMode: 'physics' | 'panel';
    panelTilt: number; // 0 to 90
    panelAzimuth: number; // 0 to 360
    isLocked: boolean; // New Locked State
    setLatitude: (lat: number) => void;
    setDeclination: (dec: number) => void;
    setHourAngle: (ha: number) => void;
    setLabMode: (mode: 'physics' | 'panel') => void;
    setPanelTilt: (angle: number) => void;
    setPanelAzimuth: (angle: number) => void;
    setIsLocked: (locked: boolean) => void;
}

export const useSolarStore = create<SolarState>((set) => ({
    latitude: 45,
    declination: 23,
    hourAngle: 0,
    labMode: 'physics',
    panelTilt: 30, // Default optimal-ish for many latitudes
    panelAzimuth: 180, // Facing South default
    isLocked: false,
    setLatitude: (lat) => set({ latitude: lat }),
    setDeclination: (dec) => set({ declination: dec }),
    setHourAngle: (ha) => set({ hourAngle: ha }),
    setLabMode: (mode) => set({ labMode: mode }),
    setPanelTilt: (t) => set({ panelTilt: t }),
    setPanelAzimuth: (a) => set({ panelAzimuth: a }),
    setIsLocked: (locked) => set({ isLocked: locked }),
}));
