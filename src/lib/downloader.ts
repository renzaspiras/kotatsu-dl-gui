import JSZip from 'jszip'
import fs from 'fs-extra'
import path from 'path'
import axios from 'axios'

export interface Chapter {
  id: string
  title: string
  pages: string[]
}

export interface DownloadProgress {
  current: number
  total: number
  percentage: number
  status: 'downloading' | 'processing' | 'complete' | 'error'
  error?: string
}

export class CBZCreator {
  private zip: JSZip
  
  constructor() {
    this.zip = new JSZip()
  }

  async addImageFromUrl(url: string, filename: string): Promise<void> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      this.zip.file(filename, response.data)
    } catch (error) {
      throw new Error(`Failed to download image ${filename}: ${error}`)
    }
  }

  async addImageFromBuffer(buffer: Buffer, filename: string): Promise<void> {
    this.zip.file(filename, buffer)
  }

  async generateCBZ(outputPath: string): Promise<void> {
    try {
      const content = await this.zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      })
      
      await fs.ensureDir(path.dirname(outputPath))
      await fs.writeFile(outputPath, content)
    } catch (error) {
      throw new Error(`Failed to create CBZ file: ${error}`)
    }
  }

  clear(): void {
    this.zip = new JSZip()
  }
}

export class ChapterDownloader {
  private onProgress?: (progress: DownloadProgress) => void
  
  constructor(onProgress?: (progress: DownloadProgress) => void) {
    this.onProgress = onProgress
  }

  async downloadChapter(
    chapter: Chapter,
    outputPath: string,
    format: 'cbz' | 'folder' = 'cbz'
  ): Promise<void> {
    const totalPages = chapter.pages.length
    let downloadedPages = 0

    this.updateProgress({
      current: 0,
      total: totalPages,
      percentage: 0,
      status: 'downloading'
    })

    try {
      if (format === 'cbz') {
        await this.downloadAsCBZ(chapter, outputPath, (current) => {
          downloadedPages = current
          this.updateProgress({
            current: downloadedPages,
            total: totalPages,
            percentage: Math.round((downloadedPages / totalPages) * 100),
            status: downloadedPages === totalPages ? 'processing' : 'downloading'
          })
        })
      } else {
        await this.downloadAsFolder(chapter, outputPath, (current) => {
          downloadedPages = current
          this.updateProgress({
            current: downloadedPages,
            total: totalPages,
            percentage: Math.round((downloadedPages / totalPages) * 100),
            status: 'downloading'
          })
        })
      }

      this.updateProgress({
        current: totalPages,
        total: totalPages,
        percentage: 100,
        status: 'complete'
      })
    } catch (error) {
      this.updateProgress({
        current: downloadedPages,
        total: totalPages,
        percentage: Math.round((downloadedPages / totalPages) * 100),
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  private async downloadAsCBZ(
    chapter: Chapter,
    outputPath: string,
    onPageDownload: (current: number) => void
  ): Promise<void> {
    const cbz = new CBZCreator()
    let downloadedCount = 0

    // Download pages in parallel with concurrency limit
    const concurrency = 3
    const chunks = this.chunkArray(chapter.pages, concurrency)

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (pageUrl, index) => {
          const pageNumber = downloadedCount + index + 1
          const filename = `${pageNumber.toString().padStart(3, '0')}.jpg`
          
          await cbz.addImageFromUrl(pageUrl, filename)
        })
      )
      
      downloadedCount += chunk.length
      onPageDownload(downloadedCount)
    }

    await cbz.generateCBZ(outputPath)
  }

  private async downloadAsFolder(
    chapter: Chapter,
    outputPath: string,
    onPageDownload: (current: number) => void
  ): Promise<void> {
    await fs.ensureDir(outputPath)
    let downloadedCount = 0

    // Download pages in parallel with concurrency limit
    const concurrency = 3
    const chunks = this.chunkArray(chapter.pages, concurrency)

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (pageUrl, index) => {
          const pageNumber = downloadedCount + index + 1
          const filename = `${pageNumber.toString().padStart(3, '0')}.jpg`
          const filePath = path.join(outputPath, filename)
          
          const response = await axios.get(pageUrl, {
            responseType: 'stream',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          })
          
          const writer = fs.createWriteStream(filePath)
          response.data.pipe(writer)
          
          return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })
        })
      )
      
      downloadedCount += chunk.length
      onPageDownload(downloadedCount)
    }
  }

  private updateProgress(progress: DownloadProgress): void {
    if (this.onProgress) {
      this.onProgress(progress)
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
}