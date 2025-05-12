"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { PinForm } from "./pin-form"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"

// Define the Pin type
interface Pin {
  id: string
  position: { x: number; y: number }
  title: string
  description: string
  createdAt: string
}

interface CustomMapProps {
  isAddingPin: boolean
  setIsAddingPin: (value: boolean) => void
}

export function CustomMap({ isAddingPin, setIsAddingPin }: CustomMapProps) {
  const [pins, setPins] = useState<Pin[]>([])
  const [newPinPosition, setNewPinPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapLoaded, setMapLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load pins from localStorage
  useEffect(() => {
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
    if (pins.length > 0) {
      localStorage.setItem("rdr2-map-pins", JSON.stringify(pins))
    }
  }, [pins])

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingPin || isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
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
    setZoom(Math.min(zoom + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.2, 0.5))
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
    setMapLoaded(true)
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-neutral-800">
      {/* Map container */}
      <div
        ref={containerRef}
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
        onClick={handleMapClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Map image */}
        <div
          className="absolute transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "center",
          }}
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
            </div>
          )}
          <img
            src="/placeholder.svg?height=2048&width=2048"
            alt="RDR2 Map"
            className="max-w-none"
            style={{ width: "2048px", height: "2048px" }}
            onLoad={handleImageLoad}
          />

          {/* Pins */}
          {pins.map((pin) => (
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

      {/* Zoom controls */}
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
    </div>
  )
}
