'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Album {
  id: string
  title: string
  pages: string[]
  metadata: {
    pageCount: number
    createdAt: string
  }
}

export default function AlbumViewer({ album }: { album: Album }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward')
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const totalPages = album.pages.length
  const showDoublePage = currentPage > 0 && currentPage < totalPages - 1

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection('forward')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1)
        setIsFlipping(false)
      }, 600)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('backward')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1)
        setIsFlipping(false)
      }, 600)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        handleNextPage()
      } else {
        handlePrevPage()
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextPage()
      if (e.key === 'ArrowLeft') handlePrevPage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, isFlipping])

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Book Container */}
      <div
        className="relative perspective-1000"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg shadow-2xl p-8 min-h-[600px]">
          {/* Book Spine Shadow */}
          <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-black/20 via-black/10 to-transparent pointer-events-none" />

          {/* Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Left Page */}
            {showDoublePage && currentPage > 0 && (
              <div
                className={`relative bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-600 ${
                  isFlipping && flipDirection === 'backward'
                    ? 'animate-flip-left'
                    : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="relative w-full h-[600px]">
                  <Image
                    src={album.pages[currentPage - 1]}
                    alt={`Page ${currentPage}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500 text-sm">
                  {currentPage}
                </div>
              </div>
            )}

            {/* Right Page */}
            <div
              className={`relative bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-600 ${
                isFlipping && flipDirection === 'forward'
                  ? 'animate-flip-right'
                  : ''
              } ${!showDoublePage ? 'md:col-span-2' : ''}`}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative w-full h-[600px]">
                <Image
                  src={album.pages[currentPage]}
                  alt={`Page ${currentPage + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500 text-sm">
                {currentPage + 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 || isFlipping}
          className="bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
        >
          ← Previous
        </button>

        <div className="text-white text-lg font-medium">
          Page {currentPage + 1} of {totalPages}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1 || isFlipping}
          className="bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
