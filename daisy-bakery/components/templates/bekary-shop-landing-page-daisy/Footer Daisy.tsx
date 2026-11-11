/**
 * Footer — newsletter card (email signup with 10% off) + footer links, visit info and bottom bar
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Outfit:wght@400;500;600&display=swap'

/** Image link — free photo from Unsplash (unsplash.com/license: free for commercial use, no attribution needed).
 *  Paste your own CDN link here to swap it. */
const NEWS_IMG = 'https://images.unsplash.com/photo-1634188023730-2a607e9c27a2?auto=format&fit=crop&w=1200&h=1000&q=80'

const BRAND = 'Daisy'
const BRAND_SUB = 'Bakehouse'
const NEWS = {
  eyebrow: 'Newsletter',
  title: 'Fresh batch news, every Friday',
  text: 'New flavours, Saturday pop-ups and gift-box restocks, straight to your inbox. Get 10% off your first box when you join.',
  fine: 'One email a week. Unsubscribe any time.',
}
const BLURB = 'Hand-cut daisy cookies and gift boxes, baked every morning in small batches of 24.'
const COLUMNS = [
  { title: 'Shop', links: ['Cookies', 'Gift boxes', 'Corporate orders', 'Gift cards'] },
  { title: 'Help', links: ['Shipping & delivery', 'Allergens', 'FAQ', 'Track an order'] },
]
const VISIT = { address: ['18 Mill Lane, Old Town', 'Open Tue – Sun, 8:00 – 19:00'], email: 'hello@daisybakehouse.com', phone: '+1 (555) 014-2290' }
const LEGAL = ['Privacy', 'Terms', 'Cookie settings']
const SOCIAL = ['Instagram', 'Facebook', 'TikTok'] as const

const FRAME_W = 1600
const FRAME_H = 1000

/* ------------------------------------------------------------------ */
/* Desktop (1600 artboard)                                             */
/* ------------------------------------------------------------------ */

