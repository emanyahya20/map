export default function FallbackMap() {
  return (
    <div className="w-full h-full bg-neutral-800 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-700 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2 text-red-600">RDR2 Interactive Map</h2>
          <p className="text-neutral-400">Map image placeholder</p>
        </div>
      </div>

      {/* Map regions */}
      <div className="absolute inset-0">
        {/* New Austin */}
        <div className="absolute left-[10%] top-[60%] text-red-600 text-xl font-bold">New Austin</div>

        {/* West Elizabeth */}
        <div className="absolute left-[30%] top-[40%] text-red-600 text-xl font-bold">West Elizabeth</div>

        {/* New Hanover */}
        <div className="absolute left-[50%] top-[30%] text-red-600 text-xl font-bold">New Hanover</div>

        {/* Lemoyne */}
        <div className="absolute left-[70%] top-[50%] text-red-600 text-xl font-bold">Lemoyne</div>

        {/* Ambarino */}
        <div className="absolute left-[40%] top-[15%] text-red-600 text-xl font-bold">Ambarino</div>

        {/* Guarma */}
        <div className="absolute left-[85%] top-[80%] text-red-600 text-xl font-bold">Guarma</div>
      </div>
    </div>
  )
}
