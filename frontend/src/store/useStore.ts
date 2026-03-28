import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  offlineMode: boolean;
  downloadPath: string;
  setOfflineMode: (offline: boolean) => void;
  setDownloadPath: (path: string) => void;
}

export const useStore = create<SettingsState>()(
  persist(
    (set) => ({
      offlineMode: false,
      downloadPath: 'E:\\VRGames',
      setOfflineMode: (offlineMode) => set({ offlineMode }),
      setDownloadPath: (downloadPath) => set({ downloadPath }),
    }),
    {
      name: 'vr-settings',
    }
  )
);
