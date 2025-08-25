import { create } from 'zustand'
import { DownloadProgress } from '@/lib/downloader'

export interface DownloadTask {
  id: string
  title: string
  mangaId: string
  chapterIds: string[]
  outputPath: string
  progress: DownloadProgress
  startTime: Date
  endTime?: Date
}

interface DownloadStore {
  tasks: DownloadTask[]
  activeDownloads: Set<string>
  addTask: (task: Omit<DownloadTask, 'id' | 'startTime'>) => string
  updateTaskProgress: (taskId: string, progress: DownloadProgress) => void
  removeTask: (taskId: string) => void
  pauseTask: (taskId: string) => void
  resumeTask: (taskId: string) => void
  clearCompleted: () => void
}

export const useDownloadStore = create<DownloadStore>((set, get) => ({
  tasks: [],
  activeDownloads: new Set(),
  
  addTask: (taskData) => {
    const id = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const task: DownloadTask = {
      ...taskData,
      id,
      startTime: new Date()
    }
    
    set((state) => ({
      tasks: [...state.tasks, task],
      activeDownloads: new Set([...state.activeDownloads, id])
    }))
    
    return id
  },
  
  updateTaskProgress: (taskId, progress) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              progress,
              endTime: progress.status === 'complete' || progress.status === 'error'
                ? new Date()
                : task.endTime
            }
          : task
      )
    }))
    
    // Remove from active downloads if completed or errored
    if (progress.status === 'complete' || progress.status === 'error') {
      set((state) => {
        const newActiveDownloads = new Set(state.activeDownloads)
        newActiveDownloads.delete(taskId)
        return { activeDownloads: newActiveDownloads }
      })
    }
  },
  
  removeTask: (taskId) => {
    set((state) => {
      const newActiveDownloads = new Set(state.activeDownloads)
      newActiveDownloads.delete(taskId)
      return {
        tasks: state.tasks.filter((task) => task.id !== taskId),
        activeDownloads: newActiveDownloads
      }
    })
  },
  
  pauseTask: (taskId) => {
    set((state) => {
      const newActiveDownloads = new Set(state.activeDownloads)
      newActiveDownloads.delete(taskId)
      return { activeDownloads: newActiveDownloads }
    })
  },
  
  resumeTask: (taskId) => {
    set((state) => ({
      activeDownloads: new Set([...state.activeDownloads, taskId])
    }))
  },
  
  clearCompleted: () => {
    set((state) => ({
      tasks: state.tasks.filter(
        (task) => task.progress.status !== 'complete' && task.progress.status !== 'error'
      )
    }))
  }
}))