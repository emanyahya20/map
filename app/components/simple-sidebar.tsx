"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, MapPin, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Pin {
  id: string
  position: { x: number; y: number }
  title: string
  description: string
  createdAt: string
}

interface SimpleSidebarProps {
  pins: Pin[]
  isOpen: boolean
  onClose: () => void
}

export function SimpleSidebar({ pins, isOpen, onClose }: SimpleSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPins = searchQuery
    ? pins.filter(
        (pin) =>
          pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pin.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : pins

  return (
    <div
      className={cn(
        "w-80 bg-neutral-800 border-r border-red-900 h-full overflow-hidden transition-all duration-300 ease-in-out absolute md:relative z-10",
        isOpen ? "left-0" : "-left-80 md:left-0",
      )}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-red-600">Pins ({pins.length})</h2>
          <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={onClose}>
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

        {filteredPins.length === 0 ? (
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
                <p className="text-sm mt-1">Click "Add Pin" to start marking locations</p>
              </>
            )}
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-4 px-4">
            <div className="space-y-2">
              {filteredPins.map((pin) => (
                <div
                  key={pin.id}
                  className="p-3 rounded-md border border-neutral-700 bg-neutral-900 hover:bg-neutral-700 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate text-white">{pin.title}</h3>
                  </div>
                  {pin.description && <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{pin.description}</p>}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
