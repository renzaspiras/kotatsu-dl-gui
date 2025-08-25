export interface IElectronAPI {
  openDirectory: () => Promise<string | null>
  saveFile: (defaultPath: string) => Promise<string | null>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}