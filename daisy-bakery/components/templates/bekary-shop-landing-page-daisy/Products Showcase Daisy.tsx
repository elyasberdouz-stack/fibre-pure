/**
 * Cookies — "Baked this morning" product grid (6 cookies, filter tabs, Add to cart)
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 * Add to cart fires a window 'daisy:add' event; the navbar in Hero.tsx listens and updates the cart badge.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Outfit:wght@400;500;600&display=swap'

/** Image links — free photos from Unsplash (unsplash.com/license: free for commercial use, no attribution needed).
 *  Each link sits next to its cookie below; paste your own CDN link in `img` to swap a photo. */

type Cat = 'Classic' | 'Sandwich' | 'Seasonal'
type Item = { id: string; name: string; note: string; price: number; cat: Cat; img: string; pos?: string; tag?: string }

const COOKIES: Item[] = [
  { id: 'daisy', name: 'Daisy Sandwich', note: 'Butter shortbread, hazelnut cocoa cream', price: 10, cat: 'Sandwich', img: 'https://images.unsplash.com/photo-1577149657696-55f1ee62e69e?auto=format&fit=crop&w=900&h=675&q=80', pos: '50% 60%', tag: 'Bestseller' },
  { id: 'chip', name: 'Brown Butter Chip', note: '70% dark chocolate, flaky sea salt', price: 9, cat: 'Classic', img: 'https://images.unsplash.com/photo-1634188023615-7e08901193b6?auto=format&fit=crop&w=900&h=675&q=80' },
  { id: 'cocoa', name: 'Double Cocoa', note: 'Dutch cocoa dough, molten dark chocolate', price: 9, cat: 'Classic', img: 'https://images.unsplash.com/photo-1654178990976-b88c403b3257?auto=format&fit=crop&w=900&h=675&q=80' },
  { id: 'linzer', name: 'Raspberry Linzer', note: 'Almond shortbread, tart raspberry jam', price: 10, cat: 'Sandwich', img: 'https://images.unsplash.com/photo-1713288971605-92a285c20f56?auto=format&fit=crop&w=900&h=675&q=80' },
  { id: 'matcha', name: 'Matcha White Chip', note: 'Uji matcha, white chocolate chunks', price: 11, cat: 'Seasonal', img: 'https://images.unsplash.com/photo-1757345016219-7b3b8a1b9fba?auto=format&fit=crop&w=900&h=675&q=80', tag: 'New' },
  { id: 'lemon', name: 'Lemon Sugar', note: 'Lemon zest, crunchy sugar crust', price: 9, cat: 'Seasonal', img: 'https://images.unsplash.com/photo-1744160252920-967ab9b733ce?auto=format&fit=crop&w=900&h=675&q=80' },
]
const FILTERS: ('All' | Cat)[] = ['All', 'Classic', 'Sandwich', 'Seasonal']

const EYEBROW = 'Cookies'
const TITLE = 'Baked this morning, gone by evening'
const TEXT = 'Six flavours on the counter every day. Each one comes in a box of six, baked in small batches of 24.'

/** Figma-style frame */
const FRAME_W = 1600
const FRAME_H = 1604
const CARD_W = 464
const CARD_H = 520
const GAP = 24

function addToCart(qty: number, item: string) {
  window.dispatchEvent(new CustomEvent('daisy:add', { detail: { qty, item } }))
}

/* ------------------------------------------------------------------ */
/* Desktop (1600 artboard)                                             */
/* ------------------------------------------------------------------ */

