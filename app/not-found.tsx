export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-white text-lg">Album not found</p>
        <a
          href="/"
          className="mt-6 inline-block bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
