import { BUSINESS } from '../lib/site'

interface WordmarkProps {
  className?: string
}

/**
 * Studio wordmark — uppercase, wide tracking, with the second word held at
 * 50% opacity (source quirk, preserved).
 */
export default function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span
      className={`select-none text-[13px] font-medium uppercase leading-none tracking-[0.2em] ${className}`}
    >
      {BUSINESS.wordmark}
      <span className="ml-1.5 opacity-50">{BUSINESS.wordmarkAccent}</span>
    </span>
  )
}
