import { BUSINESS } from '../lib/site'

interface WordmarkProps {
  className?: string
}

/**
 * Studio Wordmark / Logo — Ultra-bold architectural "A3" mark paired with
 * refined uppercase "INTERIOR". Pure typography with no shapes or blur.
 */
export default function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span
      className={`inline-flex items-baseline select-none leading-none ${className}`}
    >
      <span className="font-black text-[22px] tracking-tight uppercase text-white sm:text-[24px]">
        {BUSINESS.wordmark}
      </span>
      <span className="ml-2 text-[12px] font-medium uppercase tracking-[0.26em] text-white/80 sm:text-[13px]">
        {BUSINESS.wordmarkAccent}
      </span>
    </span>
  )
}


