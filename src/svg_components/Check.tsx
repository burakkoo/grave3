export default function SvgCheck({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
