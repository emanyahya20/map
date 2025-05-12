"use client"

import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface Pin {
  id: string
  position: { x: number; y: number }
  title: string
}

interface PinMarkerProps {
  pin: Pin
  onClick: () => void
  isSelected: boolean
}

export function PinMarker({ pin, onClick, isSelected }: PinMarkerProps) {
  return (
    <div
      className={cn(
        "absolute -ml-3 -mt-6 cursor-pointer transition-all duration-200 hover:scale-125",
        isSelected && "scale-125",
      )}
      style={{
        left: `${pin.position.x}%`,
        top: `${pin.position.y}%`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <MapPin
        className={cn("h-6 w-6 text-primary drop-shadow-md", isSelected && "text-primary-foreground fill-primary")}
      />
      {isSelected && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background text-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow-md border">
          {pin.title}
        </div>
      )}
    </div>
  )
}
