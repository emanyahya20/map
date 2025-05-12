"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Define pin category colors to match the main component
const PIN_CATEGORIES_COLORS: { [key: string]: string } = {
  default: "text-blue-500",
  important: "text-rose-500",
  location: "text-emerald-500",
  favorite: "text-amber-500",
  landmark: "text-slate-500",
  camp: "text-orange-500",
  mission: "text-violet-500",
  settlement: "text-indigo-500",
};

interface Pin {
  id: string;
  title: string;
  description: string;
  category: string;
  position: { x: number; y: number };
  createdAt: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPin: (pin: Pin) => void;
}

export function Sidebar({ isOpen, onClose, onSelectPin }: SidebarProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Load pins from localStorage
    const savedPins = localStorage.getItem("image-map-pins");
    if (savedPins) {
      try {
        setPins(JSON.parse(savedPins));
      } catch (e) {
        console.error("Failed to parse saved pins", e);
      }
    }
  }, []);

  const filteredPins = searchQuery
    ? pins.filter(
        (pin) =>
          pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pin.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pins;

  // Sort pins by creation date, most recent first
  const sortedPins = [...filteredPins].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div
      className={cn(
        "w-80 bg-neutral-800 border-r border-neutral-700 h-full overflow-hidden transition-all duration-300 ease-in-out absolute md:relative z-10",
        isOpen ? "left-0" : "-left-80 md:left-0"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Pins ({pins.length})
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={onClose}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search pins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8 bg-neutral-900 border-neutral-700 text-white"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-neutral-400"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {sortedPins.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400 p-4">
            {searchQuery ? (
              <>
                <Search className="h-8 w-8 mb-2" />
                <p>No pins match your search</p>
              </>
            ) : (
              <>
                <MapPin className="h-8 w-8 mb-2" />
                <p>No pins added yet</p>
                <p className="text-sm mt-1">
                  Click "Add Pin" to start marking locations
                </p>
              </>
            )}
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-4 px-4">
            <div className="space-y-2">
              {sortedPins.map((pin) => {
                // Get the color for the pin's category
                const categoryColor =
                  PIN_CATEGORIES_COLORS[pin.category] ||
                  PIN_CATEGORIES_COLORS.default;

                return (
                  <div
                    key={pin.id}
                    className="p-3 rounded-md border border-neutral-700 bg-neutral-900 hover:bg-neutral-700 cursor-pointer group"
                    onClick={() => {
                      onSelectPin(pin);
                      onClose(); // Close sidebar on mobile
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin
                        className={`h-5 w-5 ${categoryColor} flex-shrink-0`}
                      />
                      <h3 className="font-medium truncate text-white flex-1">
                        {pin.title}
                      </h3>
                      <span className="text-xs text-neutral-400 group-hover:text-white">
                        {pin.category}
                      </span>
                    </div>
                    {pin.description && (
                      <p className="text-sm text-neutral-400 line-clamp-2">
                        {pin.description}
                      </p>
                    )}
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(pin.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
