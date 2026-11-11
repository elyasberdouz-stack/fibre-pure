/**
 * Reviews — rating summary + two endless rows of customer reviews (opposite directions, pause on hover)
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Outfit:wght@400;500;600&display=swap'

/** Image links — free portraits from Unsplash (unsplash.com/license: free for commercial use, no attribution needed),
 *  cropped to the face. Each link sits next to its reviewer below in `img`. */

type Review = { name: string; city: string; order: string; text: string; img: string; stars: number }

const ROW_1: Review[] = [
  { name: 'Amara Okafor', city: 'Leeds', order: 'Classic gift box', stars: 5, img: 'https://images.unsplash.com/photo-1662850886700-4ec19bd30d11?auto=format&fit=crop&crop=faces&w=160&h=160&q=80', text: 'Ordered the Classic box for my mum’s birthday. The note was handwritten and the cookies were still soft two days later.' },
  { name: 'Linh Tran', city: 'Manchester', order: 'Matcha White Chip', stars: 5, img: 'https://images.unsplash.com/photo-1773899337978-b8d83bd9b783?auto=format&fit=crop&crop=faces&w=160&h=160&q=80', text: 'Best cookie I’ve had this year. Not too sweet, and the matcha actually tastes like matcha instead of green sugar.' },
  { name: 'Nadia Rahman', city: 'London', order: 'Party gift box', stars: 5, img: 'https://images.unsplash.com/photo-1760551937527-2bc6cfe45180?auto=format&fit=crop&crop=faces&w=160&h=160&q=80', text: 'Sent a Party box to my team on launch day. Twenty-four cookies were gone before lunch, and three people asked where from.' },
  { name: 'Sofia Marino', city: 'Bristol', order: 'Raspberry Linzer', stars: 5, img: 'https://images.unsplash.com/photo-1630939687530-241d630735df?auto=format&fit=crop&crop=faces&w=160&h=160&q=80', text: 'These taste like the linzers my nonna made at Christmas. Buttery, crumbly, and the jam has real tartness to it.' },
]
const ROW_2: Review[] = [
  { name: 'Marcus Reyes', city: 'Brighton', order: 'Brown Butter Chip', stars: 5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=160&h=160&q=80', text: 'Brown butter with sea salt is dangerous. I ordered one box, then went back for two more in the same week.' },
  { name: 'Arjun Mehta', city: 'Birmingham', order: 'Daisy Sandwich', stars: 5, img: 'https://images.unsplash.com/photo-1757744705465-ea08b0ddc38a?auto=format&fit=crop&crop=faces&w=160&h=160&q=80', text: 'Arrived the next morning, packed so well that not one cookie broke. The hazelnut cream is rich but somehow light.' },
  { name: 'Daniel Mensah', city: 'Glasgow', order: 'Double Cocoa', stars: 5, img: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&crop=faces&w=160&h=160&q=80', text: 'Properly dark, like a brownie in cookie form. Warm it for ten seconds and have it with an espresso after dinner.' },
  { name: 'Tom Becker', city: 'Oxford', order: 'Lemon Sugar', stars: 4, img: 'https://images.unsplash.com/photo-1600603406200-5b2a104684ac?auto=format&fit=crop&crop=faces&w=160&h=160&q=80', text: 'A surprise hit at our picnic. Crunchy edges, soft middle, bright lemon. I’d love a bigger box of just these.' },
]

const EYEBROW = 'Reviews'
const TITLE = 'Loved in lunchboxes, offices and birthday parties'
const TEXT = 'Notes from people who ordered this season.'
const SCORE = '4.9'
const COUNT = '2,314 reviews'

const FRAME_W = 1600
const FRAME_H = 1084
const CARD_W = 420
const CARD_H = 270

/* ------------------------------------------------------------------ */
/* Desktop (1600 artboard)                                             */
/* ------------------------------------------------------------------ */

function ReviewsDesktop() {
  return (
    <Artboard height={FRAME_H}>
      <Reveal style={at(80, 120)}>
        <Eyebrow>{EYEBROW}</Eyebrow>
      </Reveal>
      <Reveal delay={200} style={at(80, 152, 820)}>
        <h2 className="font-['Young_Serif',serif] text-[60px] leading-[66px] text-[#3B2217]">{TITLE}</h2>
      </Reveal>
      <Reveal delay={300} style={at(80, 304, 620)}>
        <p className="text-[18px] leading-[30px] text-[#3B2217]/65">{TEXT}</p>
      </Reveal>
      <Reveal delay={300} style={at(1120, 150, 400)}>
        <Score />
      </Reveal>

      <div style={at(0, 400, FRAME_W, CARD_H)}>
        <Marquee speed={60}>
          {ROW_1.map((r) => (
            <Card key={r.name} r={r} w={CARD_W} h={CARD_H} />
          ))}
        </Marquee>
      </div>
      <div style={at(0, 400 + CARD_H + 24, FRAME_W, CARD_H)}>
        <Marquee speed={60} reverse>
          {ROW_2.map((r) => (
            <Card key={r.name} r={r} w={CARD_W} h={CARD_H} />
          ))}
        </Marquee>
      </div>
    </Artboard>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile (< 768px)                                                    */
/* ------------------------------------------------------------------ */

function ReviewsMobile() {
  return (
    <div className="py-[72px]">
      <div className="px-[20px]">
        <Reveal>
          <Eyebrow>{EYEBROW}</Eyebrow>
        </Reveal>
        <Reveal delay={200}>
          <h2 className="mt-[12px] font-['Young_Serif',serif] text-[36px] leading-[42px] text-[#3B2217]">{TITLE}</h2>
        </Reveal>
        <Reveal delay={300} className="mt-[22px]">
          <Score compact />
        </Reveal>
      </div>
      <div className="mt-[32px] grid gap-[12px]">
        <Marquee speed={40}>
          {ROW_1.map((r) => (
            <Card key={r.name} r={r} w={300} h={250} />
          ))}
        </Marquee>
        <Marquee speed={40} reverse>
          {ROW_2.map((r) => (
            <Card key={r.name} r={r} w={300} h={250} />
          ))}
        </Marquee>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Score({ compact = false }: { compact?: boolean }) {
  return (
    <div className={'flex items-center gap-[20px] ' + (compact ? '' : 'justify-end')}>
      <span className={"font-['Young_Serif',serif] leading-none text-[#3B2217] " + (compact ? 'text-[64px]' : 'text-[96px]')}>{SCORE}</span>
      <span>
        <Stars n={5} size={compact ? 18 : 22} />
        <span className={'mt-[8px] block text-[#3B2217]/65 ' + (compact ? 'text-[14.5px]' : 'text-[16px]')}>Average from {COUNT}</span>
        <span className="mt-[10px] inline-flex items-center gap-[8px] rounded-full bg-[#3B2217] px-[12px] py-[6px] text-[13px] font-medium text-[#FAF4EB]">
          <span className="h-[6px] w-[6px] rounded-full bg-[#F3C28E]" />
          97% would order again
        </span>
      </span>
    </div>
  )
}

function Card({ r, w, h }: { r: Review; w: number; h: number }) {
  return (
    <figure className="flex shrink-0 flex-col rounded-[26px] border border-white/70 bg-[#FFFCF6] p-[22px] transition-[transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[4px] md:p-[26px]" style={{ width: w, height: h }}>
      <div className="flex items-center justify-between">
        <Stars n={r.stars} size={16} />
        <span className="rounded-full bg-[#F3DFC3]/70 px-[10px] py-[4px] text-[12px] font-medium text-[#8A4B16]">{r.order}</span>
      </div>
      <blockquote className="mt-[14px] text-[15.5px] leading-[24px] text-[#3B2217]/80 md:text-[16.5px] md:leading-[26px]">“{r.text}”</blockquote>
      <figcaption className="mt-auto flex items-center gap-[12px] pt-[14px]">
        <img src={r.img} alt={r.name} loading="lazy" className="h-[44px] w-[44px] rounded-full object-cover ring-2 ring-[#F3DFC3]" />
        <span className="leading-tight">
          <span className="block text-[15px] font-semibold text-[#3B2217]">{r.name}</span>
          <span className="text-[13px] text-[#3B2217]/55">
            {r.city} · Verified order
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Default export                                                      */
/* ------------------------------------------------------------------ */

export default function Reviews() {
  return <Responsive id="reviews" className="bg-[#F9EEE2]" desktop={<ReviewsDesktop />} mobile={<ReviewsMobile />} />
}

/* ================================================================== */
/* Section-local helpers — kept in this file so the section is 100%    */
/* self-contained.                                                     */
/* ================================================================== */

function Stars({ n, size }: { n: number; size: number }) {
  return (
    <span className="inline-flex gap-[3px]" aria-label={`${n} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8Z" fill={i < n ? '#C9752A' : 'rgba(58,34,22,0.15)'} />
        </svg>
      ))}
    </span>
  )
}

/** Endless row: children repeated `copies` times, slid left (or right) with the Web Animations API; pauses on hover */
function Marquee({ children, speed = 60, reverse = false, copies = 3 }: { children: ReactNode; speed?: number; reverse?: boolean; copies?: number }) {
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = track.current
    if (!el || prefersReduced()) return
    const dist = el.scrollWidth / copies
    const frames = [{ transform: 'translateX(0)' }, { transform: `translateX(-${100 / copies}%)` }]
    const a = el.animate(reverse ? [...frames].reverse() : frames, { duration: (dist / speed) * 1000, iterations: Infinity })
    const stop = () => a.pause()
    const go = () => a.play()
    el.addEventListener('mouseenter', stop)
    el.addEventListener('mouseleave', go)
    return () => {
      a.cancel()
      el.removeEventListener('mouseenter', stop)
      el.removeEventListener('mouseleave', go)
    }
  }, [speed, reverse, copies])
  return (
    <div className="w-full overflow-hidden">
      <div ref={track} className="flex w-max">
        {Array.from({ length: copies }).map((_, k) => (
          <div key={k} className="flex gap-[20px] pr-[20px]" aria-hidden={k > 0}>
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[10px] text-[13px] font-semibold uppercase tracking-[0.2em] text-[#C9752A]">
      <span className="h-[6px] w-[6px] rounded-full bg-current" />
      {children}
    </span>
  )
}

/** Fades, lifts and un-blurs on enter; resets on leave so it replays every time */
function Reveal({ children, delay = 0, style, className = '' }: { children: ReactNode; delay?: number; style?: CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const reduced = prefersReduced()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])
  const on = shown || reduced
  const ease = 'cubic-bezier(0.16,1,0.3,1)'
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(64px) scale(0.96)',
        filter: on ? 'none' : 'blur(12px)',
        transition: reduced ? 'none' : `opacity 1100ms ${ease} ${delay}ms, transform 1100ms ${ease} ${delay}ms, filter 1100ms ${ease} ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ---------- scale + layout ---------- */

function useViewportWidth() {
  const [w, setW] = useState(() => (typeof document === 'undefined' ? FRAME_W : document.documentElement.clientWidth))
  useEffect(() => {
    const on = () => setW(document.documentElement.clientWidth)
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}
function useDesignScale() {
  return useViewportWidth() / FRAME_W
}
function useIsDesktop() {
  return useViewportWidth() >= 768
}
function at(left: number, top: number, width?: number, height?: number): CSSProperties {
  return { position: 'absolute', left, top, width, height }
}
function Artboard({ height, children }: { height: number; children: ReactNode }) {
  const s = useDesignScale()
  return (
    <div className="relative w-full overflow-hidden" style={{ height: height * s }}>
      <div className="absolute left-0 top-0" style={{ width: FRAME_W, height, transform: `scale(${s})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  )
}
function Responsive({ id, className, desktop, mobile }: { id: string; className: string; desktop: ReactNode; mobile: ReactNode }) {
  useGoogleFonts()
  const isDesktop = useIsDesktop()
  return (
    <section id={id} className={"relative w-full scroll-mt-[72px] font-['Outfit',sans-serif] text-[#3B2217] antialiased " + className}>
      {isDesktop ? desktop : mobile}
    </section>
  )
}
function useGoogleFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_URL}"]`)) return
    const l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = FONT_URL
    document.head.appendChild(l)
  }, [])
}
function prefersReduced() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
