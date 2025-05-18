"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { PinForm } from "./pin-form";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

// Define the Pin type
interface Pin {
  id: string;
  position: { x: number; y: number };
  title: string;
  description: string;
  createdAt: string;
}

interface CustomMapProps {
  isAddingPin: boolean;
  setIsAddingPin: (value: boolean) => void;
}

export function CustomMap({ isAddingPin, setIsAddingPin }: CustomMapProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [newPinPosition, setNewPinPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);
  // Add the missing state for updating pin location
  const [isUpdatingPinLocation, setIsUpdatingPinLocation] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  // Add the missing imageRef
  const imageRef = useRef<HTMLImageElement>(null);

  // Load pins from localStorage
  useEffect(() => {
    const savedPins = localStorage.getItem("rdr2-map-pins");
    if (savedPins) {
      try {
        setPins(JSON.parse(savedPins));
      } catch (e) {
        console.error("Failed to parse saved pins", e);
      }
    }
  }, []);

  // Save pins to localStorage when they change
  useEffect(() => {
    if (pins.length > 0) {
      localStorage.setItem("rdr2-map-pins", JSON.stringify(pins));
    }
  }, [pins]);

  // Add the missing handleUpdatePinLocation function
  const handleUpdatePinLocation = (pinId: string) => {
    setIsUpdatingPinLocation(true);
    // Store the current selected pin
    const currentPin = pins.find((pin) => pin.id === pinId);
    if (currentPin) {
      setSelectedPin(currentPin);
    }
    // Change cursor to indicate we're in update mode
    document.body.style.cursor = "crosshair";
    // Show a message to the user
    alert("Click on the map to set the new location for this pin");
  };

  const handleMapClick = (e) => {
    if (isDragging || !containerRef.current || !imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();

    // Calculate click position relative to the image
    const x = ((e.clientX - imageRect.left) / imageRect.width) * 100;
    const y = ((e.clientY - imageRect.top) / imageRect.height) * 100;

    if (isAddingPin) {
      // Handle normal pin adding
      setNewPinPosition({ x, y });
    }
    // Remove the else if block for updating pin location
    else if (isUpdatingPinLocation) {
      //   // Update the pin's location
      const pinToUpdate = pins.find((pin) => pin.id === selectedPin.id);
      //
      if (pinToUpdate) {
        //     // Update the pin with the new position
        setPins(
          pins.map((pin) =>
            pin.id === selectedPin.id ? { ...pin, position: { x, y } } : pin
          )
        );

        //     // Reset the updating state
        setIsUpdatingPinLocation(false);
        //
        // Reselect the pin to show the edit form
        const updatedPin = { ...pinToUpdate, position: { x, y } };
        setSelectedPin(updatedPin);
      }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isAddingPin || isUpdatingPinLocation) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleZoomIn = () => {
      setZoom(Math.min(zoom + 0.2, 2));
    };

    const handleZoomOut = () => {
      setZoom(Math.max(zoom - 0.2, 0.5));
    };

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

    const handlePinUpdate = (updates: {
      title: string;
      description: string;
    }) => {
      if (!selectedPin) return;

      const updatedPin = {
        ...selectedPin,
        ...updates,
      };

      setPins(
        pins.map((pin) => (pin.id === selectedPin.id ? updatedPin : pin))
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
      setIsUpdatingPinLocation(false);
      document.body.style.cursor = "auto"; // Reset cursor
    };

    const handleImageLoad = () => {
      setMapLoaded(true);
    };

    return (
      <div className="w-full h-full relative overflow-hidden bg-neutral-800">
        {/* Map container */}
        <div
          ref={containerRef}
          className="w-full h-full relative cursor-grab active:cursor-grabbing"
          style={{
            cursor: isUpdatingPinLocation
              ? "crosshair"
              : isAddingPin
              ? "crosshair"
              : isDragging
              ? "grabbing"
              : "grab",
          }}
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
              ref={imageRef}
              src="/placeholder.svg?height=2048&width=2048"
              alt="RDR2 Map"
              className="max-w-none"
              style={{ width: "2048px", height: "2048px" }}
              onLoad={handleImageLoad}
            />

            {/* Status message for update mode */}
            {isUpdatingPinLocation && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-md z-50">
                Click on the map to update pin location
              </div>
            )}

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
                  e.stopPropagation();
                  setSelectedPin(pin);
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
  };
}
