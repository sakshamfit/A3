import { ArrowRight } from 'lucide-react'
import BoomerangVideoBg from './BoomerangVideoBg'

const FEATURE_ROWS = [
  { number: '01', label: 'Conversational' },
  { number: '02', label: 'Connected' },
  { number: '03', label: 'Compliant' },
]

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex flex-col items-center overflow-hidden h-screen"
    >
      {/* Boomerang video background */}
      <BoomerangVideoBg />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center w-full h-full">
        {/* Hero copy block */}
        <div className="flex flex-col items-center text-center px-4 sm:px-6 pt-24 sm:pt-26 md:pt-32">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter text-[#191919] font-normal">
            Build lasting
            <br />
            relationships.
          </h1>

          <p className="max-w-sm sm:max-w-md mt-5 sm:mt-6 md:mt-8 text-sm md:text-base text-[#191919]/70 leading-relaxed">
            Conversational AI platform for modern financial institutions —
            agents that handle the full borrower lifecycle across email, SMS,
            and voice.
          </p>

          <a
            href="#demo"
            className="mt-6 sm:mt-8 md:mt-10 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#191919] text-white text-sm font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200"
          >
            Book A Demo
          </a>
        </div>

        {/* Bottom info panel */}
        <div className="mt-auto w-full flex justify-center">
          <div className="w-full max-w-5xl px-4 sm:px-6">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 border-b-0 pt-8 sm:pt-12 md:pt-16 px-5 sm:px-8 md:px-12 pb-0 shadow-sm">
              {/* Row 1 — two columns */}
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-16">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/50 font-medium">
                    What do we do?
                  </p>
                  <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-normal leading-tight tracking-tight text-[#191919]">
                    Conversations that
                    <br className="hidden sm:block" />
                    build momentum
                  </h2>
                </div>
                <p className="md:self-end text-sm md:text-[15px] text-[#191919]/70 leading-relaxed">
                  Conversational AI built for regulated financial institutions.
                  Agents that hold a real conversation, plug into the systems
                  you run, and show their work.
                </p>
              </div>

              {/* Hairline divider */}
              <div className="mt-6 sm:mt-8 md:mt-10 h-px bg-gray-200 w-full" />

              {/* Row 2 — three interactive rows */}
              <div className="mt-6 sm:mt-8 md:mt-10 grid sm:grid-cols-3 gap-2 sm:gap-3">
                {FEATURE_ROWS.map((row) => (
                  <button
                    key={row.number}
                    type="button"
                    className="group flex items-center justify-between text-left text-sm bg-[#F4F3F3] hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4"
                  >
                    <span className="flex items-center text-[#191919]">
                      <span className="text-[#191919]/40">{row.number}</span>
                      <span className="mx-2 text-[#191919]/30">/</span>
                      <span className="font-medium">{row.label}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
