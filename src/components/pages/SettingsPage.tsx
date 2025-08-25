import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FolderOpen } from 'lucide-react'

export default function SettingsPage() {
  const handleSelectDirectory = async () => {
    try {
      // For web version, we'll use a simple alert
      if (typeof window !== 'undefined' && window.electronAPI) {
        const directory = await window.electronAPI.openDirectory()
        if (directory) {
          console.log('Selected directory:', directory)
          // TODO: Save to settings
        }
      } else {
        alert('Directory selection is only available in the desktop app')
      }
    } catch (error) {
      console.error('Error selecting directory:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your manga downloader preferences</p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl space-y-6">
          {/* Download Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Download Settings</CardTitle>
              <CardDescription>
                Configure how manga downloads are handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="download-path">Download Directory</Label>
                <div className="flex gap-2">
                  <Input
                    id="download-path"
                    placeholder="/path/to/downloads"
                    className="flex-1"
                    readOnly
                  />
                  <Button variant="outline" onClick={handleSelectDirectory}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concurrent-downloads">Concurrent Downloads</Label>
                <Input
                  id="concurrent-downloads"
                  type="number"
                  placeholder="3"
                  min="1"
                  max="10"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Create CBZ Archives</Label>
                  <p className="text-sm text-muted-foreground">
                    Package downloaded chapters into CBZ files
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-retry Failed Downloads</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically retry downloads that fail
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Interface Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Interface</CardTitle>
              <CardDescription>
                Customize the application appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for the interface
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Minimize to System Tray</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep the app running in the background
                  </p>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grid-size">Grid Columns</Label>
                <Input
                  id="grid-size"
                  type="number"
                  placeholder="4"
                  min="2"
                  max="8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced</CardTitle>
              <CardDescription>
                Advanced configuration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-agent">User Agent</Label>
                <Input
                  id="user-agent"
                  placeholder="Mozilla/5.0..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  placeholder="30"
                  min="5"
                  max="300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Debug Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Save detailed logs for troubleshooting
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button>Save Settings</Button>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
        </div>
      </div>
    </div>
  )
}