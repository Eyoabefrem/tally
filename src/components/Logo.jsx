// Four tally bars, struck through: five sets counted.
export function Mark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 4v24M13 4v24M20 4v24M27 4v24" stroke="currentColor" strokeWidth="4" fill="none" />
      <path d="M1 24L31 8" stroke="var(--o)" strokeWidth="4" />
    </svg>
  )
}
export default function Logo({ size = 30 }) {
  return <span className="inline-flex items-center gap-2.5"><Mark size={size} /><span className="display text-3xl">tally</span></span>
}