function CookiesDesktop() {
  const [filter, setFilter] = useState<'All' | Cat>('All')
  return (
    <Artboard height={FRAME_H}>
      <Reveal style={at(80, 120)}>
        <Eyebrow>{EYEBROW}</Eyebrow>
      </Reveal>
      <Reveal delay={200} style={at(80, 152, 640)}>
        <h2 className="font-['Young_Serif',serif] text-[60px] leading-[66px] text-[#3B2217]">{TITLE}</h2>
      </Reveal>
      <Reveal delay={300} style={at(80, 304, 620)}>
        <p className="text-[18px] leading-[30px] text-[#3B2217]/65">{TEXT}</p>
      </Reveal>
      <Reveal delay={300} style={at(920, 320, 600)}>
        <Tabs value={filter} onChange={setFilter} className="justify-end" />
      </Reveal>

      {COOKIES.map((c, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const dim = filter !== 'All' && c.cat !== filter
        return (
          <Reveal key={c.id} delay={100 * col + 80 * row} style={at(80 + col * (CARD_W + GAP), 420 + row * (CARD_H + GAP), CARD_W, CARD_H)}>
            <CookieCard c={c} dim={dim} imgH={333} />
          </Reveal>
        )
      })}
    </Artboard>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile (< 768px)                                                    */
/* ------------------------------------------------------------------ */

function CookiesMobile() {
  const [filter, setFilter] = useState<'All' | Cat>('All')
  const list = COOKIES.filter((c) => filter === 'All' || c.cat === filter)
  return (
    <div className="px-[20px] py-[72px]">
      <Reveal>
        <Eyebrow>{EYEBROW}</Eyebrow>
      </Reveal>
      <Reveal delay={200}>
        <h2 className="mt-[12px] font-['Young_Serif',serif] text-[36px] leading-[42px] text-[#3B2217]">{TITLE}</h2>
      </Reveal>
      <Reveal delay={300}>
        <p className="mt-[14px] text-[16px] leading-[26px] text-[#3B2217]/65">{TEXT}</p>
      </Reveal>
      <div className="-mx-[20px] mt-[24px] overflow-x-auto px-[20px] [scrollbar-width:none]">
        <Tabs value={filter} onChange={setFilter} className="w-max flex-nowrap" />
      </div>
      <div className="mt-[24px] grid gap-[16px]">
        {list.map((c, i) => (
          <Reveal key={c.id} delay={i * 80}>
            <CookieCard c={c} imgH={250} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Tabs({ value, onChange, className = '' }: { value: 'All' | Cat; onChange: (v: 'All' | Cat) => void; className?: string }) {
  return (
    <div role="tablist" aria-label="Filter cookies" className={'flex flex-wrap gap-[8px] ' + className}>
      {FILTERS.map((f) => (
        <button
          key={f}
          role="tab"
          aria-selected={value === f}
          onClick={() => onChange(f)}
          className={
            'h-[44px] rounded-full border px-[18px] text-[15px] font-medium transition-[background-color,border-color,color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8742B] ' +
            (value === f ? 'border-[#3B2217] bg-[#3B2217] text-[#FBF4EA]' : 'border-[#3B2217]/15 bg-white/60 text-[#3B2217] hover:border-[#3B2217]/40')
          }
        >
          {f}
        </button>
      ))}
    </div>
  )
}

function CookieCard({ c, dim = false, imgH }: { c: Item; dim?: boolean; imgH: number }) {
  return (
    <article
      className={
        'group flex h-full flex-col rounded-[28px] border border-white/70 bg-[#FFFCF6] p-[10px] transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[4px] ' +
        (dim ? 'scale-[0.97] opacity-35 grayscale-[40%]' : '')
      }
    >
      <div className="relative overflow-hidden rounded-[20px] bg-[#F3DFC3]" style={{ height: imgH }}>
        <img src={c.img} alt={`${c.name} cookies`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" style={{ objectPosition: c.pos ?? '50% 50%' }} />
        <span className="absolute inset-x-0 top-0 h-[90px] bg-[linear-gradient(180deg,rgba(0,0,0,0.28),transparent)]" />
        {c.tag && <span className="absolute left-[14px] top-[14px] rounded-full bg-[#FBF4EA] px-[11px] py-[5px] text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#3B2217]">{c.tag}</span>}
        <span className="absolute right-[14px] top-[14px] rounded-full bg-black/25 px-[10px] py-[4px] text-[12px] font-medium text-white backdrop-blur-[6px]">{c.cat}</span>
      </div>
      <div className="flex flex-1 flex-col px-[10px] pb-[8px] pt-[20px]">
        <div className="flex items-baseline justify-between gap-[12px]">
          <h3 className="font-['Young_Serif',serif] text-[24px] leading-[30px] text-[#3B2217]">{c.name}</h3>
          <span className="shrink-0 text-[13px] text-[#3B2217]/55">Box of 6</span>
        </div>
        <p className="mt-[6px] text-[15px] leading-[22px] text-[#3B2217]/65">{c.note}</p>
        <div className="mt-auto pt-[20px]">
          <CartButton label="Add to cart" price={`$${c.price}`} onClick={() => addToCart(1, c.name)} />
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Default export                                                      */
/* ------------------------------------------------------------------ */

export default function Cookies() {
  return <Responsive id="cookies" className="bg-[#F8EFE2]" desktop={<CookiesDesktop />} mobile={<CookiesMobile />} />
}

/* ================================================================== */
/* Section-local helpers — kept in this file so the section is 100%    */
/* self-contained.                                                     */
/* ================================================================== */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[10px] text-[13px] font-semibold uppercase tracking-[0.2em] text-[#C8742B]">
      <span className="h-[6px] w-[6px] rounded-full bg-current" />
      {children}
    </span>
  )
}

/** Full-width chocolate button: caramel sweeps in from the left, label rolls up, button lifts, shrinks on click. Shows "Added" briefly. */
function CartButton({ label, price, onClick }: { label: string; price: string; onClick: () => void }) {
  const [ok, setOk] = useState(false)
  const t = useRef(0)
  useEffect(() => () => window.clearTimeout(t.current), [])
  const click = () => {
    onClick()
    setOk(true)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setOk(false), 1500)
  }
  return (
    <button
      onClick={click}
      className={
        'group/btn relative flex h-[52px] w-full items-center justify-between overflow-hidden rounded-full px-[22px] text-[15.5px] font-semibold text-[#FBF4EA] transition-[transform,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_16px_30px_-14px_rgba(58,34,22,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8742B] active:scale-[0.97] ' +
        (ok ? 'bg-[#6F8A3C]' : 'bg-[#3B2217]')
      }
    >
      {!ok && <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-[#C8742B] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-x-100" />}
      <span className="relative">{ok ? '✓ Added to cart' : <RollLabel>{label}</RollLabel>}</span>
      <span className="relative tabular-nums opacity-85">{price}</span>
    </button>
  )
}
function RollLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-y-0">
        {children}
      </span>
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
