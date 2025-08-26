import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Download, Pause, X, CheckCircle, AlertCircle, Play } from 'lucide-react'
import { useDownloadStore } from '@/stores/downloads'

export default function DownloadsPage() {
  const { tasks, removeTask, pauseTask, resumeTask, clearCompleted, activeDownloads } = useDownloadStore()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'downloading':
      case 'processing':
        return <Download className="h-5 w-5 text-blue-500 animate-bounce" />
      default:
        return <Download className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'downloading':
      case 'processing':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const isActive = (taskId: string) => activeDownloads.has(taskId)

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Downloads</h1>
          {tasks.some(t => t.progress.status === 'complete' || t.progress.status === 'error') && (
            <Button variant="outline" onClick={clearCompleted}>
              Clear Completed
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Downloads</h3>
            <p className="text-muted-foreground">
              Start downloading manga from the browse page to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.progress.status)}
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>
                          {task.progress.status === 'downloading' && 'Downloading chapters...'}
                          {task.progress.status === 'processing' && 'Creating CBZ file...'}
                          {task.progress.status === 'complete' && `Completed at ${task.endTime?.toLocaleTimeString()}`}
                          {task.progress.status === 'error' && `Error: ${task.progress.error}`}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {task.progress.status === 'downloading' || task.progress.status === 'processing' ? (
                        <>
                          {isActive(task.id) ? (
                            <Button variant="outline" size="sm" onClick={() => pauseTask(task.id)}>
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => resumeTask(task.id)}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      ) : null}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={getStatusColor(task.progress.status)}>
                        {task.progress.status === 'downloading' && `${task.progress.current}/${task.progress.total} pages`}
                        {task.progress.status === 'processing' && 'Creating archive...'}
                        {task.progress.status === 'complete' && 'Download complete'}
                        {task.progress.status === 'error' && 'Download failed'}
                      </span>
                      <span className="text-muted-foreground">
                        {task.progress.percentage}%
                      </span>
                    </div>
                    
                    <Progress 
                      value={task.progress.percentage} 
                      className="h-2"
                    />
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Started: {task.startTime.toLocaleTimeString()}</span>
                      <span>{task.outputPath}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}