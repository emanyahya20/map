"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, ZoomIn, ZoomOut, Menu, Move } from "lucide-react"
import { SimpleSidebar } from "./simple-sidebar"
import { PinForm } from "./pin-form"

// Define the Pin type
interface Pin {
  id: string
  position: { x: number; y: number }
  title: string
  description: string
  createdAt: string
}

export default function SimpleMapPage() {
  const [pins, setPins] = useState<Pin[]>([])
  const [isAddingPin, setIsAddingPin] = useState(false)
  const [newPinPosition, setNewPinPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)

    // Load pins from localStorage
    const savedPins = localStorage.getItem("rdr2-map-pins")
    if (savedPins) {
      try {
        setPins(JSON.parse(savedPins))
      } catch (e) {
        console.error("Failed to parse saved pins", e)
      }
    }
  }, [])

  // Save pins to localStorage when they change
  useEffect(() => {
    if (!isClient) return

    if (pins.length > 0) {
      localStorage.setItem("rdr2-map-pins", JSON.stringify(pins))
    }
  }, [pins, isClient])

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingPin || isDragging || !mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setNewPinPosition({ x, y })
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAddingPin) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handlePinSubmit = (title: string, description: string) => {
    if (!newPinPosition) return

    const newPin: Pin = {
      id: Date.now().toString(),
      position: newPinPosition,
      title,
      description,
      createdAt: new Date().toISOString(),
    }

    setPins([...pins, newPin])
    setNewPinPosition(null)
    setIsAddingPin(false)
  }

  const handlePinUpdate = (updatedPin: Pin) => {
    setPins(pins.map((pin) => (pin.id === updatedPin.id ? updatedPin : pin)))
    setSelectedPin(null)
  }

  const handlePinDelete = (id: string) => {
    setPins(pins.filter((pin) => pin.id !== id))
    setSelectedPin(null)
  }

  const handlePinCancel = () => {
    setNewPinPosition(null)
    setSelectedPin(null)
  }

  const handleImageLoad = () => {
    console.log("Map image loaded successfully")
    setMapLoaded(true)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Failed to load map image", e)
    setMapError("Failed to load map image. Using fallback map.")
    // We'll continue with a fallback map
    setMapLoaded(true)
  }

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 })
    setScale(1)
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      {/* Header */}
      <header className="bg-black border-b border-red-900 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white mr-2 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-red-600">RDR2 Interactive Map</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-red-900 hover:text-white"
            onClick={() => setIsAddingPin(!isAddingPin)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isAddingPin ? "Cancel" : "Add Pin"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SimpleSidebar pins={pins} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 relative bg-neutral-800">
          {/* Map container */}
          <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden"
            style={{ cursor: isAddingPin ? "crosshair" : isDragging ? "grabbing" : "grab" }}
          >
            <div
              ref={mapRef}
              className="w-full h-full relative"
              onClick={handleMapClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
                  <p className="ml-3">Loading map...</p>
                </div>
              )}

              <div
                className="absolute left-1/2 top-1/2 transition-transform duration-100"
                style={{
                  transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center",
                }}
              >
                {/* Fallback map with guaranteed availability */}
                <div
                  className="relative"
                  style={{
                    width: "2000px",
                    height: "1500px",
                    backgroundColor: "#333",
                    backgroundImage: `url('/placeholder.svg?height=2000&width=2000')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Map regions */}
                  <div className="absolute inset-0">
                    {/* New Austin */}
                    <div className="absolute left-[10%] top-[60%] text-red-600 text-2xl font-bold">New Austin</div>

                    {/* West Elizabeth */}
                    <div className="absolute left-[30%] top-[40%] text-red-600 text-2xl font-bold">West Elizabeth</div>

                    {/* New Hanover */}
                    <div className="absolute left-[50%] top-[30%] text-red-600 text-2xl font-bold">New Hanover</div>

                    {/* Lemoyne */}
                    <div className="absolute left-[70%] top-[50%] text-red-600 text-2xl font-bold">Lemoyne</div>

                    {/* Ambarino */}
                    <div className="absolute left-[40%] top-[15%] text-red-600 text-2xl font-bold">Ambarino</div>

                    {/* Guarma */}
                    <div className="absolute left-[85%] top-[80%] text-red-600 text-2xl font-bold">Guarma</div>
                  </div>
                </div>

                {/* Pins */}
                {isClient &&
                  pins.map((pin) => (
                    <div
                      key={pin.id}
                      className="absolute w-6 h-6 -ml-3 -mt-6 cursor-pointer transition-transform duration-200 hover:scale-125"
                      style={{
                        left: `${pin.position.x}%`,
                        top: `${pin.position.y}%`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPin(pin)
                      }}
                    >
                      <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white flex items-center justify-center text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      {selectedPin?.id === pin.id && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-md border border-red-900">
                          {pin.title}
                        </div>
                      )}
                    </div>
                  ))}

                {/* New pin marker */}
                {newPinPosition && (
                  <div
                    className="absolute w-6 h-6 -ml-3 -mt-3 bg-red-600 rounded-full animate-pulse border-2 border-white"
                    style={{
                      left: `${newPinPosition.x}%`,
                      top: `${newPinPosition.y}%`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Map controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-black text-white hover:bg-red-900 border border-red-900"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black text-white hover:bg-red-900 border border-red-900"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black text-white hover:bg-red-900 border border-red-900"
              onClick={resetPosition}
            >
              <Move className="h-4 w-4" />
            </Button>
          </div>

          {/* Form for adding a new pin */}
          {newPinPosition && (
            <div className="absolute bottom-4 left-4 right-4 md:left-1/4 md:right-1/4 bg-neutral-800 p-4 rounded-lg shadow-lg border border-red-900">
              <PinForm onSubmit={handlePinSubmit} onCancel={handlePinCancel} title="" description="" />
            </div>
          )}

          {/* Form for editing an existing pin */}
          {selectedPin && !newPinPosition && (
            <div className="absolute bottom-4 left-4 right-4 md:left-1/4 md:right-1/4 bg-neutral-800 p-4 rounded-lg shadow-lg border border-red-900">
              <PinForm
                onSubmit={(title, description) => handlePinUpdate({ ...selectedPin, title, description })}
                onCancel={handlePinCancel}
                onDelete={() => handlePinDelete(selectedPin.id)}
                title={selectedPin.title}
                description={selectedPin.description}
                isEditing
              />
            </div>
          )}

          {/* Map error notification */}
          {mapError && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-900 text-white px-4 py-2 rounded-md shadow-lg">
              {mapError}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
