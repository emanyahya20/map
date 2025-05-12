export default function FallbackImage() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-white">
      <div className="text-center p-4">
        <div className="w-16 h-16 border-4 border-red-700 rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-bold mb-2">RDR2 Map</h2>
        <p className="text-neutral-400">Map image placeholder</p>
      </div>
    </div>
  )
}
