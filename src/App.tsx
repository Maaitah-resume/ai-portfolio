import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import ArchDiagram from './ArchDiagram'
import * as en from './data'
import * as ar from './data.ar'
import type { Project } from './data'

const content = { en, ar }
type Lang = keyof typeof content
type Theme = 'light' | 'dark'
type UI = typeof en.ui

// Remembered per visitor; storage can be unavailable, so every access is guarded.
const load = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // the choice just won't persist
  }
}

// Three.js is large, so the 3D robot loads after the page's text.
const RobotHero = lazy(() => import('./RobotHero'))

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '') // an attribute, so React's className updates can't clear it
            io.unobserve(e.target)
          }
        }),
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

    // The project card under the pointer gets an edge light and glare that follow it.
    let active: HTMLElement | null = null
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>('.project')
      if (active && active !== card) active.style.setProperty('--glare', '0')
      active = card
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
      card.style.setProperty('--glare', '1')
    }
    window.addEventListener('pointermove', onMove)

    // In-page links cross-fade to their section instead of scrolling the whole way there.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      const target = link && document.getElementById(link.hash.slice(1))
      if (!target || !document.startViewTransition || reduceMotion) return
      e.preventDefault()
      document.startViewTransition(() => {
        target.setAttribute('data-in', '') // arrive already revealed
        target.scrollIntoView({ behavior: 'instant' })
        history.pushState(null, '', link.hash)
      })
    }
    document.addEventListener('click', onClick)

    // Marks the nav link for the section currently on screen.
    const links = new Map(
      [...document.querySelectorAll<HTMLAnchorElement>('.nav nav a[href^="#"]')].map((a) => [a.hash.slice(1), a]),
    )
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          links.forEach((a) => a.removeAttribute('aria-current'))
          links.get(e.target.id)?.setAttribute('aria-current', 'true')
        }),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((_, id) => {
      const section = document.getElementById(id)
      if (section) spy.observe(section)
    })

    return () => {
      io.disconnect()
      spy.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('click', onClick)
    }
  }, [])
}

// Counts a number up from zero once it scrolls into view, keeping its decimal places.
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const target = parseFloat(value)
  const decimals = value.split('.')[1]?.length ?? 0
  const [shown, setShown] = useState(reduceMotion ? value : (0).toFixed(decimals))
  useEffect(() => {
    if (reduceMotion) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 1100)
        const eased = 1 - Math.pow(1 - t, 4) // ease out: fast start, gentle landing
        setShown((target * eased).toFixed(decimals))
        if (t < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.6 })
    io.observe(ref.current!)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, decimals])
  return (
    <span ref={ref} aria-label={value}>
      {shown}
    </span>
  )
}

// Theme and language changes cross-fade the page where the browser supports it.
const withTransition = (change: () => void) => {
  if (document.startViewTransition && !reduceMotion) document.startViewTransition(change)
  else change()
}

function ProjectCard({ p, ui }: { p: Project; ui: UI }) {
  const [flipped, setFlipped] = useState(false)
  const frontBtn = useRef<HTMLButtonElement>(null)
  const backBtn = useRef<HTMLButtonElement>(null)
  const flip = (to: boolean) => {
    setFlipped(to)
    // Move focus to the face that is now showing, after the flip starts.
    requestAnimationFrame(() => (to ? backBtn : frontBtn).current?.focus({ preventScroll: true }))
  }
  return (
    <article className={`project${p.featured ? ' featured' : ''}${flipped ? ' flipped' : ''}`}>
      <div className="flip">
      <div className="face front" inert={flipped}>
      <div className="project-head">
        <p className="kind">{p.kind}</p>
        <h3>{p.name}</h3>
        <p className="blurb">{p.blurb}</p>
      </div>
      {p.metric && (
        <div className="metric">
          <CountUp value={p.metric.value} />
          <small>{p.metric.label}</small>
        </div>
      )}
      <ul className="points">
        {p.points.map((pt) => (
          <li key={pt}>{pt}</li>
        ))}
      </ul>
      <div className="project-foot">
        <ul className="stack" aria-label={ui.builtWith}>
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="project-actions">
          <button ref={frontBtn} className="ghost how" onClick={() => flip(true)}>
            {ui.howItWorks}
          </button>
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
      </div>
      <div className="face back" inert={!flipped}>
        <div className="back-head">
          <p className="kind">{ui.howItWorks}</p>
          <h3>{p.name}</h3>
        </div>
        <ArchDiagram name={p.name} live={flipped && !reduceMotion} />
        <button ref={backBtn} className="ghost" onClick={() => flip(false)}>
          {ui.backToOverview}
        </button>
      </div>
      </div>
    </article>
  )
}

