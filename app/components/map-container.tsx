"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { PinMarker } from "./pin-marker"
import { PinForm } from "./pin-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Pin {
  id: string
  position: { x: number; y: number }
  title: string
  description: string
  createdAt: string
}

interface MapContainerProps {
  pins: Pin[]
  onAddPin: (pin: Pin) => void
  onUpdatePin: (pin: Pin) => void
  onDeletePin: (id: string) => void
  isAddingPin: boolean
}

export function MapContainer({ pins, onAddPin, onUpdatePin, onDeletePin, isAddingPin }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 })
  const [newPinPosition, setNewPinPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  // Set map dimensions on load and resize
  useEffect(() => {
    const updateMapSize = () => {
      if (mapRef.current) {
        setMapSize({
          width: mapRef.current.clientWidth,
          height: mapRef.current.clientHeight,
        })
      }
    }

    updateMapSize()
    window.addEventListener("resize", updateMapSize)

    return () => {
      window.removeEventListener("resize", updateMapSize)
    }
  }, [])

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingPin || !mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setNewPinPosition({ x, y })
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

    onAddPin(newPin)
    setNewPinPosition(null)
  }

  const handlePinUpdate = (pin: Pin) => {
    onUpdatePin(pin)
    setSelectedPin(null)
  }

  const handlePinDelete = (id: string) => {
    onDeletePin(id)
    setSelectedPin(null)
  }

  const handlePinCancel = () => {
    setNewPinPosition(null)
    setSelectedPin(null)
  }

  const handleImageLoad = () => {
    setMapLoaded(true)
  }

  const handleImageError = () => {
    setMapError("Failed to load map image. Please check the image path.")
    console.error("Failed to load map image at /images/rdr2-map.png")
  }

  return (
    <div
      ref={mapRef}
      className={cn("w-full h-full relative bg-gray-200 cursor-default", isAddingPin && "cursor-crosshair")}
      onClick={handleMapClick}
      style={{ minHeight: "500px" }} // Ensure minimum height
    >
      {!mapLoaded && !mapError ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading map...</span>
        </div>
      ) : mapError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
          <p>{mapError}</p>
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto max-w-full">
            <pre>Expected path: /images/rdr2-map.png</pre>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-full h-full">
            {/* Use standard img tag for better compatibility */}
            <img
              src="/images/rdr2-map.png"
              alt="Red Dead Redemption 2 Map"
              className="w-full h-full object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>

          {/* Display existing pins */}
          {pins.map((pin) => (
            <PinMarker
              key={pin.id}
              pin={pin}
              onClick={() => setSelectedPin(pin)}
              isSelected={selectedPin?.id === pin.id}
            />
          ))}

          {/* Form for adding a new pin */}
          {newPinPosition && (
            <>
              <div
                className="absolute w-6 h-6 -ml-3 -mt-3 bg-primary rounded-full animate-pulse"
                style={{
                  left: `${newPinPosition.x}%`,
                  top: `${newPinPosition.y}%`,
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 md:left-1/4 md:right-1/4 bg-background p-4 rounded-lg shadow-lg border">
                <PinForm onSubmit={handlePinSubmit} onCancel={handlePinCancel} title="" description="" />
              </div>
            </>
          )}

          {/* Form for editing an existing pin */}
          {selectedPin && !newPinPosition && (
            <div className="absolute bottom-4 left-4 right-4 md:left-1/4 md:right-1/4 bg-background p-4 rounded-lg shadow-lg border">
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

          {/* Mobile pin list toggle */}
          <div className="md:hidden absolute bottom-4 right-4">
            <Button variant="secondary" className="shadow-lg">
              Show Pins
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
