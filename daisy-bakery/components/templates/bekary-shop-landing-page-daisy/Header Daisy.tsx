/**
 * Hero — "Daisy Bakehouse" cookie bakery header
 * (floating glass navbar + a scroll-driven "ingredients → daisy sandwich cookies" video: the video scrubs with the
 *  scroll, one step tag at a time follows the action, and the last tag is an Add-to-cart card on the plate)
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Outfit:wght@400;500;600&display=swap'

/** CDN link of the cookie video */
const COOKIE_VIDEO = 'https://cdn.jiro.build/Short%20LP/Daisy/Daisy.mp4'

const VIDEO_RATIO = 16 / 9
const FRAME_W = 1600
const FRAME_H = 900

const BRAND = 'Daisy'
const BRAND_SUB = 'Bakehouse'
const NAV_LINKS = ['Cookies', 'Gift boxes', 'Reviews', 'Contact']

const CHOC = '#3B2217' // chocolate — text + dark buttons
const CARAMEL = '#C8742B' // accent

/** Colour set for one step card */
type Theme = { bg: string; border: string; icon: string; iconFg: string; accent: string; text: string; sub: string }
const T = (bg: string, icon: string, accent: string, dark = false): Theme => ({
  bg,
  border: dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.7)',
  icon,
  iconFg: '#FFFEFE',
  accent,
  text: dark ? '#FBF0E4' : '#2F1B11',
  sub: dark ? 'rgba(251,241,228,0.7)' : 'rgba(46,27,16,0.62)',
})

/**
 * Every stage of the video, one tag each, shown one after another. t = second the stage starts.
 * x / y = where the tag's dot sits in the video (0…1); side = which way the card opens; theme = card colours.
 */
type Step = { id: string; label: string; title: string; note: string; t: number; x: number; y: number; side: 'left' | 'right'; icon: IconName; theme: Theme }
const STEPS: Step[] = [
  { id: 'flour', label: 'Flour', title: 'Stone-milled flour', note: 'Soft wheat from a local mill', t: 0.3, x: 0.665, y: 0.34, side: 'right', icon: 'sack', theme: T('#FEFDF8', '#B9A488', '#8D7756') },
  { id: 'sugar', label: 'Sugar', title: 'Golden cane sugar', note: 'Just enough — never too sweet', t: 0.95, x: 0.665, y: 0.42, side: 'right', icon: 'cube', theme: T('#F2EDFE', '#9A7BE1', '#6D48B9') },
  { id: 'butter', label: 'Butter', title: 'Cultured butter', note: 'Real Normandy butter, never margarine', t: 1.45, x: 0.665, y: 0.5, side: 'right', icon: 'butter', theme: T('#FEF7CC', '#E8B921', '#9A7401') },
  { id: 'egg', label: 'Egg', title: 'One free-range egg', note: 'From happy hens down the road', t: 2.0, x: 0.665, y: 0.36, side: 'right', icon: 'egg', theme: T('#FEE8D7', '#F18B3C', '#B5560F') },
  { id: 'knead', label: 'Knead', title: 'Kneaded by hand', note: 'Rested overnight for a tender bite', t: 3.4, x: 0.565, y: 0.56, side: 'right', icon: 'ball', theme: T('#F6E8D1', '#C99A5A', '#8B5A20') },
  { id: 'roll', label: 'Roll', title: 'Rolled out thin', note: 'Even 5 mm, so every cookie bakes alike', t: 4.3, x: 0.69, y: 0.45, side: 'right', icon: 'pin', theme: T('#E5F1E1', '#6EA76A', '#3D6A38') },
  { id: 'cut', label: 'Cut', title: 'Cut into daisies', note: 'Every cookie pressed by hand', t: 4.85, x: 0.69, y: 0.5, side: 'right', icon: 'flower', theme: T('#E3EFFA', '#5C93D6', '#2A5D99') },
  { id: 'bake', label: 'Bake', title: 'Baked golden', note: '11 minutes at 175 °C, in small batches', t: 5.9, x: 0.7, y: 0.62, side: 'right', icon: 'oven', theme: T('#FFE2C3', '#E0731E', '#A2470B') },
  { id: 'fill', label: 'Fill', title: 'Hazelnut cocoa cream', note: 'Spread thick while the cookies are warm', t: 6.6, x: 0.665, y: 0.4, side: 'right', icon: 'spoon', theme: T('#4A2A1B', '#9A6243', '#F3C38E', true) },
  { id: 'sandwich', label: 'Pair', title: 'Sandwiched in pairs', note: 'Two daisies, one creamy middle', t: 7.3, x: 0.7, y: 0.52, side: 'right', icon: 'stack', theme: T('#FDE4E7', '#E06C7D', '#A9364A') },
  { id: 'serve', label: 'Serve', title: 'Ready for your box', note: '', t: 8.3, x: 0.64, y: 0.45, side: 'left', icon: 'box', theme: T('#FBF4EA', '#C8742B', '#C8742B') },
]

