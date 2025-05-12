"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Search, X, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Pin {
  id: string
  position: {
    x: number
    y: number
  }
  title: string
  description: string
  createdAt: string
}

interface PinListProps {
  pins: Pin[]
  onPinUpdate: (pin: Pin) => void
  onPinDelete: (id: string) => void
}

export function PinList({ pins, onPinUpdate, onPinDelete }: PinListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPins = searchQuery
    ? pins.filter(
        (pin) =>
          pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pin.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : pins

  const sortedPins = [...filteredPins].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Pins ({pins.length})</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      {sortedPins.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
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
            {sortedPins.map((pin) => (
              <div
                key={pin.id}
                className="p-3 rounded-md border hover:bg-accent cursor-pointer"
                onClick={() => {
                  // This would ideally center the map on this pin
                  // For now, we'll just highlight it
                }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate">{pin.title}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPinDelete(pin.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                {pin.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{pin.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Added {formatDistanceToNow(new Date(pin.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