export default function App() {
  useReveal()
  const [lang, setLang] = useState<Lang>(() => (load('lang') === 'ar' ? 'ar' : 'en'))
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = load('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const { profile, stats, capabilities, experience, projects, skills, approach, certifications, education, ui } = content[lang]
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
    root.dataset.theme = theme
    document.title = `${profile.name} · ${profile.role}`
  }, [lang, theme, profile])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    save('theme', next)
    withTransition(() => flushSync(() => setTheme(next)))
  }
  const toggleLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar'
    save('lang', next)
    withTransition(() => flushSync(() => setLang(next)))
  }

  return (
    <>
      <header className="nav">
        <a href="#top" className="mark" aria-label={ui.backToTop}>
          {lang === 'ar' ? 'م.م' : 'MM'}
        </a>
        <div className="nav-right">
          <nav>
            <a href="#about">{ui.nav.about}</a>
            <a href="#work">{ui.nav.work}</a>
            <a href="#experience">{ui.nav.experience}</a>
            <a href="#skills">{ui.nav.skills}</a>
            <a href="#credentials">{ui.nav.credentials}</a>
            <a href="#contact" className="nav-cta">
              {ui.nav.contact}
            </a>
          </nav>
          <div className="nav-tools">
            <button
              className="tool"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? ui.themeToLight : ui.themeToDark}
              title={theme === 'dark' ? ui.themeToLight : ui.themeToDark}
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
                </svg>
              )}
            </button>
            <button
              className="tool lang"
              onClick={toggleLang}
              aria-label={ui.otherLanguageLabel}
              title={ui.otherLanguageLabel}
              lang={lang === 'ar' ? 'en' : 'ar'}
            >
              {ui.otherLanguage}
            </button>
          </div>
        </div>
        <div className="progress" aria-hidden="true" />
      </header>

      <main id="top">
        <section className="hero">
          <div className="aurora" aria-hidden="true" />
          <Suspense fallback={null}>
            <RobotHero rtl={lang === 'ar'} />
          </Suspense>
          <div className="hero-copy">
            <p className="status">
              <span className="dot" /> {ui.status}
            </p>
            <h1>
              <span className="line">{ui.firstName}</span>
              <span className="line">{ui.lastName}</span>
            </h1>
            <p className="role-line">{profile.headline}</p>
            <p className="lede">{profile.lede}</p>
            <div className="hero-actions">
              <a className="btn" href="#work">
                {ui.seeProjects}
              </a>
              <a className="btn ghost" href={`mailto:${profile.email}`}>
                {ui.emailMe}
              </a>
              <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        <section className="stats wrap" aria-label={ui.atAGlance}>
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <CountUp value={s.value} />
              <p>{s.label}</p>
            </div>
          ))}
        </section>

        <section id="about" className="about wrap reveal">
          <div className="section-head">
            <h2>{ui.aboutTitle}</h2>
            <p>{ui.aboutNote}</p>
          </div>
          <div className="about-body">
            <div className="about-text">
              {profile.summary.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <dl className="facts">
              <div>
                <dt>{ui.facts.currently}</dt>
                <dd>{ui.facts.currentlyValue}</dd>
              </div>
              <div>
                <dt>{ui.facts.focus}</dt>
                <dd>{ui.facts.focusValue}</dd>
              </div>
              <div>
                <dt>{ui.facts.education}</dt>
                <dd>
                  {ui.facts.educationValue} {education.gpa}
                </dd>
              </div>
              <div>
                <dt>{ui.facts.location}</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>{ui.facts.email}</dt>
                <dd>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </dd>
              </div>
            </dl>
          </div>

          <h3 className="sub-head">{ui.whatIDo}</h3>
          <div className="capabilities">
            {capabilities.map((c) => (
              <article key={c.title} className="capability">
                <h4>{c.title}</h4>
                <p>{c.text}</p>
                <ul className="stack">
                  {c.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="wrap reveal">
          <div className="section-head">
            <h2>{ui.workTitle}</h2>
            <p>{ui.workNote}</p>
          </div>
          <div className="featured-grid">
            {featured.map((p) => (
              <ProjectCard key={p.name} p={p} ui={ui} />
            ))}
          </div>
          <div className="project-grid">
            {rest.map((p) => (
              <ProjectCard key={p.name} p={p} ui={ui} />
            ))}
          </div>
        </section>

        <section id="experience" className="wrap reveal">
          <div className="section-head">
            <h2>{ui.experienceTitle}</h2>
            <p>{ui.experienceNote}</p>
          </div>
          {experience.map((x) => (
            <article key={x.title} className="job">
              <div className="job-meta">
                <p className="period">{x.period}</p>
                <p className="org">{x.org}</p>
                <p className="muted">{x.note}</p>
              </div>
              <div>
                <h3>{x.title}</h3>
                <p className="job-intro">{x.intro}</p>
                <ul className="timeline">
                  {x.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <ul className="stack job-stack" aria-label={ui.technologiesUsed}>
                  {x.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          <h3 className="sub-head">{ui.howIWork}</h3>
          <div className="approach">
            {approach.map((a) => (
              <article key={a.title}>
                <h4>{a.title}</h4>
                <p>{a.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="wrap reveal">
          <div className="section-head">
            <h2>{ui.skillsTitle}</h2>
            <p>{ui.skillsNote}</p>
          </div>
          <div className="skills">
            {skills.map((s) => (
              <div key={s.group} className="skill-group">
                <h3>{s.group}</h3>
                <ul>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="credentials" className="wrap reveal">
          <div className="section-head">
            <h2>{ui.credentialsTitle}</h2>
            <p>{ui.credentialsNote}</p>
          </div>
          <div className="certs">
            {certifications.map((c) => (
              <article key={c.name} className="cert">
                <p className="issuer">{c.issuer}</p>
                <h3>{c.name}</h3>
                <p className="cert-text">{c.text}</p>
                <p className="muted cert-code">{c.code}</p>
              </article>
            ))}
          </div>
          <article className="edu">
            <div>
              <h3>{education.degree}</h3>
              <p className="muted">
                {education.school}, {education.period}
              </p>
              <p className="edu-text">{education.text}</p>
            </div>
            <p className="gpa">
              <CountUp value={education.gpa} /> {ui.gpa}
            </p>
          </article>
        </section>

        <section id="contact" className="contact wrap reveal">
          <h2>{ui.contactTitle}</h2>
          <p>{ui.contactText}</p>
          <div className="contact-links">
            <a className="btn" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="btn ghost" href={`tel:${profile.phone.replace(/\s/g, '')}`} dir="ltr">
              {profile.phone}
            </a>
            <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="wrap foot">
        <p>
          © 2026 {profile.name} · {profile.role}
        </p>
        <p className="muted">{profile.location}</p>
      </footer>
    </>
  )
}
