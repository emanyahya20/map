"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check } from "lucide-react"

interface Pin {
  id: string
  lat: number
  lng: number
  label?: string
}

interface ShareButtonProps {
  pins: Pin[]
}

export function ShareButton({ pins }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const generateShareUrl = () => {
    if (pins.length === 0 || typeof window === "undefined") return ""

    // Encode pins as base64 to make the URL cleaner
    const encodedPins = btoa(JSON.stringify(pins))
    const url = new URL(window.location.origin)
    url.searchParams.set("pins", encodedPins)
    return url.toString()
  }

  const handleCopy = async () => {
    const shareUrl = generateShareUrl()
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share Map
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Map</DialogTitle>
          <DialogDescription>Share this link to show your pins to others</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <Input readOnly value={generateShareUrl()} className="flex-1" />
          <Button size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-2">
          {pins.length === 0 ? (
            <p>You haven't added any pins yet. Add pins to share your map.</p>
          ) : (
            <p>
              This link contains {pins.length} pin{pins.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
