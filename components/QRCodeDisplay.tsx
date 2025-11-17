'use client'

import { useEffect, useState } from 'react'

export default function QRCodeDisplay({ url, albumId }: { url: string; albumId: string }) {
  const [qrCode, setQrCode] = useState<string>('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const generateQR = async () => {
      const QRCode = (await import('qrcode')).default
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
      setQrCode(qrDataUrl)
    }
    generateQR()
  }, [url])

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
        Show QR Code
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Scan to View Album
            </h2>
            {qrCode && (
              <div className="flex flex-col items-center">
                <img src={qrCode} alt="QR Code" className="mb-4 rounded-lg" />
                <p className="text-sm text-gray-600 text-center mb-4">
                  Scan this QR code with your phone camera to open the album
                </p>
                <div className="bg-gray-100 px-4 py-2 rounded-lg text-xs text-gray-700 break-all mb-4">
                  {url}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(url)
                    alert('Link copied to clipboard!')
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
                >
                  Copy Link
                </button>
              </div>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
