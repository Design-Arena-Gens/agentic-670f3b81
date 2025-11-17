'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const { albumId } = await response.json()
      router.push(`/album/${albumId}`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Digital Album QR
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Create stunning photo albums with QR code access
        </p>

        <div className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-500 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.zip"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
          >
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-lg text-gray-700 mb-2">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </p>
            <p className="text-sm text-gray-500">
              Images (JPG, PNG, HEIC), PDF, or ZIP files
            </p>
          </label>

          {uploading && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">Processing...</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl mb-2">📱</div>
            <p className="text-sm text-gray-600">Mobile Optimized</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📖</div>
            <p className="text-sm text-gray-600">Realistic Page Flips</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔗</div>
            <p className="text-sm text-gray-600">QR Code Access</p>
          </div>
        </div>
      </div>
    </main>
  )
}
