"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  ZoomIn,
  ZoomOut,
  Menu,
  Move,
  Trash2,
  Search,
  X,
  Filter,
  Layers,
  SquareStack,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Info,
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
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced pin categories with more RDR2-like styling
const PIN_CATEGORIES = [
  {
    id: "default",
    icon: MapPin,
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    iconColor: "text-white",
    label: "Default",
  },
  {
    id: "location",
    icon: Flag,
    color: "bg-emerald-600",
    hoverColor: "hover:bg-emerald-700",
    iconColor: "text-white",
    label: "Location",
  },
  {
    id: "important",
    icon: AlertCircle,
    color: "bg-rose-600",
    hoverColor: "hover:bg-rose-700",
    iconColor: "text-white",
    label: "Important",
  },
  {
    id: "favorite",
    icon: Star,
    color: "bg-amber-600",
    hoverColor: "hover:bg-amber-700",
    iconColor: "text-white",
    label: "Favorite",
  },
  {
    id: "landmark",
    icon: Mountain,
    color: "bg-slate-600",
    hoverColor: "hover:bg-slate-700",
    iconColor: "text-white",
    label: "Landmark",
  },
  {
    id: "camp",
    icon: Tent,
    color: "bg-orange-600",
    hoverColor: "hover:bg-orange-700",
    iconColor: "text-white",
    label: "Camp",
  },
  {
    id: "mission",
    icon: Trophy,
    color: "bg-violet-600",
    hoverColor: "hover:bg-violet-700",
    iconColor: "text-white",
    label: "Mission",
  },
  {
    id: "settlement",
    icon: Building,
    color: "bg-indigo-600",
    hoverColor: "hover:bg-indigo-700",
    iconColor: "text-white",
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
  isCompleted?: boolean;
}

function Sidebar({
  pins,
  isOpen,
  onClose,
  onSelectPin,
  categories,
  activeCategories,
  onToggleCategory,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});

  const filteredPins = pins.filter((pin) => {
    // Ensure each pin has a category, defaulting to "default" if missing
    const pinCategory = pin.category || "default";

    // Filter by active categories
    if (!activeCategories.includes(pinCategory)) return false;

    // Filter by search term
    if (searchTerm) {
      return (
        pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pin.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const groupedPins = filteredPins.reduce((acc, pin) => {
    // Ensure each pin has a category, defaulting to "default" if missing
    const category = pin.category || "default";

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(pin);
    return acc;
  }, {});

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div
      className={cn(
        "bg-black border-r border-neutral-700 h-full transition-all duration-300 overflow-hidden flex flex-col",
        isOpen ? "w-80" : "w-0 md:w-80"
      )}
    >
      <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-amber-500">Pins</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative p-4 border-b border-neutral-700">
        <Search
          className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neutral-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search Pins..."
          className="w-full bg-neutral-800 border border-neutral-700 rounded py-2 pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700">
        <div className="p-2">
          {/* Categories filter */}
          <div className="mb-4 border-b border-neutral-700 pb-4">
            <div className="flex items-center px-2 py-1 text-amber-500 font-semibold mb-2">
              <Filter size={16} className="mr-2" />
              <span>Filters</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const isActive = activeCategories.includes(category.id);
                return (
                  <Button
                    key={category.id}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex items-center justify-start border border-neutral-700",
                      isActive
                        ? "bg-neutral-800 text-white"
                        : "bg-neutral-900 text-neutral-400"
                    )}
                    onClick={() => onToggleCategory(category.id)}
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    <span className="text-xs">{category.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Pins listing by category */}
          {Object.keys(groupedPins).map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            const isExpanded = expandedCategories[categoryId] !== false; // Default to expanded

            return (
              <div key={categoryId} className="mb-4">
                <button
                  className="flex items-center justify-between w-full px-2 py-2 text-left text-amber-500 hover:bg-neutral-800 rounded font-medium"
                  onClick={() => toggleCategory(categoryId)}
                >
                  <div className="flex items-center">
                    <category.icon className="h-4 w-4 mr-2" />
                    <span>
                      {category.label} ({groupedPins[categoryId].length})
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-2 space-y-2">
                    {groupedPins[categoryId].map((pin) => (
                      <button
                        key={pin.id}
                        className="w-full px-2 py-2 flex items-center text-left hover:bg-neutral-800 rounded group text-neutral-300 hover:text-white"
                        onClick={() => onSelectPin(pin)}
                      >
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full mr-3",
                            pin.isCompleted ? "bg-neutral-600" : category.color
                          )}
                        />
                        <span className="flex-1 text-sm truncate">
                          {pin.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {Object.keys(groupedPins).length === 0 && (
            <div className="text-neutral-400 text-center mt-8">
              <AlertCircle className="mx-auto mb-2" size={20} />
              <p>No Pins Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// First, let's remove the onUpdateLocation prop from the PinForm component
function PinForm({
  onSubmit,
  onCancel,
  onDelete,
  // Remove this line: onUpdateLocation,
  title = "",
  description = "",
  isEditing = false,
}) {
  const [pinTitle, setPinTitle] = useState(title);
  const [pinDescription, setDescription] = useState(description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(pinTitle, pinDescription);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold text-amber-500 mb-4">
        {isEditing ? "Edit Location" : "Add New Location"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={pinTitle}
            onChange={(e) => setPinTitle(e.target.value)}
            placeholder="Enter location title"
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Description
          </label>
          <textarea
            value={pinDescription}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter location details"
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-20"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <div className="flex gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            // Remove the Update Location button that was here
          )}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
function selectPin(pin) {
  // Direct set the selected pin - this is the key part that needs to happen immediately
  setSelectedPin(pin);

  // Cancel any ongoing pin adding or location updates
  setIsAddingPin(false);
  setNewPinPosition(null);
  setIsUpdatingPinLocation(false);
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

  const [isUpdatingPinLocation, setIsUpdatingPinLocation] = useState(false);
  const [selectedPinCategory, setSelectedPinCategory] = useState("default");
  // Update initial scale to start more zoomed in
  const [scale, setScale] = useState(0.8); // Changed from 0.5 to 0.8
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeCategories, setActiveCategories] = useState(
    PIN_CATEGORIES.map((c) => c.id)
  );
  const [showPinLabels, setShowPinLabels] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSmoothPanning, setIsSmoothPanning] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current && containerRef.current) {
      const imgWidth = imageRef.current.naturalWidth;
      const imgHeight = imageRef.current.naturalHeight;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Center the map initially with the updated scale
      setPosition({
        x: (containerWidth - imgWidth * 0.8) / 2, // Updated to match the new scale
        y: (containerHeight - imgHeight * 0.8) / 2,
      });
    }
  }, [imageDimensions]);

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

  const renderPins = () => {
    return visiblePins.map((pin) => (
      <div
        key={pin.id}
        className="absolute"
        style={{
          left: `${pin.position.x}%`,
          top: `${pin.position.y}%`,
        }}
        onClick={(e) => {
          e.stopPropagation(); // IMPORTANT: Prevent map click
          selectPin(pin); // Use our direct selection function
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          togglePinCompletion(pin);
        }}
      >
        {renderPinIcon(pin)}
        {(selectedPin?.id === pin.id || showPinLabels) && (
          <div
            className="absolute transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-md border border-neutral-700"
            style={{
              bottom: "calc(100% + 4px)",
              left: "50%",
              maxWidth: "150px",
            }}
          >
            <div className="font-medium">{pin.title}</div>
            {pin.isCompleted && (
              <div className="text-neutral-400 text-xs">Completed</div>
            )}
          </div>
        )}
      </div>
    ));
  };

  const selectPin = (pin) => {
    // Always immediately set the selected pin
    setSelectedPin(pin);

    // Cancel any ongoing pin operations
    setIsAddingPin(false);
    setNewPinPosition(null);
    setIsUpdatingPinLocation(false);
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
      setSelectedPin(null); // Clear selected pin when adding a new one
    } else if (isUpdatingPinLocation && selectedPin) {
      // Update the pin's location
      const updatedPin = { ...selectedPin, position: { x, y } };

      // Update pins array
      setPins(
        pins.map((pin) => (pin.id === selectedPin.id ? updatedPin : pin))
      );

      // Reset the updating state
      setIsUpdatingPinLocation(false);

      // Keep the updated pin selected
      setSelectedPin(updatedPin);
    } else {
      // Clear selection when clicking on the map background
      setSelectedPin(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAddingPin) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    document.body.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    // Calculate new position with inertia for smoother movement
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    setPosition({
      x: newX,
      y: newY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "auto";
  };

  const handleZoomIn = () => {
    setIsTransitioning(true);
    setScale((prev) => Math.min(prev + 0.1, 2)); // Limit max zoom to 2x
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleZoomOut = () => {
    setIsTransitioning(true);
    setScale((prev) => Math.max(prev - 0.1, 0.2)); // Limit min zoom to 0.2x
    setTimeout(() => setIsTransitioning(false), 300);
  };
  const handleUpdatePinLocation = (pinId) => {
    // Set the updating state to true
    setIsUpdatingPinLocation(true);

    // Close the form temporarily
    setSelectedPin(null);

    // Show a helper message to the user
    alert("Click on the map to set the new pin location");
  };
  // Handle smooth wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.deltaY > 0) {
      // Zoom out
      setScale((prev) => Math.max(prev - 0.05, 0.2));
    } else {
      // Zoom in
      setScale((prev) => Math.min(prev + 0.05, 5));
    }

    // Calculate zoom position (zoom toward cursor)
    if (containerRef.current && imageRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();

      // Adjust position to zoom toward cursor
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      // Offset from center
      const offsetX = mouseX - containerRect.width / 2;
      const offsetY = mouseY - containerRect.height / 2;

      // Apply small adjustment to position based on cursor location
      setPosition((prev) => ({
        x: prev.x - offsetX * 0.02 * (e.deltaY > 0 ? -1 : 1),
        y: prev.y - offsetY * 0.02 * (e.deltaY > 0 ? -1 : 1),
      }));
    }
  };

  // Handle image load to get dimensions
  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  };

  // Update the pin creation handlers
  // Update the handlePinSubmit function to ensure category is properly set
  const handlePinSubmit = (title, description) => {
    if (!newPinPosition) return;

    const newPin = {
      id: Date.now().toString(),
      position: newPinPosition,
      title,
      description,
      // Ensure category is never undefined or null
      category: selectedPinCategory || "default",
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };

    console.log("Creating new pin with category:", newPin.category); // Add logging
    setPins([...pins, newPin]);
    setNewPinPosition(null);
    setIsAddingPin(false);

    // Auto-select the newly created pin
    setSelectedPin(newPin);
  };
  // Update existing pin handler
  const handlePinUpdate = (updates) => {
    if (!selectedPin) return;

    const updatedPin = {
      ...selectedPin,
      ...updates,
    };

    setPins(pins.map((pin) => (pin.id === selectedPin.id ? updatedPin : pin)));
    setSelectedPin(updatedPin);
  };

  const handlePinDelete = (id: string) => {
    setPins(pins.filter((pin) => pin.id !== id));
    setSelectedPin(null);
  };

  const handlePinCancel = () => {
    if (newPinPosition) {
      // If canceling new pin creation
      setNewPinPosition(null);
      setIsAddingPin(false);
    } else {
      // If canceling pin edit
      setSelectedPin(null);
    }
  };

  const resetPosition = () => {
    setIsTransitioning(true);
    if (containerRef.current && imageRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const imgWidth = imageRef.current.naturalWidth * 0.8; // Updated to match the new scale
      const imgHeight = imageRef.current.naturalHeight * 0.8;

      setPosition({
        x: (containerWidth - imgWidth) / 2,
        y: (containerHeight - imgHeight) / 2,
      });
      setScale(0.8); // Updated to match the new scale
    }
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const toggleCategory = (categoryId) => {
    setActiveCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const togglePinCompletion = (pin) => {
    setPins(
      pins.map((p) => {
        if (p.id === pin.id) {
          return { ...p, isCompleted: !p.isCompleted };
        }
        return p;
      })
    );
  };

  const renderPinIcon = (pin: Pin) => {
    // Add fallback for undefined/null categories
    const categoryId = pin.category || "default";
    const pinCategory =
      PIN_CATEGORIES.find((c) => c.id === categoryId) || PIN_CATEGORIES[0];
    const PinIcon = pinCategory.icon;

    return (
      <div
        className={cn(
          "w-6 h-6 cursor-pointer transition-transform duration-200",
          pin.isCompleted ? "opacity-50" : "opacity-100 hover:scale-125",
          pinCategory.color,
          pinCategory.hoverColor,
          "rounded-full shadow-lg flex items-center justify-center"
        )}
        style={{
          transform: "translate(-50%, -50%)",
          boxShadow:
            "0 0 0 2px rgba(0, 0, 0, 0.5), 0 0 0 4px rgba(255, 255, 255, 0.5)",
        }}
      >
        <PinIcon className="w-4 h-4 text-white" />
      </div>
    );
  };

  const visiblePins = pins.filter((pin) => {
    // Ensure each pin has a category, defaulting to "default" if missing
    const pinCategory = pin.category || "default";
    return activeCategories.includes(pinCategory);
  });

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Add this SVG filter definition */}
      <svg width="0" height="0" className="absolute">
        <filter id="sharp">
          <feConvolveMatrix order="3 3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" />
        </filter>
      </svg>
      <div className="flex flex-col h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-black border-b border-neutral-800 p-3 flex items-center justify-between z-10">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white mr-2 md:mr-4"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-amber-500">
              Interactive Map
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={
                isAddingPin
                  ? "bg-red-200 border-amber-700 text-white"
                  : "bg-red-600 border-neutral-700"
              }
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
              // Reset other states
              setNewPinPosition(null);
              setIsAddingPin(false);
              setIsUpdatingPinLocation(false);
              // Center view on selected pin
              if (containerRef.current && imageRef.current) {
                const imageRect = imageRef.current.getBoundingClientRect();
                setPosition({
                  x: -(
                    (pin.position.x / 100) * imageRect.width * scale -
                    containerRef.current.clientWidth / 2
                  ),
                  y: -(
                    (pin.position.y / 100) * imageRect.height * scale -
                    containerRef.current.clientHeight / 2
                  ),
                });
                setSidebarOpen(false); // Close sidebar on mobile
              }
            }}
            categories={PIN_CATEGORIES}
            activeCategories={activeCategories}
            onToggleCategory={toggleCategory}
          />

          {/* Main content */}
          <div className="flex-1 relative bg-black">
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
                backgroundColor: "#000000",
              }}
              onClick={handleMapClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              {/* Image with transform */}
              <div
                className={cn(
                  "absolute origin-center",
                  isTransitioning &&
                    "transition-transform duration-300 ease-out"
                )}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "0 0",
                  willChange: "transform",
                }}
              >
                {/* Map image */}
                <img
                  ref={imageRef}
                  src="/map2.webp" // Using placeholder as example
                  alt="Interactive Map"
                  className="max-w-none"
                  style={{
                    display: "block",
                    filter: "brightness(1.2) contrast(1.1) saturate(1.1)", // Enhanced image clarity
                    pointerEvents: "none", // Prevents image dragging
                  }}
                  onLoad={handleImageLoad}
                />

                {/* Pins */}

                {visiblePins.map((pin) => (
                  <div
                    key={pin.id}
                    className="absolute"
                    style={{
                      left: `${pin.position.x}%`,
                      top: `${pin.position.y}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // This is the key change - directly set the selectedPin no matter what
                      setSelectedPin(pin);
                      // Reset any pin adding or location updating state
                      setNewPinPosition(null);
                      setIsAddingPin(false);
                      setIsUpdatingPinLocation(false);
                    }}
                    onDoubleClick={() => togglePinCompletion(pin)}
                  >
                    {renderPinIcon(pin)}
                    {(selectedPin?.id === pin.id || showPinLabels) && (
                      <div
                        className="absolute transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-md border border-neutral-700"
                        style={{
                          bottom: "calc(100% + 4px)",
                          left: "50%",
                          maxWidth: "150px",
                        }}
                      >
                        <div className="font-medium">{pin.title}</div>
                        {pin.isCompleted && (
                          <div className="text-neutral-400 text-xs">
                            Completed
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {/* New pin marker */}
                {newPinPosition && (
                  <div
                    className="absolute"
                    style={{
                      left: `${newPinPosition.x}%`,
                      top: `${newPinPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="w-6 h-6 bg-amber-500 rounded-full animate-pulse border-2 border-white shadow-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Map controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <div className="bg-black bg-opacity-70 p-1 rounded-lg border border-neutral-800">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 text-white hover:bg-neutral-800"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>

                <div className="h-px my-1 bg-neutral-700" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 text-white hover:bg-neutral-800"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>

                <div className="h-px my-1 bg-neutral-700" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 text-white hover:bg-neutral-800"
                  onClick={resetPosition}
                >
                  <Home className="h-4 w-4" />
                </Button>

                <div className="h-px my-1 bg-neutral-700" />

                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-8 h-8 text-white hover:bg-neutral-800",
                    showPinLabels && "bg-neutral-700"
                  )}
                  onClick={() => setShowPinLabels(!showPinLabels)}
                >
                  {showPinLabels ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>

                <div className="h-px my-1 bg-neutral-700" />

                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-8 h-8 text-white hover:bg-neutral-800",
                    isSmoothPanning && "bg-neutral-700"
                  )}
                  onClick={() => setIsSmoothPanning(!isSmoothPanning)}
                  title="Toggle Smooth Panning"
                >
                  <Move className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Pin Category Selector (visible when adding pins) */}
            {isAddingPin && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black bg-opacity-70 p-2 rounded-lg border border-neutral-800">
                {PIN_CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedPinCategory === category.id
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className={cn(
                      selectedPinCategory === category.id
                        ? `${category.color} ${category.hoverColor} text-white`
                        : "bg-black border-neutral-700 hover:bg-neutral-800"
                    )}
                    onClick={() => setSelectedPinCategory(category.id)}
                  >
                    <category.icon className="h-4 w-4 mr-1" />
                    <span className="text-xs">{category.label}</span>
                  </Button>
                ))}
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
            {selectedPin && !isUpdatingPinLocation && (
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
        </div>
      </div>
    </div>
  );
}
