"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Layers, Search, Menu } from "lucide-react"
import { Sidebar } from "./sidebar"
import { CustomMap } from "./custom-map"

export default function MapPage() {
  const [isClient, setIsClient] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAddingPin, setIsAddingPin] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      {/* Header */}
      <header className="bg-black border-b border-red-900 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white mr-2 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-red-600">RDR2 Interactive Map</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-red-900 hover:text-white"
            onClick={() => setIsAddingPin(!isAddingPin)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isAddingPin ? "Cancel" : "Add Pin"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 relative">
          {isClient && <CustomMap isAddingPin={isAddingPin} setIsAddingPin={setIsAddingPin} />}

          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-black text-white hover:bg-red-900 border border-red-900"
            >
              <Layers className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black text-white hover:bg-red-900 border border-red-900"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
