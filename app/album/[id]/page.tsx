import { notFound } from 'next/navigation'
import AlbumViewer from '@/components/AlbumViewer'
import QRCodeDisplay from '@/components/QRCodeDisplay'

async function getAlbum(id: string) {
  const kv = await import('@/lib/kv').then(m => m.default)
  const album = await kv.get(`album:${id}`)
  return album
}

export default async function AlbumPage({ params }: { params: { id: string } }) {
  const album = await getAlbum(params.id)

  if (!album) {
    notFound()
  }

  const albumUrl = `https://agentic-670f3b81.vercel.app/album/${params.id}`

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">{album.title}</h1>
          <QRCodeDisplay url={albumUrl} albumId={params.id} />
        </div>
        <AlbumViewer album={album} />
      </div>
    </main>
  )
}