const PRODUCT = { name: 'Daisy Sandwich Box', note: 'Hazelnut cocoa cream · 12 cookies', price: 18, perks: ['Baked today', 'Gift-ready box', 'Ships in 24h'] }

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/** How many extra screens of scrolling scrub through the whole video (higher = video moves slower per scroll) */
const SCROLL_SCREENS = 7
/** Seconds the video takes to catch up with the scroll (higher = softer, more cinematic) */
const SMOOTHING = 0.45

function HeroCookies({ mobile, addToCart }: { mobile: boolean; addToCart: () => void }) {
  const track = useRef<HTMLElement>(null) // tall scroll track
  const box = useRef<HTMLDivElement>(null) // sticky screen
  const video = useRef<HTMLVideoElement>(null)
  const size = useElementSize(box)
  const [time, setTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [added, setAdded] = useState(false)
  useScrollScrub(track, video, setTime, setProgress)
  useVideoInMemory(video, COOKIE_VIDEO)

  // the sticky screen is one viewport tall; the video covers it (centred), tags follow the cover rect
  // phones see a narrow slice of the video, so it pans to the plate for the last stage
  const pan = mobile ? (time >= 8.2 ? 84 : 50) : 50
  const rect = coverRect(size.w, size.h, VIDEO_RATIO, pan / 100, 0.5)
  const s = rect.w / FRAME_W
  const toPx = (p: { x: number; y: number }) => ({ left: rect.x + p.x * rect.w, top: rect.y + p.y * rect.h })

  const current = stepAt(time)
  const step = STEPS[current]
  const add = () => {
    addToCart()
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <section ref={track} className="relative w-full bg-[#F9EFE3]" style={{ height: `${(SCROLL_SCREENS + 1) * 100}vh` }}>
      <div ref={box} className="sticky top-0 h-[100vh] w-full overflow-hidden supports-[height:100svh]:h-[100svh]">
        <video ref={video} className="absolute inset-0 h-full w-full object-cover transition-[object-position] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ objectPosition: `${pan}% 50%` }} src={COOKIE_VIDEO} muted playsInline preload="auto" aria-label="Daisy cookies being made, from flour to filled sandwich cookies" />

        {/* one tag at a time, following the action */}
        {mobile ? (
          <div className="absolute inset-x-[14px] bottom-[64px] z-20">
            <PopIn key={step.id}>{step.id === 'serve' ? <ProductCard added={added} onAdd={add} /> : <StepCard step={step} index={current} compact />}</PopIn>
          </div>
        ) : (
          <StepTag step={step} index={current} style={toPx(step)} scale={s} added={added} onAdd={add} />
        )}

        {/* scroll hint + progress */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="flex justify-center pb-[18px]">
            <span className="inline-flex items-center gap-[10px] rounded-full border border-white/60 bg-[#FBF4EA]/80 px-[14px] py-[7px] font-['Outfit',sans-serif] text-[12.5px] font-medium text-[#3B2217] shadow-[0_10px_24px_-16px_rgba(58,34,22,0.5)] backdrop-blur-[12px]">
              <span className="text-[#C8742B]">
                Step {String(current + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
              </span>
              <span className="h-[12px] w-px bg-[#3B2217]/20" />
              {progress < 0.98 ? (
                <>
                  Scroll to bake <ScrollMouse />
                </>
              ) : (
                'Fresh out of the oven'
              )}
            </span>
          </div>
          <div className="h-[3px] w-full bg-[#3B2217]/10">
            <div className="h-full bg-[#C8742B]" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Desktop: a dot on the action + a glass card. It glides to each stage's spot; on the last stage it becomes the product card. */
function StepTag({ step, index, style, scale, added, onAdd }: { step: Step; index: number; style: CSSProperties; scale: number; added: boolean; onAdd: () => void }) {
  const left = step.side === 'left'
  return (
    <div className="absolute z-20 transition-[left,top] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={style}>
      <div style={{ transform: left ? `translate(-100%, -48px) scale(${scale})` : `translateY(-50%) scale(${scale})`, transformOrigin: left ? 'right top' : 'left center' }}>
        <div className={'flex ' + (left ? 'flex-row-reverse items-start [&>span]:mt-[40px]' : 'items-center')}>
          <span className="relative flex h-[16px] w-[16px] shrink-0 items-center justify-center">
            <PingRing color="#FFFEFE" />
            <span className="h-[10px] w-[10px] rounded-full border-2 border-white shadow-[0_0_0_4px_rgba(255,255,255,0.35)] transition-colors duration-500" style={{ background: step.theme.icon }} />
          </span>
          <span className={'h-px shrink-0 ' + (left ? 'w-[22px] ' : 'w-[38px] ') + (left ? 'bg-[linear-gradient(270deg,rgba(255,255,255,0.9),rgba(255,255,255,0.4))]' : 'bg-[linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0.4))]')} />
          {/* key = step id so the card re-animates on every stage */}
          <PopIn key={step.id}>{step.id === 'serve' ? <ProductCard added={added} onAdd={onAdd} /> : <StepCard step={step} index={index} />}</PopIn>
        </div>
      </div>
    </div>
  )
}

function StepCard({ step, index, compact = false }: { step: Step; index: number; compact?: boolean }) {
  const th = step.theme
  return (
    <div
      className={'flex items-center rounded-[22px] border shadow-[0_18px_40px_-20px_rgba(46,27,16,0.6)] backdrop-blur-[14px] ' + (compact ? 'gap-[14px] p-[10px] pr-[16px]' : 'min-w-[350px] gap-[16px] p-[14px] pr-[24px]')}
      style={{ background: th.bg, borderColor: th.border }}
    >
      <span className={'relative grid shrink-0 place-items-center overflow-hidden rounded-[13px] ' + (compact ? 'h-[50px] w-[50px] rounded-[15px]' : 'h-[64px] w-[64px] rounded-[18px]')} style={{ background: th.icon, color: th.iconFg }}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.35),transparent_60%)]" />
        <span className="relative">
          <StepIcon name={step.icon} size={compact ? 23 : 28} />
        </span>
      </span>
      <span className="min-w-0">
        <span className={"block font-['Outfit',sans-serif] font-semibold uppercase tracking-[0.16em] " + (compact ? 'text-[11px]' : 'text-[12px]')} style={{ color: th.accent }}>
          Step {String(index + 1).padStart(2, '0')} · {step.label}
        </span>
        <span className={"block whitespace-nowrap font-['Young_Serif',serif] " + (compact ? 'mt-[2px] text-[19px] leading-[23px]' : 'mt-[3px] text-[24px] leading-[29px]')} style={{ color: th.text }}>
          {step.title}
        </span>
        <span className={"mt-[2px] block whitespace-nowrap font-['Outfit',sans-serif] " + (compact ? 'text-[13px] leading-[18px]' : 'text-[14.5px] leading-[20px]')} style={{ color: th.sub }}>
          {step.note}
        </span>
      </span>
    </div>
  )
}

/** Last stage: the product card — header like the step cards, then perks, quantity and a full Add-to-cart button */
function ProductCard({ added, onAdd }: { added: boolean; onAdd: () => void }) {
  const [qty, setQty] = useState(1)
  const add = () => {
    for (let k = 0; k < qty; k++) onAdd()
  }
  return (
    <div className="w-full rounded-[24px] border border-white/70 bg-[#FBF4EA]/95 p-[14px] shadow-[0_26px_50px_-22px_rgba(58,34,22,0.6)] backdrop-blur-[14px] md:w-[400px]">
      <div className="flex items-center gap-[16px] pr-[8px]">
        <span className="relative grid h-[64px] w-[64px] shrink-0 place-items-center overflow-hidden rounded-[18px] bg-[#F2DFC2]">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.6),transparent_60%)]" />
          <span className="relative">
            <FlowerMark size={40} />
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-['Outfit',sans-serif] text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C8742B]">Step {String(STEPS.length).padStart(2, '0')} · Serve</span>
          <span className="mt-[3px] block whitespace-nowrap font-['Young_Serif',serif] text-[24px] leading-[29px] text-[#3B2217]">{PRODUCT.name}</span>
          <span className="mt-[2px] block font-['Outfit',sans-serif] text-[14px] text-[#3B2217]/60">{PRODUCT.note}</span>
        </span>
      </div>
      {/* perks */}
      <div className="mt-[14px] flex flex-wrap gap-[8px] border-t border-[#3B2217]/10 pt-[14px]">
        {PRODUCT.perks.map((perk) => (
          <span key={perk} className="inline-flex items-center gap-[6px] rounded-full bg-[#F2DFC2]/70 px-[11px] py-[6px] font-['Outfit',sans-serif] text-[12.5px] font-medium text-[#8B4A16]">
            <span className="h-[5px] w-[5px] rounded-full bg-[#C8742B]" /> {perk}
          </span>
        ))}
      </div>
      {/* quantity + add */}
      <div className="mt-[14px] flex items-center gap-[10px]">
        <div className="flex h-[52px] items-center rounded-[16px] border border-[#3B2217]/12 bg-white/70 font-['Outfit',sans-serif] text-[#3B2217]">
          <button aria-label="One less box" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-[42px] place-items-center text-[20px] transition-colors duration-300 hover:text-[#C8742B]">
            −
          </button>
          <span className="w-[22px] text-center text-[16px] font-semibold" aria-live="polite">
            {qty}
          </span>
          <button aria-label="One more box" onClick={() => setQty((q) => Math.min(9, q + 1))} className="grid h-full w-[42px] place-items-center text-[20px] transition-colors duration-300 hover:text-[#C8742B]">
            +
          </button>
        </div>
        <button
          onClick={add}
          className={
            "group relative flex h-[52px] flex-1 items-center justify-between overflow-hidden rounded-[16px] px-[18px] font-['Outfit',sans-serif] text-[15.5px] font-semibold text-white transition-[transform,background-color] duration-300 hover:-translate-y-[2px] active:scale-[0.98] " +
            (added ? 'bg-[#6F8B3C]' : 'bg-[#3B2217]')
          }
        >
          {!added && <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-[#C8742B] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />}
          <span className="relative">{added ? '✓ Added to cart' : 'Add to cart'}</span>
          <span className="relative">${PRODUCT.price * qty}</span>
        </button>
      </div>
    </div>
  )
}

/** Plays a small pop-in once when mounted (re-keyed on every stage) */
function PopIn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    el.animate([{ opacity: 0, transform: 'translateY(8px) scale(0.97)' }, { opacity: 1, transform: 'none' }], { duration: 650, easing: 'cubic-bezier(0.16,1,0.3,1)' })
  }, [])
  return <div ref={ref}>{children}</div>
}

