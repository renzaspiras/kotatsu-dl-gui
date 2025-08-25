import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Download, Pause, X, CheckCircle, AlertCircle } from 'lucide-react'

// Mock download data
const mockDownloads = [
  {
    id: 1,
    title: "One Piece - Chapter 1089",
    progress: 75,
    status: 'downloading',
    speed: '2.5 MB/s',
    size: '45.2 MB'
  },
  {
    id: 2,
    title: "Naruto - Complete Series",
    progress: 100,
    status: 'completed',
    speed: '',
    size: '1.2 GB'
  },
  {
    id: 3,
    title: "Attack on Titan - Chapter 139",
    progress: 0,
    status: 'error',
    speed: '',
    size: '12.5 MB',
    error: 'Failed to download: Source unavailable'
  }
]

export default function DownloadsPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'downloading':
        return <Download className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Download className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloading':
        return 'text-blue-600 dark:text-blue-400'
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold mb-2">Downloads</h1>
        <p className="text-muted-foreground">Manage your manga downloads</p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-4">
          {mockDownloads.map((download) => (
            <Card key={download.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(download.status)}
                    <CardTitle className="text-lg">{download.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    {download.status === 'downloading' && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {download.status === 'downloading' && (
                    <div className="space-y-2">
                      <Progress value={download.progress} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{download.progress}%</span>
                        <span>{download.speed}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getStatusColor(download.status)}`}>
                      {download.status.charAt(0).toUpperCase() + download.status.slice(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">{download.size}</span>
                  </div>
                  
                  {download.status === 'error' && download.error && (
                    <CardDescription className="text-red-600 dark:text-red-400">
                      {download.error}
                    </CardDescription>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockDownloads.length === 0 && (
          <div className="text-center py-12">
            <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No downloads</h3>
            <p className="text-muted-foreground">
              Start downloading manga from the library.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}