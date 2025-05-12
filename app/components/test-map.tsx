"use client"

import { useState } from "react"

export default function TestMap() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLoad = () => {
    console.log("Image loaded successfully")
    setLoaded(true)
  }

  const handleError = () => {
    console.error("Failed to load image")
    setError("Failed to load image")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Map Test</h1>

      <div className="relative w-full max-w-2xl h-96 bg-neutral-800 rounded-lg overflow-hidden">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
            <p className="ml-3">Loading image...</p>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
            <p className="text-xl mb-2">{error}</p>
            <p className="text-sm">Check the console for more details.</p>
          </div>
        ) : (
          <img
            src="/placeholder.svg?height=500&width=500"
            alt="Test Image"
            className="w-full h-full object-contain"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>

      <div className="mt-4 text-center">
        <p>Status: {loaded ? "Loaded" : error ? "Error" : "Loading..."}</p>
        {loaded && <p className="text-green-500">Image loaded successfully!</p>}
      </div>
    </div>
  )
}