function stepAt(t: number) {
  let i = 0
  STEPS.forEach((st, k) => {
    if (t >= st.t) i = k
  })
  return i
}

/* ------------------------------------------------------------------ */
/* Fixed navbar                                                        */
/* ------------------------------------------------------------------ */

function Navbar({ cart, bump }: { cart: number; bump: number }) {
  const isDesktop = useIsDesktop()
  const vw = useViewportWidth()
  const vh = useViewportHeight()
  const s = Math.min(vw / FRAME_W, vh / FRAME_H)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  // floating cream glass bar; more solid once the page scrolls (or the menu opens)
  const glass =
    'border border-white/70 backdrop-blur-[18px] transition-[background-color,box-shadow] duration-500 ' +
    (scrolled || open ? 'bg-[#FBF4EA]/95 shadow-[0_16px_40px_-22px_rgba(58,34,22,0.55)]' : 'bg-[#FBF4EA]/85 shadow-[0_12px_30px_-22px_rgba(58,34,22,0.45)]')

  const cartBtn = (
    <button aria-label={`Cart, ${cart} items`} className="relative grid h-[44px] w-[44px] place-items-center rounded-full border border-[#3B2217]/15 bg-white/70 text-[#3B2217] transition-[transform,background-color] duration-300 hover:scale-105 hover:bg-white">
      <BagIcon />
      <CartBadge count={cart} bump={bump} />
    </button>
  )

  if (isDesktop) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50" style={{ height: 96 * s }}>
        <div className="absolute left-0 top-0" style={{ width: vw / s, transform: `scale(${s})`, transformOrigin: 'top left' }}>
          <div className={'pointer-events-auto relative mx-[80px] mt-[20px] flex h-[68px] items-center rounded-full pl-[24px] pr-[12px] ' + glass}>
            <Logo />
            <nav className="absolute left-1/2 flex -translate-x-1/2 gap-[36px] font-['Outfit',sans-serif] text-[15.5px] font-medium text-[#3B2217]">
              {NAV_LINKS.map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size,color] duration-300 hover:bg-[length:100%_1.5px] hover:text-[#C8742B]">
                  {l}
                </a>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-[12px]">
              {cartBtn}
              <PillButton label="Order a box" onClick={() => document.getElementById('gift-boxes')?.scrollIntoView({ behavior: 'smooth' })} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-[12px] top-[12px] z-50">
      <div className={'overflow-hidden rounded-[26px] ' + glass}>
        <div className="flex h-[58px] items-center pl-[14px] pr-[7px]">
          <Logo small />
          <div className="ml-auto flex items-center gap-[8px]">
            {cartBtn}
            <button aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)} className="grid h-[44px] w-[44px] place-items-center rounded-full bg-[#3B2217]">
              <span className="flex flex-col gap-[5px]">
                <span className={'block h-[1.5px] w-[18px] rounded bg-white transition-transform duration-300 ' + (open ? 'translate-y-[6.5px] rotate-45' : '')} />
                <span className={'block h-[1.5px] w-[18px] rounded bg-white transition-opacity duration-300 ' + (open ? 'opacity-0' : '')} />
                <span className={'block h-[1.5px] w-[18px] rounded bg-white transition-transform duration-300 ' + (open ? '-translate-y-[6.5px] -rotate-45' : '')} />
              </span>
            </button>
          </div>
        </div>
        <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
          <div className="overflow-hidden">
            <ul className="px-[16px] pb-[14px]">
              {[...NAV_LINKS, 'Order a box'].map((l) => (
                <li key={l} className="border-t border-[#3B2217]/10">
                  <a href={l === 'Order a box' ? '#gift-boxes' : `#${l.toLowerCase().replace(/ /g, '-')}`} onClick={() => setOpen(false)} className="group flex items-center justify-between py-[13px] font-['Outfit',sans-serif] text-[16px] font-medium text-[#3B2217]">
                    {l}
                    <span className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-rotate-45">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Default export                                                      */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const [cart, setCart] = useState(0)
  const [bump, setBump] = useState(0)
  const isDesktop = useIsDesktop()
  const add = () => {
    setCart((c) => c + 1)
    setBump((b) => b + 1)
  }
  // the sections below the hero add to the same cart through a 'daisy:add' event
  useEffect(() => {
    const on = (e: Event) => {
      const qty = Number((e as CustomEvent<{ qty?: number }>).detail?.qty ?? 1)
      setCart((c) => Math.max(0, c + qty))
      if (qty > 0) setBump((b) => b + 1)
    }
    window.addEventListener('daisy:add', on)
    return () => window.removeEventListener('daisy:add', on)
  }, [])
  return (
    <Responsive>
      <Navbar cart={cart} bump={bump} />
      <HeroCookies key={isDesktop ? 'd' : 'm'} mobile={!isDesktop} addToCart={add} />
    </Responsive>
  )
}

/* ================================================================== */
/* Section-local helpers — kept in this file so the section is 100%    */
/* self-contained.                                                     */
/* ================================================================== */

/* ---------- brand ---------- */

/** A six-petal daisy cookie with a cocoa centre */
function FlowerMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx="16" cy="8.2" r="6.2" fill="#E8B972" stroke="#C8742B" strokeWidth="1.2" transform={`rotate(${a} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="7.4" fill="#E8B972" />
      <circle cx="16" cy="16" r="4.2" fill={CHOC} />
    </svg>
  )
}
function Logo({ small = false }: { small?: boolean }) {
  return (
    <a href="#" aria-label={`${BRAND} ${BRAND_SUB} home`} className="group flex items-center gap-[10px] text-[#3B2217]">
      <span className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[60deg]">
        <FlowerMark size={small ? 30 : 36} />
      </span>
      <span className="leading-none">
        <span className={"block font-['Young_Serif',serif] " + (small ? 'text-[21px]' : 'text-[24px]')}>{BRAND}</span>
        <span className="mt-[3px] block font-['Outfit',sans-serif] text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C8742B]">{BRAND_SUB}</span>
      </span>
    </a>
  )
}
function PingRing({ color = CARAMEL }: { color?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const a = el.animate([{ transform: 'scale(1)', opacity: 0.7 }, { transform: 'scale(2.2)', opacity: 0 }], { duration: 1800, iterations: Infinity, easing: 'cubic-bezier(0,0,0.2,1)' })
    return () => a.cancel()
  }, [])
  return <span ref={ref} className="pointer-events-none absolute inset-0 rounded-full border" style={{ borderColor: color }} />
}
function CartBadge({ count, bump }: { count: number; bump: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || bump === 0 || prefersReduced()) return
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 450, easing: 'cubic-bezier(0.16,1,0.3,1)' })
  }, [bump])
  return (
    <span ref={ref} className="absolute -right-[3px] -top-[3px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#C8742B] px-[4px] font-['Outfit',sans-serif] text-[10px] font-semibold text-white ring-2 ring-[#FBF4EA]">
      {count}
    </span>
  )
}

/* ---------- buttons & icons ---------- */

function RollLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="flex items-center gap-[10px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 flex items-center gap-[10px] translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
        {children}
      </span>
    </span>
  )
}
/** Chocolate pill with a cream arrow circle. Hover: caramel fill sweeps in from the left, label rolls, arrow turns, button lifts. */
function PillButton({ label, lg = false, onClick }: { label: string; lg?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        "group relative inline-flex items-center overflow-hidden rounded-full bg-[#3B2217] font-['Outfit',sans-serif] font-medium text-[#FBF4EA] shadow-[0_12px_26px_-14px_rgba(58,34,22,0.7)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_18px_34px_-14px_rgba(58,34,22,0.7)] active:scale-[0.97] " +
        (lg ? 'h-[54px] gap-[16px] pl-[26px] pr-[6px] text-[16px]' : 'h-[46px] gap-[12px] pl-[20px] pr-[5px] text-[14.5px]')
      }
    >
      <span aria-hidden className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[#C8742B] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      <span className="relative">
        <RollLabel>{label}</RollLabel>
      </span>
      <span className={'relative grid place-items-center rounded-full bg-[#FBF4EA] text-[#3B2217] ' + (lg ? 'h-[42px] w-[42px]' : 'h-[36px] w-[36px]')}>
        <Arrow />
      </span>
    </button>
  )
}
function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-rotate-45">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}
function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  )
}
function ScrollMouse() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const a = el.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(5px)', opacity: 0 }], { duration: 1400, iterations: Infinity, easing: 'cubic-bezier(0.16,1,0.3,1)' })
    return () => a.cancel()
  }, [])
  return (
    <span className="relative inline-block h-[17px] w-[11px] rounded-full border-[1.5px] border-[#3B2217]/60">
      <span ref={ref} className="absolute left-1/2 top-[3px] h-[4px] w-[1.5px] -translate-x-1/2 rounded-full bg-[#3B2217]" />
    </span>
  )
}
type IconName = 'sack' | 'cube' | 'butter' | 'egg' | 'ball' | 'pin' | 'flower' | 'oven' | 'spoon' | 'stack' | 'box'
function StepIcon({ name, size = 18 }: { name: IconName; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (name) {
    case 'sack':
      return (
        <svg {...p}>
          <path d="M8.5 3.5h7l-1.5 3c3 1.6 5 4.8 5 8.5 0 3.3-2.7 5.5-7 5.5s-7-2.2-7-5.5c0-3.7 2-6.9 5-8.5Z" />
          <path d="M10 6.5h4M9.5 13.5h5" />
        </svg>
      )
    case 'cube':
      return (
        <svg {...p}>
          <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9Z" />
          <path d="M4 7.5 12 12l8-4.5M12 12v9" />
        </svg>
      )
    case 'butter':
      return (
        <svg {...p}>
          <path d="M3.5 14.5 9 9h11.5v6.5H3.5Z" />
          <path d="M3.5 14.5h17M9 9v5.5" />
          <path d="M3 18.5h18" />
        </svg>
      )
    case 'ball':
      return (
        <svg {...p}>
          <circle cx="12" cy="12.5" r="7.5" />
          <path d="M8 10c1.5-1 3-1 4.5 0M10.5 15c1.4.6 2.8.5 4-.4" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...p}>
          <rect x="6" y="9" width="12" height="6" rx="3" transform="rotate(-30 12 12)" />
          <path d="m3.2 17.1 2.3-1.3M18.5 8.2l2.3-1.3" />
        </svg>
      )
    case 'stack':
      return (
        <svg {...p}>
          <ellipse cx="12" cy="7.5" rx="7.5" ry="3" />
          <path d="M4.5 7.5v2.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V7.5" />
          <path d="M4.5 13.5V16c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-2.5" />
        </svg>
      )
    case 'egg':
      return (
        <svg {...p}>
          <path d="M12 3c3.6 0 6.5 5.4 6.5 10a6.5 6.5 0 0 1-13 0C5.5 8.4 8.4 3 12 3Z" />
        </svg>
      )
    case 'flower':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 9.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7ZM12 21.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7ZM9.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM21.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
        </svg>
      )
    case 'oven':
      return (
        <svg {...p}>
          <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
          <path d="M3.5 8.5h17M7 6.3h.01M10 6.3h.01" />
          <rect x="7" y="11.5" width="10" height="5.5" rx="1" />
        </svg>
      )
    case 'spoon':
      return (
        <svg {...p}>
          <ellipse cx="15.5" cy="8" rx="3.8" ry="5" transform="rotate(40 15.5 8)" />
          <path d="M12.7 11.3 4 20" />
        </svg>
      )
    default:
      return (
        <svg {...p}>
          <path d="M3.5 8 12 4l8.5 4v8.5L12 20.5l-8.5-4Z" />
          <path d="M3.5 8 12 12l8.5-4M12 12v8.5" />
        </svg>
      )
  }
}

/* ---------- video clock + geometry ---------- */

/**
 * Scroll-driven video: maps the scroll position inside the tall track to the video time and glides toward it
 * with time-based easing (same feel at 60 Hz and 120 Hz), so it moves slowly and smoothly forwards and backwards.
 * The video itself never "plays". A new seek is only sent once the previous one has finished.
 */
function useScrollScrub(track: RefObject<HTMLElement>, ref: RefObject<HTMLVideoElement>, setTime: (t: number) => void, setProgress: (p: number) => void) {
  useEffect(() => {
    const el = track.current
    const v = ref.current
    if (!el || !v) return
    let raf = 0
    let shown = 0
    let lastT = -1
    let lastP = -1
    let prev = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - prev) / 1000)
      prev = now
      const r = el.getBoundingClientRect()
      const total = Math.max(1, r.height - window.innerHeight)
      const p = Math.min(1, Math.max(0, -r.top / total))
      const dur = v.duration && isFinite(v.duration) ? v.duration : 10
      const target = p * (dur - 0.05)
      const k = prefersReduced() ? 1 : 1 - Math.exp(-dt / SMOOTHING) // exponential glide toward the scroll position
      shown += (target - shown) * k
      if (Math.abs(target - shown) < 0.0015) shown = target
      if (v.readyState >= 1 && !v.seeking && Math.abs(v.currentTime - shown) > 1 / 90) v.currentTime = shown
      if (Math.abs(shown - lastT) > 0.008) {
        lastT = shown
        setTime(shown)
      }
      const sp = shown / Math.max(0.01, dur - 0.05) // progress bar follows the eased video, not the raw scroll
      if (Math.abs(sp - lastP) > 0.001) {
        lastP = sp
        setProgress(sp)
      }
      raf = requestAnimationFrame(tick)
    }
    const prime = () => v.pause()
    v.addEventListener('loadedmetadata', prime)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      v.removeEventListener('loadedmetadata', prime)
    }
  }, [track, ref, setTime, setProgress])
}
/**
 * Downloads the whole video once and plays it from memory, so every seek is instant (no network range requests).
 * Needs CORS on the CDN; if the download is blocked, the normal streamed src keeps working.
 */
function useVideoInMemory(ref: RefObject<HTMLVideoElement>, src: string) {
  useEffect(() => {
    const v = ref.current
    if (!v || !/^https?:/.test(src)) return
    let url = ''
    let alive = true
    fetch(src)
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((b) => {
        if (!alive || v.src.startsWith('blob:')) return
        const t = v.currentTime
        url = URL.createObjectURL(b)
        v.src = url
        v.addEventListener('loadedmetadata', () => (v.currentTime = t), { once: true })
      })
      .catch(() => {})
    return () => {
      alive = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [ref, src])
}
/** Rect of an object-fit: cover media inside a box (px), for a given object-position */
function coverRect(bw: number, bh: number, ratio: number, px: number, py: number) {
  let w = bw
  let h = bw / ratio
  if (h < bh) {
    h = bh
    w = bh * ratio
  }
  return { x: (bw - w) * px, y: (bh - h) * py, w, h }
}
function useElementSize(ref: RefObject<HTMLElement>) {
  const [size, setSize] = useState({ w: FRAME_W, h: FRAME_H })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
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
function useViewportHeight() {
  const [h, setH] = useState(() => (typeof window === 'undefined' ? FRAME_H : window.innerHeight))
  useEffect(() => {
    const on = () => setH(window.innerHeight)
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return h
}
/** Desktop layout on landscape screens ≥ 768px; phones and portrait tablets get the mobile layout */
function useIsDesktop() {
  const w = useViewportWidth()
  const h = useViewportHeight()
  return w >= 768 && w >= h * 0.9
}
function Responsive({ children }: { children: ReactNode }) {
  useGoogleFonts()
  return <div className={"bg-[#F9EFE3] font-['Outfit',sans-serif] antialiased"} style={{ color: CHOC }}>{children}</div>
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
