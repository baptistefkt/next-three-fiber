export function Overlay() {
  return (
    <div className="absolute top-0 left-0 right-0 size-full pointer-events-none">
      <div className="pointer-events-none fixed right-16 top-16 z-[5] overflow-hidden text-[#000000] opacity-40 font-bold leading-none">
        <ul className="flex list-none gap-4">
          <li>Info</li>
          <li>Menu</li>
          <li>Takeway</li>
        </ul>
      </div>
      <div className="pointer-events-none absolute left-16 bottom-16 z-[5] overflow-hidden text-[#000000] text-sm opacity-40 font-bold leading-none">
        © 2025 · Fish Tank
      </div>
    </div>
  )
}