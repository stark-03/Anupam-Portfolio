import { useState, useEffect, useRef } from "react";

const ACCENT = "#E85D4A";
const ACCENT_LIGHT = "#FF7A6B";
const BG_DARK = "#0A0A0F";
const BG_CARD = "#12121A";
const BG_CARD_HOVER = "#1A1A25";
const TEXT_PRIMARY = "#E8E6E3";
const TEXT_SECONDARY = "#8A8A9A";
const BORDER = "#1E1E2E";

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Animated Section Wrapper ─── */
function Section({ children, id, delay = 0 }) {
  const [ref, inView] = useInView(0.1);
  return (
    <section
      ref={ref}
      id={id}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        padding: "100px 0",
      }}
    >
      {children}
    </section>
  );
}

/* ─── Section Title ─── */
function SectionTitle({ label, title }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        color: ACCENT,
        letterSpacing: 3,
        textTransform: "uppercase",
        display: "block",
        marginBottom: 12,
      }}>
        {label}
      </span>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(28px, 4vw, 42px)",
        fontWeight: 700,
        color: TEXT_PRIMARY,
        margin: 0,
        lineHeight: 1.2,
      }}>
        {title}
      </h2>
      <div style={{
        width: 60,
        height: 3,
        background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
        marginTop: 16,
        borderRadius: 2,
      }} />
    </div>
  );
}

/* ─── Skill Badge ─── */
function SkillBadge({ name }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        padding: "8px 18px",
        borderRadius: 6,
        fontSize: 13,
        fontFamily: "'JetBrains Mono', monospace",
        background: hovered ? `${ACCENT}22` : `${ACCENT}0D`,
        color: hovered ? ACCENT_LIGHT : TEXT_SECONDARY,
        border: `1px solid ${hovered ? ACCENT + "44" : BORDER}`,
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      {name}
    </span>
  );
}

/* ─── Stat Counter ─── */
function StatCounter({ value, label }) {
  const [ref, inView] = useInView(0.3);
  const [count, setCount] = useState(0);
  const num = parseInt(value);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = duration / num;
    const timer = setInterval(() => {
      start++;
      setCount(start);
      if (start >= num) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [inView, num]);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(36px, 5vw, 52px)",
        fontWeight: 700,
        color: ACCENT,
        lineHeight: 1,
      }}>
        {count}{value.replace(/\d+/, "")}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color: TEXT_SECONDARY,
        marginTop: 8,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Timeline Item ─── */
