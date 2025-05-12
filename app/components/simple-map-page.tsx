"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  ZoomIn,
  ZoomOut,
  Menu,
  Move,
  MapPin,
  Flag,
  AlertCircle,
  Star,
  Compass,
  Heart,
  Building,
  TreePine,
  Mountain,
  Tent,
  Trophy,
} from "lucide-react";
import { Sidebar } from "./sidebar";
import { PinForm } from "./pin-form";

// Define pin categories with more vibrant colors and icons
const PIN_CATEGORIES = [
  {
    category: "default",
    icon: MapPin,
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    iconColor: "text-blue-400",
    label: "Default",
  },
  {
    category: "important",
    icon: AlertCircle,
    color: "bg-rose-600",
    hoverColor: "hover:bg-rose-700",
    iconColor: "text-rose-400",
    label: "Important",
  },
  {
    category: "location",
    icon: Flag,
    color: "bg-emerald-600",
    hoverColor: "hover:bg-emerald-700",
    iconColor: "text-emerald-400",
    label: "Location",
  },
  {
    category: "favorite",
    icon: Star,
    color: "bg-amber-600",
    hoverColor: "hover:bg-amber-700",
    iconColor: "text-amber-400",
    label: "Favorite",
  },
  {
    category: "landmark",
    icon: Mountain,
    color: "bg-slate-600",
    hoverColor: "hover:bg-slate-700",
    iconColor: "text-slate-400",
    label: "Landmark",
  },
  {
    category: "camp",
    icon: Tent,
    color: "bg-orange-600",
    hoverColor: "hover:bg-orange-700",
    iconColor: "text-orange-400",
    label: "Camp",
  },
  {
    category: "mission",
    icon: Trophy,
    color: "bg-violet-600",
    hoverColor: "hover:bg-violet-700",
    iconColor: "text-violet-400",
    label: "Mission",
  },
  {
    category: "settlement",
    icon: Building,
    color: "bg-indigo-600",
    hoverColor: "hover:bg-indigo-700",
    iconColor: "text-indigo-400",
    label: "Settlement",
  },
];

interface Pin {
  id: string;
  position: { x: number; y: number };
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

export default function ImageMapViewer() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newPinPosition, setNewPinPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPinCategory, setSelectedPinCategory] = useState("default");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Load pins from localStorage on component mount
  useEffect(() => {
    const savedPins = localStorage.getItem("image-map-pins");
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
      localStorage.setItem("image-map-pins", JSON.stringify(pins));
    }
  }, [pins]);

  // Handle image load to get dimensions
  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !isAddingPin ||
      isDragging ||
      !containerRef.current ||
      !imageRef.current
    )
      return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    // Calculate click position relative to the image
    const x = ((e.clientX - imageRect.left) / imageRect.width) * 100;
    const y = ((e.clientY - imageRect.top) / imageRect.height) * 100;

    setNewPinPosition({ x, y });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAddingPin) return;
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
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handlePinSubmit = (title: string, description: string) => {
    if (!newPinPosition) return;

    const newPin: Pin = {
      id: Date.now().toString(),
      position: newPinPosition,
      title,
      description,
      category: selectedPinCategory,
      createdAt: new Date().toISOString(),
    };

    setPins([...pins, newPin]);
    setNewPinPosition(null);
    setIsAddingPin(false);
  };

  const handlePinUpdate = (updatedPin: Partial<Pin>) => {
    setPins(
      pins.map((pin) =>
        pin.id === selectedPin?.id ? { ...pin, ...updatedPin } : pin
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

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const renderPinIcon = (pin: Pin) => {
    const pinCategory =
      PIN_CATEGORIES.find((c) => c.category === pin.category) ||
      PIN_CATEGORIES[0];
    const PinIcon = pinCategory.icon;

    return (
      <div
        className={`w-6 h-6 -ml-3 -mt-6 cursor-pointer transition-transform duration-200 hover:scale-125 ${pinCategory.color} ${pinCategory.hoverColor} rounded-full border-2 border-white flex items-center justify-center text-white`}
      >
        <PinIcon className={`w-4 h-4 ${pinCategory.iconColor}`} />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      {/* Header */}
      <header className="bg-black border-b border-neutral-700 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white mr-2 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Interactive Image Map</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isAddingPin ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsAddingPin(!isAddingPin)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isAddingPin ? "Cancel" : "Add Pin"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          pins={pins}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectPin={(pin) => {
            setSelectedPin(pin);
            // Center view on selected pin
            if (containerRef.current) {
              const containerWidth = containerRef.current.clientWidth;
              const containerHeight = containerRef.current.clientHeight;
              setPosition({
                x:
                  containerWidth / 2 -
                  (pin.position.x / 100) * containerWidth * scale,
                y:
                  containerHeight / 2 -
                  (pin.position.y / 100) * containerHeight * scale,
              });
              setSidebarOpen(false); // Close sidebar on mobile
            }
          }}
        />

        {/* Main content */}
        <div className="flex-1 relative bg-neutral-800">
          {/* Map container */}
          <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden"
            style={{
              cursor: isAddingPin
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
            {/* Image container with transform */}
            <div
              className="absolute left-1/2 top-1/2 origin-center transition-transform duration-100"
              style={{
                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
              }}
            >
              {/* Replace with your actual map image */}
              <img
                ref={imageRef}
                src="/map.png" // Update this path
                alt="Interactive Map"
                className="max-w-none"
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
                    e.stopPropagation();
                    setSelectedPin(pin);
                  }}
                >
                  {renderPinIcon(pin)}
                  {selectedPin?.id === pin.id && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-md border border-neutral-700">
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

          {/* Map controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-black text-white hover:bg-neutral-700 border border-neutral-700"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black text-white hover:bg-neutral-700 border border-neutral-700"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black text-white hover:bg-neutral-700 border border-neutral-700"
              onClick={resetPosition}
            >
              <Move className="h-4 w-4" />
            </Button>
          </div>

          {/* Pin Category Selector */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {PIN_CATEGORIES.map((category) => (
              <Button
                key={category.category}
                variant={
                  selectedPinCategory === category.category
                    ? "default"
                    : "secondary"
                }
                size="icon"
                className={`${category.color} ${category.hoverColor} text-white hover:opacity-80`}
                onClick={() => setSelectedPinCategory(category.category)}
              >
                <category.icon className={`h-4 w-4 ${category.iconColor}`} />
              </Button>
            ))}
          </div>

          {/* Form for adding a new pin */}
          {newPinPosition && (
            <div className="absolute bottom-4 left-4 right-4 md:left-1/4 md:right-1/4 bg-neutral-800 p-4 rounded-lg shadow-lg border border-neutral-700">
              <PinForm
                onSubmit={handlePinSubmit}
                onCancel={handlePinCancel}
                title=""
                description=""
              />
            </div>
          )}

          {/* Form for editing an existing pin */}
          {selectedPin && !newPinPosition && (
            <div className="absolute bottom-4 left-4 right-4 md:left-1/4 md:right-1/4 bg-neutral-800 p-4 rounded-lg shadow-lg border border-neutral-700">
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
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {PIN_CATEGORIES.map((category) => (
                  <Button
                    key={category.category}
                    variant={
                      selectedPin.category === category.category
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className={`${category.color} ${category.hoverColor} text-white hover:opacity-80`}
                    onClick={() =>
                      handlePinUpdate({ category: category.category })
                    }
                  >
                    <category.icon
                      className={`mr-2 h-4 w-4 ${category.iconColor}`}
                    />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
