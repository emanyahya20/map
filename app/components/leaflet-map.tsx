"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { PinForm } from "./pin-form";
import { PinMarker } from "./pin-marker";
import { PinList } from "./pin-list";
import "leaflet/dist/leaflet.css";

import { AlertCircle, Check } from "lucide-react";

// Define the Pin type
interface Pin {
  id: string;
  position: L.LatLng;
  title: string;
  description: string;
  createdAt: string;
}

interface LeafletMapProps {
  isAddingPin: boolean;
  setIsAddingPin: (value: boolean) => void;
}

export default function LeafletMap({
  isAddingPin,
  setIsAddingPin,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [newPinPosition, setNewPinPosition] = useState<L.LatLng | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState<boolean>(false);
  const [updatingPinId, setUpdatingPinId] = useState<string | null>(null);
  const [mapMessage, setMapMessage] = useState<{
    visible: boolean;
    text: string;
    type: string;
  }>({
    visible: false,
    text: "",
    type: "",
  });

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
      });

      // Calculate bounds based on image dimensions
      const imageWidth = 8192;
      const imageHeight = 8192;
      const bounds = L.latLngBounds([0, 0], [imageHeight, imageWidth]);

      // Add the RDR2 map as an image overlay
      L.imageOverlay("/placeholder.svg?height=8192&width=8192", bounds).addTo(
        map
      );

      // Set view to center of map
      map.setView([imageHeight / 2, imageWidth / 2], -1);
      map.fitBounds(bounds);

      // Add zoom control to bottom right
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      // Store map reference
      mapRef.current = map;

      // Load pins from localStorage
      const savedPins = localStorage.getItem("rdr2-map-pins");
      if (savedPins) {
        try {
          const parsedPins = JSON.parse(savedPins);
          // Convert stored positions to L.LatLng objects
          const convertedPins = parsedPins.map((pin: any) => ({
            ...pin,
            position: L.latLng(pin.position.lat, pin.position.lng),
          }));
          setPins(convertedPins);
        } catch (e) {
          console.error("Failed to parse saved pins", e);
        }
      }
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle map clicks - Fixed function
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (isAddingPin) {
      // Set new pin position at click location
      setNewPinPosition(e.latlng);
      setIsAddingPin(false);
    } else if (isUpdatingLocation && updatingPinId) {
      // Update the pin's location
      const updatedPins = pins.map((pin) =>
        pin.id === updatingPinId ? { ...pin, position: e.latlng } : pin
      );

      // Exit location update mode
      setPins(updatedPins);
      setIsUpdatingLocation(false);
      setUpdatingPinId(null);

      // Show success message
      setMapMessage({
        visible: true,
        text: "Pin location updated successfully",
        type: "success",
      });

      // Hide message after delay
      setTimeout(() => {
        setMapMessage({ visible: false, text: "", type: "" });
      }, 3000);
    } else {
      // Reset selection if clicking elsewhere
      setSelectedPin(null);
    }
  };

  // Add click handler to map
  useEffect(() => {
    if (!mapRef.current) return;

    // Add click event listener
    mapRef.current.on("click", handleMapClick);

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
      }
    };
  }, [isAddingPin, isUpdatingLocation, updatingPinId]);

  // Update pins on map
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add pins to map
    pins.forEach((pin) => {
      // Use different styling for the pin being updated
      const isUpdating = isUpdatingLocation && updatingPinId === pin.id;
      const markerColor = isUpdating ? "bg-blue-600" : "bg-red-600";
      const borderColor = isUpdating ? "border-yellow-300" : "border-white";

      const marker = L.marker(pin.position, {
        icon: L.divIcon({
          className: "custom-pin",
          html: `<div class="w-6 h-6 ${markerColor} rounded-full border-2 ${borderColor} flex items-center justify-center text-white font-bold ${
            isUpdating ? "animate-pulse" : ""
          }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(mapRef.current);

      marker.on("click", () => {
        // Don't select the pin if we're in update mode
        if (!isUpdatingLocation) {
          setSelectedPin(pin);
        }
      });
    });

    // Save pins to localStorage
    if (pins.length > 0) {
      // Convert L.LatLng objects to plain objects for storage
      const pinsForStorage = pins.map((pin) => ({
        ...pin,
        position: { lat: pin.position.lat, lng: pin.position.lng },
      }));
      localStorage.setItem("rdr2-map-pins", JSON.stringify(pinsForStorage));
    }
  }, [pins, isUpdatingLocation, updatingPinId]);

  const handlePinSubmit = (title: string, description: string) => {
    if (!newPinPosition) return;

    const newPin: Pin = {
      id: Date.now().toString(),
      position: newPinPosition,
      title,
      description,
      createdAt: new Date().toISOString(),
    };

    setPins([...pins, newPin]);
    setNewPinPosition(null);
    setIsAddingPin(false);
  };

  const handlePinUpdate = (updatedPin: Partial<Pin> & { id: string }) => {
    setPins(
      pins.map((pin) =>
        pin.id === updatedPin.id ? { ...pin, ...updatedPin } : pin
      )
    );
    setSelectedPin(null);
  };

  const handlePinDelete = (id: string) => {
    setPins(pins.filter((pin) => pin.id !== id));
    setSelectedPin(null);
  };

  const handlePinCancel = () => {
    setNewPinPosition(null);
    setSelectedPin(null);
  };

  // Fixed the function name to match what's being used in the PinForm
  const handleUpdatePinLocation = (pinId: string) => {
    // First, make sure we have a reference to the pin
    const pinToUpdate = pins.find((pin) => pin.id === pinId);
    if (!pinToUpdate) return;

    // Enable location update mode
    setIsUpdatingLocation(true);
    setUpdatingPinId(pinId);

    // Close the edit form
    setSelectedPin(null);

    // Show guidance message
    setMapMessage({
      visible: true,
      text: "Click on the map to set a new location for this pin",
      type: "info",
    });
  };
  const handleUpdatePinLocation = (pinId) => {
    setIsUpdatingPinLocation(true);
    // Close the edit form temporarily
    setSelectedPin(null);

    // Update cursor to indicate we're in location update mode
    document.body.style.cursor = "crosshair";

    // Show a message to the user
    alert("Click on the map to set the new location for this pin");
  };

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full bg-neutral-800" />

      {/* Message display */}
      {mapMessage.visible && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 py-2 px-4 rounded-lg shadow-lg flex items-center gap-2
          ${
            mapMessage.type === "info"
              ? "bg-blue-950 border border-blue-800"
              : mapMessage.type === "success"
              ? "bg-green-950 border border-green-800"
              : "bg-red-950 border border-red-800"
          }`}
        >
          {mapMessage.type === "info" ? (
            <AlertCircle className="h-4 w-4 text-blue-400" />
          ) : (
            <Check className="h-4 w-4 text-green-400" />
          )}
          <p className="text-white font-medium text-sm">{mapMessage.text}</p>
        </div>
      )}

      {/* Form for adding a new pin */}
      {newPinPosition && !selectedPin && (
        <div className="absolute inset-x-4 bottom-4 md:w-2/3 md:left-1/6 lg:w-1/2 lg:left-1/4 bg-black bg-opacity-90 p-4 rounded-lg shadow-lg border border-neutral-700">
          <PinForm
            onSubmit={handlePinSubmit}
            onCancel={handlePinCancel}
            title=""
            description=""
          />
        </div>
      )}

      {/* Form for editing an existing pin */}
      {selectedPin && !isAddingPin && !isUpdatingPinLocation && (
        <div className="absolute inset-x-4 bottom-4 md:w-2/3 md:left-1/6 lg:w-1/2 lg:left-1/4 bg-black bg-opacity-90 p-4 rounded-lg shadow-lg border border-neutral-700">
          <PinForm
            onSubmit={(title, description) =>
              handlePinUpdate({ title, description })
            }
            onCancel={handlePinCancel}
            onDelete={() => handlePinDelete(selectedPin.id)}
            title={selectedPin.title}
            description={selectedPin.description}
            isEditing
          />
        </div>
      )}
    </div>
  );
}
