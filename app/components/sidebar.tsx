"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, MapPin, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

// Define pin category colors to match RDR2 map style
const PIN_CATEGORIES_COLORS: { [key: string]: string } = {
  default: "text-yellow-600",
  important: "text-red-600",
  location: "text-green-600",
  favorite: "text-amber-500",
  landmark: "text-stone-500",
  camp: "text-orange-600",
  mission: "text-purple-600",
  settlement: "text-blue-600",
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
  onSelectPin: (pin: Pin) => void;
}

export function Sidebar({ onSelectPin }: SidebarProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <>
      {/* Sidebar Toggle Button - Visible on all screen sizes */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-20 bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      {/* Overlay to close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed-position sidebar that doesn't cause layout shifts */}
      <div
        className={cn(
          "w-80 bg-neutral-900 border-r border-neutral-700 h-full overflow-hidden transition-all duration-300 ease-in-out fixed z-20",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "flex flex-col shadow-2xl"
        )}
      >
        <div className="bg-neutral-800 p-4 border-b border-neutral-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-300 uppercase tracking-wider">
            Pins ({pins.length})
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-neutral-200"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-neutral-700">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search pins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 bg-neutral-800 border-neutral-700 text-neutral-300 focus:ring-2 focus:ring-amber-600"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-neutral-400 hover:text-neutral-200"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </div>

        {sortedPins.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center text-neutral-400 p-4">
            {searchQuery ? (
              <>
                <Search className="h-8 w-8 mb-2 text-neutral-500" />
                <p>No pins match your search</p>
              </>
            ) : (
              <>
                <MapPin className="h-8 w-8 mb-2 text-neutral-500" />
                <p>No pins added yet</p>
                <p className="text-sm mt-1 text-neutral-500">
                  Click "Add Pin" to start marking locations
                </p>
              </>
            )}
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {sortedPins.map((pin) => {
                // Get the color for the pin's category
                const categoryColor =
                  PIN_CATEGORIES_COLORS[pin.category] ||
                  PIN_CATEGORIES_COLORS.default;

                return (
                  <div
                    key={pin.id}
                    className="p-3 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 cursor-pointer group transition-colors duration-200"
                    onClick={() => {
                      onSelectPin(pin);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin
                        className={`h-5 w-5 ${categoryColor} flex-shrink-0`}
                      />
                      <h3 className="font-medium truncate text-neutral-300 flex-1 group-hover:text-white">
                        {pin.title}
                      </h3>
                      <span className="text-xs text-neutral-400 group-hover:text-neutral-200">
                        {pin.category}
                      </span>
                    </div>
                    {pin.description && (
                      <p className="text-sm text-neutral-400 line-clamp-2 group-hover:text-neutral-300">
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
    </>
  );
}