function FooterDesktop() {
  return (
    <Artboard height={FRAME_H}>
      {/* newsletter card */}
      <Reveal style={at(80, 100, 1440, 440)}>
        <div className="relative h-full overflow-hidden rounded-[36px] bg-[#F3DEC3]">
          <div className="absolute left-[64px] top-[60px] w-[660px]">
            <Eyebrow>{NEWS.eyebrow}</Eyebrow>
            <h2 className="mt-[14px] font-['Young_Serif',serif] text-[52px] leading-[58px] text-[#3A2217]">{NEWS.title}</h2>
            <p className="mt-[14px] max-w-[560px] text-[17px] leading-[28px] text-[#3A2217]/70">{NEWS.text}</p>
            <div className="mt-[26px]">
              <Signup />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 top-0 w-[580px]">
            <img src={NEWS_IMG} alt="Freshly baked cookies on a white table" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <Sticker style={at(806, 270)} />
        </div>
      </Reveal>

      {/* columns */}
      <Reveal delay={100} style={at(80, 630, 400)}>
        <Brand />
      </Reveal>
      {COLUMNS.map((c, i) => (
        <Reveal key={c.title} delay={180 + i * 90} style={at(640 + i * 240, 638, 200)}>
          <LinkList title={c.title} links={c.links} />
        </Reveal>
      ))}
      <Reveal delay={360} style={at(1140, 638, 380)}>
        <Visit />
      </Reveal>

      <div className="bg-[#FBF0E4]/12" style={at(80, 892, 1440, 1)} />
      <div style={at(80, 920, 1440, 30)}>
        <Bottom />
      </div>
    </Artboard>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile (< 768px)                                                    */
/* ------------------------------------------------------------------ */

function FooterMobile() {
  return (
    <div className="px-[20px] pb-[32px] pt-[56px]">
      <Reveal>
        <div className="overflow-hidden rounded-[28px] bg-[#F3DEC3]">
          <div className="p-[24px]">
            <Eyebrow>{NEWS.eyebrow}</Eyebrow>
            <h2 className="mt-[12px] font-['Young_Serif',serif] text-[32px] leading-[38px] text-[#3A2217]">{NEWS.title}</h2>
            <p className="mt-[12px] text-[15.5px] leading-[25px] text-[#3A2217]/70">{NEWS.text}</p>
            <div className="mt-[20px]">
              <Signup stacked />
            </div>
          </div>
          <div className="relative h-[240px]">
            <img src={NEWS_IMG} alt="Freshly baked cookies on a white table" loading="lazy" className="h-full w-full object-cover" />
            <Sticker style={{ position: 'absolute', right: 16, top: -44, transform: 'scale(0.8)' }} />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-[48px]">
        <Brand />
      </Reveal>
      <div className="mt-[36px] grid grid-cols-2 gap-[24px]">
        {COLUMNS.map((c) => (
          <Reveal key={c.title}>
            <LinkList title={c.title} links={c.links} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-[36px]">
        <Visit />
      </Reveal>
      <div className="mt-[40px] border-t border-[#FBF0E4]/12 pt-[20px]">
        <Bottom stacked />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** Email form: checks the address, then shows a thank-you line (hook it up to your email tool in `submit`) */
function Signup({ stacked = false }: { stacked?: boolean }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setState('error')
    setState('done')
  }
  if (state === 'done')
    return (
      <p className="flex items-center gap-[12px] rounded-[18px] bg-[#FFFCF6] px-[18px] py-[16px] text-[15.5px] font-medium text-[#3A2217]" role="status">
        <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-[#6F8B3D] text-white">✓</span>
        You’re in. Your 10% code is on its way to {email.trim()}.
      </p>
    )
  return (
    <form onSubmit={submit} noValidate>
      <div className={'flex gap-[10px] ' + (stacked ? 'flex-col' : 'items-center')}>
        <label htmlFor={stacked ? 'news-email-m' : 'news-email'} className="sr-only">
          Email address
        </label>
        <input
          id={stacked ? 'news-email-m' : 'news-email'}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          placeholder="you@example.com"
          aria-invalid={state === 'error'}
          className={
            'h-[56px] rounded-full border bg-[#FFFCF6] px-[22px] text-[16px] text-[#3A2217] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#3A2217]/40 focus:border-[#C8752A] focus:shadow-[0_0_0_4px_rgba(200,116,43,0.18)] ' +
            (stacked ? 'w-full ' : 'w-[380px] ') +
            (state === 'error' ? 'border-[#B5402A]' : 'border-[#3A2217]/12')
          }
        />
        <PillButton label="Subscribe" type="submit" full={stacked} />
      </div>
      <p className={'mt-[10px] pl-[6px] text-[13px] ' + (state === 'error' ? 'text-[#B5402A]' : 'text-[#3A2217]/55')}>{state === 'error' ? 'Please enter a valid email address, like name@example.com.' : NEWS.fine}</p>
    </form>
  )
}

function Sticker({ style }: { style: CSSProperties }) {
  return (
    <div style={style} className="grid h-[132px] w-[132px] rotate-[-12deg] place-items-center rounded-full bg-[#C8752A] text-center text-white shadow-[0_18px_30px_-16px_rgba(58,34,22,0.7)]">
      <span className="leading-none">
        <span className="block font-['Young_Serif',serif] text-[40px]">10%</span>
        <span className="mt-[4px] block text-[11.5px] font-semibold uppercase tracking-[0.16em]">first box</span>
      </span>
    </div>
  )
}

function Brand() {
  return (
    <div>
      <a href="#" aria-label={`${BRAND} ${BRAND_SUB} home`} className="group inline-flex items-center gap-[12px] text-[#FBF0E4]">
        <span className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[60deg]">
          <FlowerMark size={40} />
        </span>
        <span className="leading-none">
          <span className="block font-['Young_Serif',serif] text-[28px]">{BRAND}</span>
          <span className="mt-[4px] block text-[10.5px] font-semibold uppercase tracking-[0.32em] text-[#F3C38E]">{BRAND_SUB}</span>
        </span>
      </a>
      <p className="mt-[20px] max-w-[340px] text-[15.5px] leading-[25px] text-[#FBF0E4]/60">{BLURB}</p>
      <div className="mt-[22px] flex gap-[10px]">
        {SOCIAL.map((s) => (
          <a key={s} href="#" aria-label={s} className="grid h-[44px] w-[44px] place-items-center rounded-full border border-[#FBF0E4]/15 text-[#FBF0E4] transition-[background-color,color,transform] duration-300 hover:-translate-y-[2px] hover:bg-[#F3C38E] hover:text-[#3A2217]">
            <SocialIcon name={s} />
          </a>
        ))}
      </div>
    </div>
  )
}

function LinkList({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#F3C38E]">{title}</h3>
      <ul className="mt-[18px] grid gap-[12px]">
        {links.map((l) => (
          <li key={l}>
            <a href={l === 'Cookies' ? '#cookies' : l === 'Gift boxes' ? '#gift-boxes' : '#'} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-[2px] text-[16px] text-[#FBF0E4]/80 transition-[background-size,color] duration-300 hover:bg-[length:100%_1px] hover:text-[#FBF0E4]">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Visit() {
  return (
    <div>
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#F3C38E]">Visit us</h3>
      <p className="mt-[18px] text-[16px] leading-[27px] text-[#FBF0E4]/80">
        {VISIT.address[0]}
        <br />
        {VISIT.address[1]}
      </p>
      <p className="mt-[14px] grid gap-[6px] text-[16px] text-[#FBF0E4]/80">
        <span className="select-all">{VISIT.email}</span>
        <span className="select-all tabular-nums">{VISIT.phone}</span>
      </p>
    </div>
  )
}

function Bottom({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className={'flex text-[14px] text-[#FBF0E4]/50 ' + (stacked ? 'flex-col gap-[12px]' : 'items-center justify-between')}>
      <span>© 2026 Daisy Bakehouse. Baked by hand, every morning.</span>
      <span className="flex gap-[22px]">
        {LEGAL.map((l) => (
          <a key={l} href="#" className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size,color] duration-300 hover:bg-[length:100%_1px] hover:text-[#FBF0E4]">
            {l}
          </a>
        ))}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Default export                                                      */
/* ------------------------------------------------------------------ */

export default function Footer() {
  return <Responsive id="contact" className="bg-[#2A1910]" desktop={<FooterDesktop />} mobile={<FooterMobile />} />
}

/* ================================================================== */
/* Section-local helpers — kept in this file so the section is 100%    */
/* self-contained.                                                     */
/* ================================================================== */

/** Chocolate pill with a cream arrow circle. Hover: caramel sweeps in, label rolls, arrow turns −45°, button lifts. */
function PillButton({ label, type = 'button', full = false }: { label: string; type?: 'button' | 'submit'; full?: boolean }) {
  return (
    <button
      type={type}
      className={
        'group/btn relative inline-flex h-[56px] shrink-0 items-center justify-between gap-[14px] overflow-hidden rounded-full bg-[#3A2217] pl-[24px] pr-[6px] text-[16px] font-semibold text-[#FAF5EB] shadow-[0_12px_26px_-14px_rgba(58,34,22,0.7)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_18px_34px_-14px_rgba(58,34,22,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8752A] active:scale-[0.97] ' +
        (full ? 'w-full' : '')
      }
    >
      <span aria-hidden className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[#C8752A] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-x-100" />
      <span className="relative">
        <RollLabel>{label}</RollLabel>
      </span>
      <span className="relative grid h-[44px] w-[44px] place-items-center rounded-full bg-[#FAF5EB] text-[#3A2217]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-300 group-hover/btn:translate-x-[2px] group-hover/btn:-rotate-45">
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </span>
    </button>
  )
}

/** A six-petal daisy cookie with a cocoa centre (brand mark) */
function FlowerMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx="16" cy="8.2" r="6.2" fill="#E9B873" stroke="#C8752A" strokeWidth="1.2" transform={`rotate(${a} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="7.4" fill="#E9B873" />
      <circle cx="16" cy="16" r="4.2" fill="#3A2217" />
    </svg>
  )
}

function SocialIcon({ name }: { name: (typeof SOCIAL)[number] }) {
  const p = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'Instagram')
    return (
      <svg {...p}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
      </svg>
    )
  if (name === 'Facebook')
    return (
      <svg {...p}>
        <path d="M14.5 8.5H16V5.2h-2.2c-2.4 0-3.8 1.5-3.8 4v2H8v3.3h2V21h3.4v-6.5h2.4l.5-3.3h-2.9V9.6c0-.7.4-1.1 1.1-1.1Z" />
      </svg>
    )
  return (
    <svg {...p}>
      <path d="M14 3.5v11a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3.5c.5 2.6 2.2 4.2 5 4.5" />
    </svg>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[10px] text-[13px] font-semibold uppercase tracking-[0.2em] text-[#C8752A]">
      <span className="h-[6px] w-[6px] rounded-full bg-current" />
      {children}
    </span>
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
    <section id={id} className={"relative w-full scroll-mt-[72px] font-['Outfit',sans-serif] text-[#3A2217] antialiased " + className}>
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
