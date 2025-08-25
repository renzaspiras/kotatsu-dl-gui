import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface AppConfig {
  // Download settings
  downloadDirectory: string
  concurrentDownloads: number
  createCBZ: boolean
  autoRetry: boolean
  
  // Interface settings
  theme: 'light' | 'dark' | 'system'
  minimizeToTray: boolean
  gridColumns: number
  
  // Advanced settings
  userAgent: string
  requestTimeout: number
  enableDebugLogging: boolean
  
  // Window settings
  windowWidth: number
  windowHeight: number
  sidebarCollapsed: boolean
}

const defaultConfig: AppConfig = {
  downloadDirectory: '',
  concurrentDownloads: 3,
  createCBZ: true,
  autoRetry: true,
  theme: 'system',
  minimizeToTray: false,
  gridColumns: 4,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  requestTimeout: 30,
  enableDebugLogging: false,
  windowWidth: 1200,
  windowHeight: 800,
  sidebarCollapsed: false
}

interface ConfigStore {
  config: AppConfig
  updateConfig: (updates: Partial<AppConfig>) => void
  resetConfig: () => void
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      updateConfig: (updates) =>
        set((state) => ({
          config: { ...state.config, ...updates }
        })),
      resetConfig: () =>
        set({ config: defaultConfig })
    }),
    {
      name: 'kotatsu-config',
      storage: createJSONStorage(() => localStorage)
    }
  )
)