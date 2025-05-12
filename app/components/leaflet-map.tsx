"use client"

import { useEffect, useState, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { PinForm } from "./pin-form"

// Define the Pin type
interface Pin {
  id: string
  position: L.LatLng
  title: string
  description: string
  createdAt: string
}

interface LeafletMapProps {
  isAddingPin: boolean
  setIsAddingPin: (value: boolean) => void
}

export default function LeafletMap({ isAddingPin, setIsAddingPin }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [pins, setPins] = useState<Pin[]>([])
  const [newPinPosition, setNewPinPosition] = useState<L.LatLng | null>(null)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Create map
      const map = L.map(mapContainerRef.current, {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 2,
        zoomControl: false,
        attributionControl: false,
      })

      // Calculate bounds based on image dimensions
      const imageWidth = 8192
      const imageHeight = 8192
      const bounds = L.latLngBounds([0, 0], [imageHeight, imageWidth])

      // Add the RDR2 map as an image overlay
      L.imageOverlay("/placeholder.svg?height=8192&width=8192", bounds).addTo(map)

      // Set view to center of map
      map.setView([imageHeight / 2, imageWidth / 2], -1)
      map.fitBounds(bounds)

      // Add zoom control to bottom right
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map)

      // Store map reference
      mapRef.current = map

      // Add click handler for adding pins
      map.on("click", (e) => {
        if (isAddingPin) {
          setNewPinPosition(e.latlng)
        }
      })

      // Load pins from localStorage
      const savedPins = localStorage.getItem("rdr2-map-pins")
      if (savedPins) {
        try {
          const parsedPins = JSON.parse(savedPins)
          // Convert stored positions to L.LatLng objects
          const convertedPins = parsedPins.map((pin: any) => ({
            ...pin,
            position: L.latLng(pin.position.lat, pin.position.lng),
          }))
          setPins(convertedPins)
        } catch (e) {
          console.error("Failed to parse saved pins", e)
        }
      }
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [isAddingPin])

  // Update pins on map
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // Add pins to map
    pins.forEach((pin) => {
      const marker = L.marker(pin.position, {
        icon: L.divIcon({
          className: "custom-pin",
          html: `<div class="w-6 h-6 bg-red-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(mapRef.current)

      marker.on("click", () => {
        setSelectedPin(pin)
      })
    })

    // Save pins to localStorage
    if (pins.length > 0) {
      // Convert L.LatLng objects to plain objects for storage
      const pinsForStorage = pins.map((pin) => ({
        ...pin,
        position: { lat: pin.position.lat, lng: pin.position.lng },
      }))
      localStorage.setItem("rdr2-map-pins", JSON.stringify(pinsForStorage))
    }
  }, [pins])

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

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full bg-neutral-800" />

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
