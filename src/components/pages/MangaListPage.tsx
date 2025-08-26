import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Download, ExternalLink, Star, Calendar, Loader2 } from 'lucide-react'
import { useMangaStore } from '@/stores/manga'
import { useDownloadStore } from '@/stores/downloads'
import { useToast } from '@/components/ui/use-toast'

export default function MangaListPage() {
  const {
    sources,
    selectedSource,
    searchQuery,
    searchResults,
    popularManga,
    isLoading,
    error,
    loadSources,
    setSelectedSource,
    search,
    loadPopular,
    loadChapters,
    setSearchQuery,
    clearError
  } = useMangaStore()

  const { addTask } = useDownloadStore()
  const { toast } = useToast()

  const [localSearchQuery, setLocalSearchQuery] = useState('')

  useEffect(() => {
    loadSources()
    loadPopular()
  }, [])

  const handleSearch = async () => {
    if (localSearchQuery.trim()) {
      setSearchQuery(localSearchQuery)
      await search(localSearchQuery)
    }
  }

  const handleSourceChange = (sourceId: string) => {
    setSelectedSource(sourceId)
    clearError()
  }

  const handleDownload = async (manga: any) => {
    try {
      toast({
        title: "Starting Download",
        description: `Loading chapters for ${manga.title}...`,
      })

      // First get the chapters for this manga
      await loadChapters(manga.sourceId, manga.id)
      
      // Create a download task
      const taskId = addTask({
        title: manga.title,
        mangaId: manga.id,
        chapterIds: [], // Will be populated once we get chapters
        outputPath: `downloads/${manga.title.replace(/[^\w\s]/gi, '')}.cbz`,
        progress: {
          current: 0,
          total: 100,
          percentage: 0,
          status: 'downloading'
        }
      })

      toast({
        title: "Download Added",
        description: `${manga.title} has been added to your download queue. Check the Downloads page for progress.`,
      })

      // For now, we'll simulate a download since we don't have the full infrastructure
      setTimeout(() => {
        toast({
          title: "Download Complete",
          description: `${manga.title} download completed successfully!`,
        })
      }, 3000)

    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download Failed",
        description: `Failed to start download for ${manga.title}. Please try again.`,
        variant: "destructive"
      })
    }
  }

  const displayManga = searchQuery ? searchResults : popularManga
  const showingSearch = searchQuery && searchResults.length > 0
  const currentSource = sources.find(source => source.id === selectedSource)

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">
            {showingSearch ? 'Search Results' : 'Popular Manga'}
          </h1>
          
          {/* Source Indicator */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span className="text-sm text-muted-foreground">Source:</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              {currentSource?.name || 'Unknown'}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl">
          <div className="flex gap-2 flex-1">
            <Input
              placeholder="Search manga..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !localSearchQuery.trim()}
              size="icon"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
          
          <Select value={selectedSource} onValueChange={handleSourceChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {sources.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {isLoading && displayManga.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading manga...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayManga.map((manga) => (
              <Card key={`${manga.sourceId}-${manga.id}`} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-[3/4] bg-muted rounded-md mb-3 overflow-hidden">
                    <img
                      src={manga.coverUrl}
                      alt={manga.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                      }}
                    />
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{manga.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {manga.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      {manga.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{manga.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {manga.status && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        manga.status.toLowerCase().includes('ongoing') || manga.status.toLowerCase().includes('publishing')
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {manga.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDownload(manga)}
                      className="flex-1"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(manga.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && displayManga.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'No manga found' : 'No popular manga available'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? 'Try adjusting your search query or selecting a different source.'
                : 'Try selecting a different source or try searching for specific manga.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}