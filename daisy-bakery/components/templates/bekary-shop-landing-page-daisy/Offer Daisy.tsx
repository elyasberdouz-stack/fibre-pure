/**
 * Gift boxes — build-a-box: pick a size, a ribbon colour and write a gift note; the photo and card update live
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
 *  One photo per box size, in `img` below; paste your own CDN link to swap a photo. */

const SIZES = [
  { n: 6, name: 'Petite', price: 14, img: 'https://images.unsplash.com/photo-1554175231-8367073ba4e3?auto=format&fit=crop&w=1200&h=1000&q=80', alt: 'Six chocolate chip cookies in a dark gift tin' },
  { n: 12, name: 'Classic', price: 26, img: 'https://images.unsplash.com/photo-1640122438487-e5ad5f4b4fe4?auto=format&fit=crop&w=1200&h=1000&q=80', alt: 'A kraft gift box packed with twelve mixed cookies' },
  { n: 24, name: 'Party', price: 48, img: 'https://images.unsplash.com/photo-1772651392135-b891a5e4f8a3?auto=format&fit=crop&w=1200&h=1000&q=80', alt: 'A large gift box with an assortment of cookies' },
]
const RIBBONS = [
  { name: 'Caramel', c: '#C9742B' },
  { name: 'Rose', c: '#E06C7D' },
  { name: 'Sage', c: '#6FA66A' },
  { name: 'Sky', c: '#5D92D6' },
]
const PERKS = ['Ships in 24 h', 'Handwritten card', 'Recyclable box']
const NOTE_MAX = 120
const DEFAULT_NOTE = 'Happy birthday, Nadia! Save one for me.'

const EYEBROW = 'Gift boxes'
const TITLE = 'Build a box, we’ll tie the bow'
const TEXT = 'A baker’s mix of our six flavours, packed by hand and finished with a ribbon and a handwritten card.'

const FRAME_W = 1600
const FRAME_H = 1100

function addToCart(qty: number, item: string) {
  window.dispatchEvent(new CustomEvent('daisy:add', { detail: { qty, item } }))
}

/* ------------------------------------------------------------------ */
/* Shared state for both layouts                                       */
/* ------------------------------------------------------------------ */

function useBox() {
  const [size, setSize] = useState(1)
  const [ribbon, setRibbon] = useState(0)
  const [note, setNote] = useState(DEFAULT_NOTE)
  return { size, setSize, ribbon, setRibbon, note, setNote, s: SIZES[size], r: RIBBONS[ribbon] }
}
type Box = ReturnType<typeof useBox>

/* ------------------------------------------------------------------ */
/* Desktop (1600 artboard)                                             */
/* ------------------------------------------------------------------ */

