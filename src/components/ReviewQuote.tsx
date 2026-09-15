import type { Review } from '../lib/site'

interface ReviewQuoteProps {
  review: Review
  className?: string
}

/**
 * Renders a review verbatim, keeping the emphasis the source listing carries
 * on selected words.
 */
export default function ReviewQuote({ review, className = '' }: ReviewQuoteProps) {
  const { quote, highlights } = review
  const pattern = highlights.length
    ? new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
    : null

  const parts = pattern ? quote.split(pattern) : [quote]

  return (
    <p className={`text-[15px] leading-relaxed text-ink/75 ${className}`}>
      <span className="mr-1 font-serif text-2xl leading-none text-ink/30">“</span>
      {parts.map((part, i) =>
        pattern && highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} className="font-medium text-ink">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
      <span className="ml-0.5 font-serif text-2xl leading-none text-ink/30">”</span>
    </p>
  )
}