function TimelineItem({ period, title, org, items, isLast }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        gap: 32,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-30px)",
        transition: "all 0.6s ease",
      }}
    >
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 20,
      }}>
        <div style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `2px solid ${ACCENT}`,
          background: BG_DARK,
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }} />
        {!isLast && (
          <div style={{
            width: 1,
            flex: 1,
            background: `linear-gradient(180deg, ${ACCENT}44, transparent)`,
          }} />
        )}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 48, flex: 1 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: ACCENT,
          letterSpacing: 1,
        }}>
          {period}
        </span>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          fontWeight: 600,
          color: TEXT_PRIMARY,
          margin: "8px 0 4px",
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: TEXT_SECONDARY,
          margin: "0 0 16px",
        }}>
          {org}
        </p>
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          {items.map((item, i) => (
            <li key={i} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: TEXT_SECONDARY,
              lineHeight: 1.7,
              paddingLeft: 20,
              position: "relative",
            }}>
              <span style={{
                position: "absolute",
                left: 0,
                color: ACCENT,
                fontSize: 8,
                top: 7,
              }}>●</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ title, description, tags, icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? BG_CARD_HOVER : BG_CARD,
        border: `1px solid ${hovered ? ACCENT + "44" : BORDER}`,
        borderRadius: 12,
        padding: 32,
        transition: "all 0.4s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 40px ${ACCENT}11` : "none",
        cursor: "default",
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 10,
        background: `${ACCENT}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        marginBottom: 20,
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 20,
        fontWeight: 600,
        color: TEXT_PRIMARY,
        margin: "0 0 12px",
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        color: TEXT_SECONDARY,
        lineHeight: 1.7,
        margin: "0 0 20px",
      }}>
        {description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map((t, i) => (
          <span key={i} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 4,
            background: `${ACCENT}0D`,
            color: TEXT_SECONDARY,
            border: `1px solid ${BORDER}`,
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Nav Link ─── */
function NavLink({ href, children, active }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        color: active ? ACCENT : hovered ? TEXT_PRIMARY : TEXT_SECONDARY,
        textDecoration: "none",
        letterSpacing: 0.5,
        transition: "color 0.3s ease",
        position: "relative",
      }}
    >
      {children}
      <span style={{
        position: "absolute",
        bottom: -4,
        left: 0,
        width: active ? "100%" : hovered ? "100%" : "0%",
        height: 1,
        background: ACCENT,
        transition: "width 0.3s ease",
      }} />
    </a>
  );
}

/* ─── Contact Item ─── */
function ContactItem({ icon, label, value, href }) {
  const [hovered, setHovered] = useState(false);
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 20,
        borderRadius: 10,
        background: hovered ? BG_CARD_HOVER : BG_CARD,
        border: `1px solid ${hovered ? ACCENT + "44" : BORDER}`,
        transition: "all 0.3s ease",
        textDecoration: "none",
        cursor: href ? "pointer" : "default",
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: `${ACCENT}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: TEXT_SECONDARY,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 4,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: TEXT_PRIMARY,
        }}>
          {value}
        </div>
      </div>
    </Tag>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PORTFOLIO COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavSolid(window.scrollY > 50);

      const sections = ["hero", "about", "experience", "skills", "projects", "education", "contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const container = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
  };

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div style={{
      background: BG_DARK,
      color: TEXT_PRIMARY,
      minHeight: "100vh",
      overflowX: "hidden",
      position: "relative",
    }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${BG_DARK}; margin: 0; }
        ::selection { background: ${ACCENT}44; color: ${TEXT_PRIMARY}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${BG_DARK}; }
        ::-webkit-scrollbar-thumb { background: ${ACCENT}44; border-radius: 3px; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        @media (max-width: 768px) {
          .hero-grid { flex-direction: column-reverse !important; text-align: center !important; }
          .hero-grid > div:last-child { align-items: center !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .edu-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ─── Background Effects ─── */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}>
        <div style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}08 0%, transparent 70%)`,
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, #4A90D911 0%, transparent 70%)`,
          filter: "blur(60px)",
        }} />
        {/* Subtle grid pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${BORDER}33 1px, transparent 1px), linear-gradient(90deg, ${BORDER}33 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.3,
        }} />
      </div>

      {/* ─── Navigation ─── */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 24px",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: navSolid ? `${BG_DARK}EE` : "transparent",
        backdropFilter: navSolid ? "blur(20px)" : "none",
        borderBottom: navSolid ? `1px solid ${BORDER}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <a href="#hero" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            fontWeight: 700,
            color: TEXT_PRIMARY,
            textDecoration: "none",
            letterSpacing: -0.5,
          }}>
            A<span style={{ color: ACCENT }}>.</span>N
          </a>

          <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navLinks.map(l => (
              <NavLink key={l.href} href={l.href} active={activeSection === l.href.slice(1)}>
                {l.label}
              </NavLink>
            ))}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              flexDirection: "column",
              gap: 5,
              padding: 8,
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 22,
                height: 2,
                background: TEXT_PRIMARY,
                borderRadius: 2,
                transition: "all 0.3s ease",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px, 5px)" : i === 2 ? "rotate(-45deg) translate(5px, -5px)" : "scaleX(0)"
                  : "none",
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          top: 70,
          left: 0,
          right: 0,
          background: `${BG_DARK}F5`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${BORDER}`,
          zIndex: 99,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          animation: "slideDown 0.3s ease",
        }}>
          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                color: TEXT_SECONDARY,
                textDecoration: "none",
                padding: "8px 0",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      {/* ─── Hero Section ─── */}
      <section id="hero" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={container}>
          <div className="hero-grid" style={{
            display: "flex",
            alignItems: "center",
            gap: 64,
            justifyContent: "space-between",
          }}>
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 24,
              animation: "fadeInUp 1s ease",
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: ACCENT,
                letterSpacing: 3,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}>
                <span style={{
                  width: 30,
                  height: 1,
                  background: ACCENT,
                  display: "inline-block",
                }} />
                DESIGN ENGINEER
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(40px, 6vw, 72px)",
                fontWeight: 800,
                lineHeight: 1.05,
                color: TEXT_PRIMARY,
                letterSpacing: -1,
              }}>
                Anupam<br />
                <span style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Nilajkar
                </span>
              </h1>

              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 17,
                lineHeight: 1.8,
                color: TEXT_SECONDARY,
                maxWidth: 480,
              }}>
                Mechanical Engineer blending structural design with data analytics.
                Turning complex datasets into actionable insights and engineering
                precision into innovative packaging solutions.
              </p>

              <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                <a href="#contact" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  padding: "14px 32px",
                  background: ACCENT,
                  color: "#fff",
                  borderRadius: 8,
                  textDecoration: "none",
                  letterSpacing: 1,
                  transition: "all 0.3s ease",
                  border: "none",
                }}>
                  GET IN TOUCH
                </a>
                <a href="#experience" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  padding: "14px 32px",
                  background: "transparent",
                  color: TEXT_PRIMARY,
                  borderRadius: 8,
                  textDecoration: "none",
                  letterSpacing: 1,
                  border: `1px solid ${BORDER}`,
                  transition: "all 0.3s ease",
                }}>
                  VIEW WORK
                </a>
              </div>
            </div>

            {/* Hero Visual */}
            <div style={{
              position: "relative",
              flexShrink: 0,
              animation: "fadeInUp 1s ease 0.3s both",
            }}>
              <div style={{
                width: "clamp(240px, 28vw, 340px)",
                height: "clamp(240px, 28vw, 340px)",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${ACCENT}30, ${BG_CARD})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute",
                  inset: -3,
                  borderRadius: "50%",
                  border: `1px solid ${ACCENT}33`,
                  animation: "pulse-ring 3s ease-in-out infinite",
                }} />
                <div style={{
                  width: "85%",
                  height: "85%",
                  borderRadius: "50%",
                  background: `linear-gradient(160deg, ${BG_CARD}, ${ACCENT}15)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(48px, 7vw, 80px)",
                  fontWeight: 800,
                  color: ACCENT,
                  letterSpacing: -2,
                  border: `1px solid ${ACCENT}22`,
                }}>
                  AN
                </div>
              </div>

              {/* Floating Badges */}
              <div style={{
                position: "absolute",
                top: 20,
                right: -20,
                padding: "10px 16px",
                borderRadius: 8,
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: TEXT_SECONDARY,
                animation: "float 4s ease-in-out infinite",
                backdropFilter: "blur(10px)",
              }}>
                📊 Power BI
              </div>
              <div style={{
                position: "absolute",
                bottom: 30,
                left: -30,
                padding: "10px 16px",
                borderRadius: 8,
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: TEXT_SECONDARY,
                animation: "float 4s ease-in-out infinite 1s",
                backdropFilter: "blur(10px)",
              }}>
                🏗️ ArtiosCAD
              </div>
              <div style={{
                position: "absolute",
                bottom: -10,
                right: 20,
                padding: "10px 16px",
                borderRadius: 8,
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: TEXT_SECONDARY,
                animation: "float 4s ease-in-out infinite 2s",
                backdropFilter: "blur(10px)",
              }}>
                🔬 ANSYS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <div style={{
        position: "relative",
        zIndex: 1,
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
        padding: "48px 24px",
        background: `${BG_CARD}88`,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ ...container }}>
          <div className="stats-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
          }}>
            <StatCounter value="20%" label="Delay Reduction" />
            <StatCounter value="15%" label="Defect Reduction" />
            <StatCounter value="60%" label="Reporting Saved" />
            <StatCounter value="8+" label="Hours Saved/Week" />
          </div>
        </div>
      </div>

      {/* ─── About ─── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={container}>
          <Section id="about">
            <SectionTitle label="01 — Introduction" title="About Me" />
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
            }} className="skills-grid">
              <div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: TEXT_SECONDARY,
                  marginBottom: 24,
                }}>
                  I'm a detail-oriented and data-driven Mechanical Engineer with hands-on
                  experience in packaging design, process improvement, and dashboard
                  development. I blend engineering precision with analytical thinking to
                  deliver solutions that matter.
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: TEXT_SECONDARY,
                }}>
                  Proficient in Power BI, Excel, SQL, and CAD tools with a strong
                  foundation in engineering drawing. I have a proven ability to use
                  data to drive decisions, reduce defects, and streamline reporting
                  workflows — delivering measurable impact for leading FMCG and
                  industrial brands.
                </p>
              </div>
              <div style={{
                background: BG_CARD,
                borderRadius: 12,
                border: `1px solid ${BORDER}`,
                padding: 32,
              }}>
                <h4 style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: ACCENT,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}>
                  Quick Facts
                </h4>
                {[
                  ["Name", "Anupam Nilajkar"],
                  ["Role", "Design Engineer"],
                  ["Location", "Belgaum, Karnataka"],
                  ["Education", "B.E. Mechanical"],
                  ["Specialization", "Packaging Design & Data Analytics"],
                  ["Patent", "Ultrasonic Scalar (2023)"],
                ].map(([k, v], i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: i < 5 ? `1px solid ${BORDER}` : "none",
                  }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: TEXT_SECONDARY,
                    }}>
                      {k}
                    </span>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: TEXT_PRIMARY,
                      textAlign: "right",
                    }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ─── Experience ─── */}
          <Section id="experience">
            <SectionTitle label="02 — Career" title="Work Experience" />
            <TimelineItem
              period="August 2024 — Present"
              title="Structural Design Engineer"
              org="Sonacad, Bengaluru"
              items={[
                "Built Power BI dashboards to track project timelines, tooling schedules, and vendor milestones — reduced delays by 20%",
                "Analyzed packaging defect data using Excel & Power BI, reducing repeat issues by 15%",
                "Automated weekly reporting, saving 60% of manual prep time and accelerating decision-making",
                "Developed vendor performance dashboards improving reliability by 10%",
                "Designed 2D/3D structural packaging models using ArtiosCAD and CIMEX for folding cartons and corrugated boxes",
                "Delivered packaging solutions for clients like ITC, Marico, Bosch, Britannia, and MTR Foods",
                "Generated die-line files using Impact CAD, supporting die-making and tooling teams",
              ]}
              isLast={true}
            />
          </Section>

          {/* ─── Skills ─── */}
          <Section id="skills">
            <SectionTitle label="03 — Expertise" title="Technical Skills" />
            <div className="skills-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
            }}>
              {[
                {
                  category: "Data Analytics",
                  icon: "📊",
                  skills: ["Power BI", "Excel", "SQL", "Data Cleaning", "Report Automation", "Data Visualization"],
                },
                {
                  category: "Design & CAD",
                  icon: "✏️",
                  skills: ["ArtiosCAD", "CIMEX", "Impact CAD", "Solid Edge V19", "PRO ENGINEER"],
                },
                {
                  category: "Analysis & Simulation",
                  icon: "🔬",
                  skills: ["ANSYS Workbench", "Static Structural", "Modal Analysis", "CFX", "Mechanical APDL"],
                },
                {
                  category: "Core Engineering",
                  icon: "⚙️",
                  skills: ["Packaging Design", "2D/3D Modeling", "Die-line Generation", "Process Improvement", "Quality Control"],
                },
              ].map((group, gi) => (
                <div key={gi} style={{
                  background: BG_CARD,
                  borderRadius: 12,
                  border: `1px solid ${BORDER}`,
                  padding: 28,
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                  }}>
                    <span style={{ fontSize: 20 }}>{group.icon}</span>
                    <h4 style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      color: TEXT_PRIMARY,
                      letterSpacing: 1,
                    }}>
                      {group.category}
                    </h4>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {group.skills.map((s, si) => (
                      <SkillBadge key={si} name={s} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ─── Projects ─── */}
          <Section id="projects">
            <SectionTitle label="04 — Work" title="Key Projects" />
            <div className="projects-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
            }}>
              <ProjectCard
                icon="📊"
                title="Power BI Dashboard Suite"
                description="Comprehensive dashboards tracking project timelines, vendor performance, and packaging defects. Replaced manual Excel trackers saving 6-8 hours per week and reducing project delays by 20%."
                tags={["Power BI", "Excel", "SQL", "Data Viz"]}
              />
              <ProjectCard
                icon="📦"
                title="Structural Packaging Design"
                description="Designed 2D/3D packaging models for major FMCG brands including ITC, Marico, Bosch, Britannia, and MTR Foods using ArtiosCAD and CIMEX."
                tags={["ArtiosCAD", "CIMEX", "Impact CAD", "3D Modeling"]}
              />
              <ProjectCard
                icon="🦷"
                title="Portable Dental Plaque Removal"
                description="Patented innovation — a novel portable ultrasonic scalar for oral prophylaxis in periodontal therapy. Designed for convenient on-the-go dental hygiene."
                tags={["Patent", "Product Design", "Medical Device", "Innovation"]}
              />
              <ProjectCard
                icon="📈"
                title="Automated Reporting Pipeline"
                description="Designed and implemented an automated weekly reporting system that saved 60% of manual preparation time, accelerating decision-making across teams."
                tags={["Power BI", "Automation", "Process Optimization"]}
              />
            </div>
          </Section>

          {/* ─── Education ─── */}
          <Section id="education">
            <SectionTitle label="05 — Learning" title="Education & Certifications" />
            <div className="edu-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              marginBottom: 48,
            }}>
              {[
                {
                  degree: "B.E. Mechanical",
                  school: "K.L.E College of Engineering & Technology, Belgaum",
                  period: "2020 — 2023",
                  score: "CGPA 7.2",
                },
                {
                  degree: "Diploma Mechanical",
                  school: "M.M.P Polytechnic, Belgaum",
                  period: "2017 — 2020",
                  score: "67.14%",
                },
                {
                  degree: "SSLC",
                  school: "M.V.M English Medium School",
                  period: "2017",
                  score: "85.12%",
                },
              ].map((edu, i) => (
                <div key={i} style={{
                  background: BG_CARD,
                  borderRadius: 12,
                  border: `1px solid ${BORDER}`,
                  padding: 28,
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: ACCENT,
                    letterSpacing: 1,
                  }}>
                    {edu.period}
                  </span>
                  <h4 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                    margin: "10px 0 8px",
                  }}>
                    {edu.degree}
                  </h4>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: TEXT_SECONDARY,
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}>
                    {edu.school}
                  </p>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    padding: "4px 12px",
                    borderRadius: 4,
                    background: `${ACCENT}15`,
                    color: ACCENT,
                    border: `1px solid ${ACCENT}33`,
                  }}>
                    {edu.score}
                  </span>
                </div>
              ))}
            </div>

            {/* Certification */}
            <div style={{
              background: BG_CARD,
              borderRadius: 12,
              border: `1px solid ${BORDER}`,
              padding: 28,
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: `${ACCENT}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0,
              }}>
                🎓
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h4 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  marginBottom: 4,
                }}>
                  Full Stack Data Science Professional Certification
                </h4>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: TEXT_SECONDARY,
                }}>
                  Business Toys Pvt Ltd — Data analysis, machine learning, and complete project development
                </p>
              </div>
            </div>

            {/* Achievement / Patent */}
            <div style={{
              background: `linear-gradient(135deg, ${BG_CARD}, ${ACCENT}08)`,
              borderRadius: 12,
              border: `1px solid ${ACCENT}22`,
              padding: 28,
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 24,
              flexWrap: "wrap",
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: `${ACCENT}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0,
              }}>
                🏆
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h4 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  marginBottom: 4,
                }}>
                  Patent — Portable Ultrasonic Scalar
                </h4>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: TEXT_SECONDARY,
                }}>
                  Novel device for oral prophylaxis in periodontal therapy — Application No. 202241045930 (June 2023)
                </p>
              </div>
            </div>
          </Section>

          {/* ─── Contact ─── */}
          <Section id="contact">
            <SectionTitle label="06 — Connect" title="Get In Touch" />
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              lineHeight: 1.8,
              color: TEXT_SECONDARY,
              maxWidth: 560,
              marginBottom: 40,
            }}>
              Interested in collaboration or want to discuss opportunities?
              I'm always open to connecting with fellow engineers, data enthusiasts,
              and innovators.
            </p>
            <div className="contact-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}>
              <ContactItem
                icon="✉️"
                label="Email"
                value="anupamnilajkar@gmail.com"
                href="mailto:anupamnilajkar@gmail.com"
              />
              <ContactItem
                icon="📞"
                label="Phone"
                value="+91 6364433902"
                href="tel:+916364433902"
              />
              <ContactItem
                icon="📍"
                label="Location"
                value="Shivaji Nagar, Belgaum"
              />
            </div>
          </Section>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer style={{
        position: "relative",
        zIndex: 1,
        borderTop: `1px solid ${BORDER}`,
        padding: "40px 24px",
        textAlign: "center",
      }}>
        <div style={container}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: TEXT_SECONDARY,
            letterSpacing: 1,
          }}>
            © {new Date().getFullYear()} Anupam Nilajkar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}