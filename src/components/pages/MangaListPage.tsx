import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, ExternalLink } from 'lucide-react'

// Mock data for development
const mockManga = [
  {
    id: 1,
    title: "One Piece",
    description: "The adventures of Monkey D. Luffy and his Straw Hat Pirates",
    coverUrl: "https://via.placeholder.com/150x200?text=One+Piece",
    chapters: 1089,
    status: "Ongoing"
  },
  {
    id: 2,
    title: "Naruto",
    description: "The story of Naruto Uzumaki, a young ninja",
    coverUrl: "https://via.placeholder.com/150x200?text=Naruto",
    chapters: 700,
    status: "Completed"
  },
  {
    id: 3,
    title: "Attack on Titan",
    description: "Humanity's fight against giant humanoid Titans",
    coverUrl: "https://via.placeholder.com/150x200?text=AOT",
    chapters: 139,
    status: "Completed"
  }
]

export default function MangaListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    setIsSearching(true)
    // TODO: Implement manga search logic
    setTimeout(() => {
      setIsSearching(false)
    }, 1000)
  }

  const handleDownload = (manga: any) => {
    // TODO: Implement download logic
    console.log('Downloading:', manga.title)
  }

  const filteredManga = mockManga.filter(manga =>
    manga.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold mb-4">Manga Library</h1>
        
        <div className="flex gap-2 max-w-md">
          <Input
            placeholder="Search manga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            size="icon"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredManga.map((manga) => (
            <Card key={manga.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="aspect-[3/4] bg-muted rounded-md mb-3 overflow-hidden">
                  <img
                    src={manga.coverUrl}
                    alt={manga.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-lg line-clamp-1">{manga.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {manga.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{manga.chapters} chapters</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    manga.status === 'Ongoing' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {manga.status}
                  </span>
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
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredManga.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No manga found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search query or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}