# Kotatsu DL - Node.js Edition

A complete rewrite of the manga downloader in Node.js with modern technologies, featuring a sleek Electron-based desktop interface.

## 🚀 Features

- **Modern Tech Stack**: Built with React, TypeScript, Electron, and Tailwind CSS
- **Multiple Sources**: Extensible manga source parser system
- **CBZ Support**: Download and package manga as CBZ archives
- **Responsive UI**: Material Design 3 inspired interface with dark/light themes
- **Progress Tracking**: Real-time download progress with detailed status
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **State Management**: Zustand for efficient state handling
- **File Operations**: Advanced file system operations with JSZip

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components
- **Lucide React** icons
- **React Router** for navigation
- **Zustand** for state management

### Backend
- **Electron** for desktop app framework
- **Node.js** runtime
- **Axios** for HTTP requests
- **Cheerio** for HTML parsing
- **JSZip** for CBZ creation
- **fs-extra** for file operations

### Build Tools
- **Vite** for fast development and building
- **TypeScript** for type safety
- **ESLint** for code linting
- **Electron Builder** for packaging

## 📁 Project Structure

```
kotatsu-dl-gui/
├── electron/                 # Electron main process
│   ├── main.ts              # Main process entry
│   └── preload.ts           # Preload script
├── src/                     # React application
│   ├── components/          # UI components
│   │   ├── ui/             # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   └── pages/          # Page components
│   ├── lib/                # Core logic
│   │   ├── downloader.ts   # Download management
│   │   └── manga-parser.ts # Source parsers
│   ├── stores/             # State management
│   │   ├── config.ts       # App configuration
│   │   ├── downloads.ts    # Download state
│   │   └── manga.ts        # Manga data state
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
└── packaging/              # Build assets
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/renzaspiras/kotatsu-dl-gui.git
cd kotatsu-dl-gui

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Build for production
npm run build

# Package for distribution
npm run dist
```

## 📦 Building for Production

### All Platforms
```bash
npm run dist
```

### Specific Platforms
```bash
# Windows
npm run dist:win

# macOS  
npm run dist:mac

# Linux
npm run dist:linux
```

## 🎯 Core Features

### Download Management
- **Concurrent Downloads**: Configurable parallel download limit
- **Progress Tracking**: Real-time progress with speed and ETA
- **Auto-retry**: Automatic retry for failed downloads
- **CBZ Packaging**: Create comic book archives

### Manga Sources
- **Extensible Parser System**: Easy to add new manga sources
- **Multi-source Search**: Search across all configured sources
- **Chapter Management**: Download individual chapters or entire series

### User Interface
- **Modern Design**: Material 3 inspired components
- **Responsive Layout**: Adapts to different window sizes
- **Theme Support**: Light, dark, and system themes
- **Keyboard Shortcuts**: Efficient navigation

### Configuration
- **Persistent Settings**: Auto-saved user preferences
- **Download Paths**: Customizable download directories
- **UI Preferences**: Grid layout and theme options
- **Advanced Options**: User agent, timeouts, debug logging

## 🔌 Extending Sources

Add new manga sources by implementing the `BaseMangaParser` interface:

```typescript
export class CustomMangaParser extends BaseMangaParser {
  async search(query: string): Promise<MangaSearchResult[]> {
    // Implementation
  }

  async getMangaDetails(mangaId: string): Promise<MangaDetails> {
    // Implementation  
  }

  async getChapterPages(chapterId: string): Promise<string[]> {
    // Implementation
  }
}
```

## 🛡️ Security

- **Content Security Policy**: Strict CSP for secure execution
- **Context Isolation**: Electron security best practices
- **No Node Integration**: Secure renderer process
- **Preload Scripts**: Safe API exposure

## 📋 API Documentation

### Download API
- `ChapterDownloader`: Core downloading functionality
- `CBZCreator`: Archive creation utilities
- `DownloadProgress`: Progress tracking interface

### Parser API
- `BaseMangaParser`: Abstract parser base class
- `MangaSourceRegistry`: Source management
- `MangaSearchResult`: Search result interface

### State Management
- `useConfigStore`: Application configuration
- `useDownloadStore`: Download management
- `useMangaStore`: Manga data and search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Kotatsu project for inspiration
- React and Electron communities
- All manga source providers
- Contributors and users

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/renzaspiras/kotatsu-dl-gui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/renzaspiras/kotatsu-dl-gui/discussions)

---

**Note**: This is a complete rewrite in Node.js/TypeScript. The original Kotlin version functionality has been fully ported with modern improvements.