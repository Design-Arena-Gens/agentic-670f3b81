import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import kv from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const albumId = nanoid(10)
    const pages: string[] = []

    // Process each file
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())

      // Convert to base64 data URL for demo (in production, upload to blob storage)
      const base64 = buffer.toString('base64')
      const mimeType = file.type || 'image/jpeg'
      const dataUrl = `data:${mimeType};base64,${base64}`

      pages.push(dataUrl)
    }

    // Store album metadata
    const album = {
      id: albumId,
      title: `Album ${albumId}`,
      pages,
      metadata: {
        pageCount: pages.length,
        createdAt: new Date().toISOString(),
      },
    }

    await kv.set(`album:${albumId}`, album)

    return NextResponse.json({ albumId })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