function GiftDesktop() {
  const box = useBox()
  return (
    <Artboard height={FRAME_H}>
      <Reveal style={at(80, 120)}>
        <Eyebrow>{EYEBROW}</Eyebrow>
      </Reveal>
      <Reveal delay={200} style={at(80, 152, 760)}>
        <h2 className="font-['Young_Serif',serif] text-[60px] leading-[66px] text-[#3B2317]">{TITLE}</h2>
      </Reveal>
      <Reveal delay={300} style={at(80, 238, 640)}>
        <p className="text-[18px] leading-[30px] text-[#3B2317]/65">{TEXT}</p>
      </Reveal>
      <Reveal delay={300} style={at(920, 254, 600)}>
        <Perks className="justify-end" />
      </Reveal>

      <Reveal delay={100} style={at(80, 340, 760, 640)}>
        <Preview box={box} noteW={400} />
      </Reveal>
      <Reveal delay={220} style={at(864, 340, 656, 640)}>
        <Options box={box} />
      </Reveal>
    </Artboard>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile (< 768px)                                                    */
/* ------------------------------------------------------------------ */

function GiftMobile() {
  const box = useBox()
  return (
    <div className="px-[20px] py-[72px]">
      <Reveal>
        <Eyebrow>{EYEBROW}</Eyebrow>
      </Reveal>
      <Reveal delay={200}>
        <h2 className="mt-[12px] font-['Young_Serif',serif] text-[36px] leading-[42px] text-[#3B2317]">{TITLE}</h2>
      </Reveal>
      <Reveal delay={300}>
        <p className="mt-[14px] text-[16px] leading-[26px] text-[#3B2317]/65">{TEXT}</p>
        <Perks className="mt-[18px]" />
      </Reveal>
      <Reveal className="mt-[28px] h-[400px]">
        <Preview box={box} noteW={260} />
      </Reveal>
      <Reveal className="mt-[16px]">
        <Options box={box} />
      </Reveal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Perks({ className = '' }: { className?: string }) {
  return (
    <div className={'flex flex-wrap gap-[8px] ' + className}>
      {PERKS.map((p) => (
        <span key={p} className="inline-flex h-[44px] items-center gap-[8px] rounded-full border border-[#3B2317]/12 bg-white/55 px-[16px] text-[14.5px] font-medium text-[#3B2317]">
          <span className="h-[6px] w-[6px] rounded-full bg-[#C9742B]" />
          {p}
        </span>
      ))}
    </div>
  )
}

/** Photo of the chosen box size (cross-fades), a ribbon sash in the chosen colour, and the gift-note card */
function Preview({ box, noteW }: { box: Box; noteW: number }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[32px] bg-[#C89D6A]">
      {SIZES.map((o, i) => (
        <img
          key={o.n}
          src={o.img}
          alt={i === box.size ? o.alt : ''}
          aria-hidden={i !== box.size}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ opacity: i === box.size ? 1 : 0, transform: i === box.size ? 'scale(1)' : 'scale(1.06)' }}
        />
      ))}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25),transparent_30%,transparent_60%,rgba(0,0,0,0.35))]" />

      {/* size chip */}
      <span className="absolute left-[22px] top-[22px] rounded-full bg-[#FBF4EA]/95 px-[14px] py-[8px] text-[14px] font-semibold text-[#3B2317] backdrop-blur-[8px]">
        {box.s.n} cookies · {box.s.name}
      </span>

      {/* ribbon sash across the top-right corner */}
      <div className="pointer-events-none absolute right-[-74px] top-[38px] w-[300px] rotate-45 py-[9px] text-center text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_8px_18px_-8px_rgba(0,0,0,0.5)] transition-colors duration-500" style={{ background: box.r.c }}>
        Gift wrapped
      </div>

      {/* gift note */}
      <div className="absolute bottom-[24px] left-[24px] -rotate-[2deg] rounded-[16px] bg-white px-[20px] pb-[14px] pt-[18px]" style={{ width: noteW }}>
        <span className="absolute -top-[9px] left-[24px] h-[18px] w-[18px] rounded-full border-[4px] bg-white transition-colors duration-500" style={{ borderColor: box.r.c }} />
        <p className="min-h-[50px] break-words font-['Young_Serif',serif] text-[17px] leading-[25px] text-[#3B2317]">{box.note.trim() || 'Your note goes here'}</p>
        <p className="mt-[6px] text-right text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[#3B2317]/40">Daisy Bakehouse</p>
      </div>
    </div>
  )
}

function Options({ box }: { box: Box }) {
  return (
    <div className="flex h-full flex-col rounded-[32px] border border-white/70 bg-[#FFFDF6] p-[24px] md:p-[36px]">
      <Label n="1" text="Box size" />
      <div className="mt-[14px] grid grid-cols-3 gap-[10px]">
        {SIZES.map((o, i) => (
          <button
            key={o.n}
            onClick={() => box.setSize(i)}
            aria-pressed={box.size === i}
            className={
              'rounded-[20px] border px-[14px] py-[14px] text-left transition-[border-color,background-color,transform] duration-300 hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9742B] md:px-[18px] ' +
              (box.size === i ? 'border-[#3B2317] bg-[#3B2317] text-[#FBF4EA]' : 'border-[#3B2317]/12 bg-white text-[#3B2317] hover:border-[#3B2317]/35')
            }
          >
            <span className="block font-['Young_Serif',serif] text-[28px] leading-none">{o.n}</span>
            <span className="mt-[8px] block text-[14px] font-medium opacity-80">{o.name}</span>
            <span className="mt-[2px] block text-[14px] tabular-nums opacity-60">${o.price}</span>
          </button>
        ))}
      </div>

      <div className="mt-[28px]">
        <Label n="2" text="Ribbon" />
        <div className="mt-[14px] flex flex-wrap gap-[10px]">
          {RIBBONS.map((o, i) => (
            <button
              key={o.name}
              onClick={() => box.setRibbon(i)}
              aria-pressed={box.ribbon === i}
              className={
                'inline-flex h-[44px] items-center gap-[9px] rounded-full border pl-[8px] pr-[16px] text-[14.5px] font-medium text-[#3B2317] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9742B] ' +
                (box.ribbon === i ? 'border-[#3B2317] bg-white' : 'border-[#3B2317]/12 bg-white/60 hover:border-[#3B2317]/35')
              }
            >
              <span className="h-[28px] w-[28px] rounded-full ring-2 ring-white" style={{ background: o.c }} />
              {o.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[28px]">
        <div className="flex items-center justify-between">
          <Label n="3" text="Gift note" />
          <span className="text-[13px] tabular-nums text-[#3B2317]/50">
            {box.note.length}/{NOTE_MAX}
          </span>
        </div>
        <textarea
          id="gift-note"
          aria-label="Gift note"
          value={box.note}
          maxLength={NOTE_MAX}
          onChange={(e) => box.setNote(e.target.value)}
          rows={3}
          placeholder="Write a few words for the card"
          className="mt-[14px] h-[104px] w-full resize-none rounded-[18px] border border-[#3B2317]/12 bg-white px-[18px] py-[14px] text-[15.5px] leading-[24px] text-[#3B2317] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#3B2317]/35 focus:border-[#C9742B] focus:shadow-[0_0_0_4px_rgba(200,116,43,0.15)]"
        />
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-[14px] border-t border-[#3B2317]/10 pt-[22px] max-md:mt-[24px]">
        <div>
          <span className="block text-[13.5px] text-[#3B2317]/55">
            {box.s.name} box · {box.r.name} ribbon
          </span>
          <span className="mt-[4px] block font-['Young_Serif',serif] text-[34px] leading-none tabular-nums">${box.s.price}</span>
        </div>
        <div className="w-full sm:w-[260px]">
          <CartButton label="Add gift box" price={`$${box.s.price}`} onClick={() => addToCart(1, `${box.s.name} gift box`)} />
        </div>
      </div>
    </div>
  )
}

function Label({ n, text }: { n: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-[10px] text-[15px] font-semibold text-[#3B2317]">
      <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[#F2DFC2] text-[12.5px] text-[#8A4B17]">{n}</span>
      {text}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Default export                                                      */
/* ------------------------------------------------------------------ */

export default function GiftBoxes() {
  return <Responsive id="gift-boxes" className="bg-[#F1E2CD]" desktop={<GiftDesktop />} mobile={<GiftMobile />} />
}

/* ================================================================== */
/* Section-local helpers — kept in this file so the section is 100%    */
/* self-contained.                                                     */
/* ================================================================== */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[10px] text-[13px] font-semibold uppercase tracking-[0.2em] text-[#C9742B]">
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
        'group/btn relative flex h-[52px] w-full items-center justify-between overflow-hidden rounded-full px-[22px] text-[15.5px] font-semibold text-[#FBF4EA] transition-[transform,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_16px_30px_-14px_rgba(58,34,22,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9742B] active:scale-[0.97] ' +
        (ok ? 'bg-[#6E8B3C]' : 'bg-[#3B2317]')
      }
    >
      {!ok && <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-[#C9742B] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-x-100" />}
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
    <section id={id} className={"relative w-full scroll-mt-[72px] font-['Outfit',sans-serif] text-[#3B2317] antialiased " + className}>
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
