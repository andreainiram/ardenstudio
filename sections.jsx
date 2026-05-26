// Arden Studio — content sections

const { useEffect: useEffectS, useRef: useRefS, useState: useStateS } = React;

// Lightweight in-view trigger
function useInView(ref, opts = { rootMargin: "-15% 0px" }) {
  const [seen, setSeen] = useStateS(false);
  useEffectS(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {setSeen(true);io.disconnect();}
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, seen]);
  return seen;
}

function SectionHead({ num, title, lede }) {
  return (
    <div className="section-head">
      <div>
        <div className="num">{num}</div>
      </div>
      <div>
        <h2>{title.map((t, i) => <span key={i}>{t}{i < title.length - 1 ? <br /> : null}</span>)}</h2>
        {lede && <p className="lede" style={{ marginTop: 32 }}>{lede}</p>}
      </div>
    </div>);

}

// ---------- 01 — About / Studio ----------
function AboutSection({ t }) {
  return (
    <section className="paper" id="about" data-screen-label="about">
      <div className="container">
        <div className="about-intro">
          <div className="about-intro-left">
            <div className="num mono" style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.18em", opacity: 0.55, marginBottom: 18 }}>
              {t.about.num}
            </div>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(40px, 5.6vw, 84px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              margin: 0,
            }}>
              {t.about.title.map((s, i) => <span key={i}>{s}{i < t.about.title.length - 1 ? <br/> : null}</span>)}
            </h2>
            <p className="lede" style={{ fontSize: 17, lineHeight: 1.55, opacity: 0.78, maxWidth: "46ch", marginTop: 32 }}>
              {t.about.lede}
            </p>
          </div>

          <div className="about-intro-right">
            <p className="about-philosophy">{t.about.philosophy}</p>
            <div className="about-etym">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", opacity: 0.55, textTransform: "uppercase" }}>
                etimologia
              </div>
              <div className="about-etym-word serif">{t.about.etymology.word}</div>
              <div className="about-etym-gloss mono">
                <span style={{ opacity: 0.55 }}>{t.about.etymology.origin}</span>
                <span>{t.about.etymology.gloss}</span>
              </div>
            </div>
          </div>
        </div>

        {/* The space */}
        <div className="about-block">
          <h3 className="about-h3 serif">{t.about.spaceTitle}</h3>
          <p className="about-body">{t.about.spaceBody}</p>
        </div>

        {/* The methods */}
        <div className="about-block">
          <h3 className="about-h3 serif">{t.about.methodsTitle}</h3>
          <div className="about-methods">
            {t.about.methods.map((m, i) =>
            <div key={i} className="about-method">
                <h4 className="about-method-name serif">{m.name}</h4>
                <p className="about-method-body">{m.body}</p>
              </div>
            )}
          </div>
        </div>

        {/* Practical info — pricing + duration grid */}
        <div className="about-block">
          <h3 className="about-h3 serif">{t.about.infoTitle}</h3>
          <div className="about-info-grid">
            {t.about.info.map((row, i) =>
            <div key={i} className="about-info-cell">
                <div className="about-info-label mono">{row.label}</div>
                <div className="about-info-value serif">{row.value}</div>
              </div>
            )}
          </div>
        </div>

        {/* Policies */}
        <div className="about-block">
          <h3 className="about-h3 serif">{t.about.policiesTitle}</h3>
          <div className="about-policies">
            {t.about.policies.map((p, i) =>
            <div key={i} className="about-policy">
                <div className="about-policy-label mono">{p.label}</div>
                <p className="about-policy-body">{p.body}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ---------- 02 — Instagram strip ----------
// Pulls live posts from Behold's hosted JSON feed (no API key, no widget script
// — we render the tiles ourselves so the strip styling stays under our control).
// Manage the feed at https://behold.so/ and paste the feed-id below.
const BEHOLD_FEED_ID = "4YQcUSd7sKqFouHPvaQV";

function InstagramSection({ t }) {
  const stripRef = useRefS(null);
  const [posts, setPosts] = useStateS(null);
  const [errored, setErrored] = useStateS(false);

  // Fetch live feed
  useEffectS(() => {
    if (!BEHOLD_FEED_ID) return;
    let cancelled = false;
    fetch(`https://feeds.behold.so/${BEHOLD_FEED_ID}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((j) => { if (!cancelled) setPosts(j.posts || []); })
      .catch(() => { if (!cancelled) setErrored(true); });
    return () => { cancelled = true; };
  }, []);

  // Horizontal scroll on wheel for desktop
  useEffectS(() => {
    const el = stripRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [posts]);

  // Stylised fallback tiles (palette gradients) — used while loading or on error
  const fallbackTiles = [
    { bg: "linear-gradient(135deg, #3a2c20, #1f1610)", tag: "Megaformer" },
    { bg: "linear-gradient(160deg, #c1a380, #8a6a48)", tag: "Reformer · BASI®" },
    { bg: "linear-gradient(135deg, #1f1610, #53402f)", tag: "Lo studio" },
    { bg: "linear-gradient(135deg, #d9c4a6, #c1a380)", tag: "Group class" },
    { bg: "linear-gradient(135deg, #53402f, #2a1f15)", tag: "Cadillac" },
    { bg: "linear-gradient(135deg, #8a6a48, #53402f)", tag: "Mind & body" },
    { bg: "linear-gradient(135deg, #f5ede0, #d9c4a6)", tag: "Detail" },
    { bg: "linear-gradient(160deg, #2a1f15, #3a2c20)", tag: "Opening · 2026" },
  ];

  const hasLive = posts && posts.length > 0;
  const tiles = fallbackTiles;

  return (
    <section className="cream" id="instagram" data-screen-label="instagram">
      <div className="container">
        <div className="ig-head">
          <div>
            <div className="num mono" style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.18em", opacity: 0.55, marginBottom: 14 }}>
              {t.instagram.num}
            </div>
            <h2 className="serif" style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(40px, 5.2vw, 76px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              margin: 0,
            }}>
              {t.instagram.title.map((s, i) => <span key={i}>{s}{i < t.instagram.title.length - 1 ? <br/> : null}</span>)}
            </h2>
          </div>
          <div className="ig-meta">
            <a href={t.instagram.url} target="_blank" rel="noopener noreferrer" className="ig-handle mono">
              {t.instagram.handle} ↗
            </a>
            <p className="ig-lede">{t.instagram.lede}</p>
            <a href={t.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
              {t.instagram.cta}
            </a>
          </div>
        </div>
      </div>

      <div className="ig-strip-wrap">
        <div className="ig-strip" ref={stripRef}>
          {hasLive ? (
            posts.map((p, i) => {
              const img =
                p.sizes?.medium?.mediaUrl ||
                p.sizes?.large?.mediaUrl ||
                p.thumbnailUrl ||
                p.mediaUrl;
              const isVideo = p.mediaType === "VIDEO" || p.isReel;
              const caption = p.prunedCaption || p.caption || "";
              const tag = isVideo ? "Reel · Instagram" : "Instagram";
              return (
                <a
                  key={p.id || i}
                  href={p.permalink || t.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-tile ig-tile-live"
                  aria-label={caption.slice(0, 80) || `Post Instagram ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={caption.slice(0, 100) || "Arden Studio Instagram"}
                    loading="lazy"
                    className="ig-tile-img"
                  />
                  <span className="ig-tile-overlay" aria-hidden="true"></span>
                  <span className="ig-tile-tag mono">{tag}</span>
                  <svg className="ig-tile-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {isVideo ? (
                      <React.Fragment>
                        <polygon points="9,7 18,12 9,17" fill="currentColor" stroke="none"></polygon>
                        <rect x="3" y="3" width="18" height="18" rx="4.5"></rect>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <rect x="3" y="3" width="18" height="18" rx="4.5"></rect>
                        <circle cx="12" cy="12" r="4"></circle>
                        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor"></circle>
                      </React.Fragment>
                    )}
                  </svg>
                </a>
              );
            })
          ) : (
            tiles.map((tile, i) => (
              <a
                key={i}
                href={t.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-tile"
                style={{ background: tile.bg }}
                aria-label={`Foto ${i + 1} di Arden Studio su Instagram`}
              >
                <span className="ig-tile-num mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="ig-tile-tag mono">{tile.tag}</span>
                <svg className="ig-tile-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="4.5"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                  <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor"></circle>
                </svg>
              </a>
            ))
          )}
        </div>
        <div className="ig-strip-fade ig-strip-fade-left" aria-hidden="true"></div>
        <div className="ig-strip-fade ig-strip-fade-right" aria-hidden="true"></div>
      </div>
    </section>
  );
}

// ---------- 03 — Method ----------
function MethodSection({ t }) {
  return (
    <section className="cream" id="method" data-screen-label="method">
      <div className="container">
        <SectionHead num={t.method.num} title={t.method.title} lede={t.method.lede} />
        <div className="method-grid">
          {t.method.cards.map((c, i) =>
          <article key={i} className="method-card">
              <h3>{c.title}</h3>
              {c.subtitle && <div className="method-subtitle mono">{c.subtitle}</div>}
              <div className="method-body">
                {c.body.split(/\n\n+/).map((para, j) =>
              <p key={j}>{para}</p>
              )}
              </div>
              <div className="attrs">
                {c.attrs.map((a, j) => <span key={j} className="attr">{a}</span>)}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

}

// ---------- 02 — Booking (MindBody Branded Web: Schedule + Appointments) ----------

// Widget configuration: both tabs use Branded Web, so they share a single login session.
// Branded Web handles sign-in/registration inline via popup when a user clicks "Book".
const BOOKING_WIDGETS = {
  schedule: {
    type: "brandedweb",
    markup:
      '<div class="mindbody-widget" data-widget-type="Schedules" data-widget-id="9650572ff92"></div>',
  },
  appointments: {
    type: "brandedweb",
    markup:
      '<div class="mindbody-widget" data-widget-type="Appointments" data-widget-id="9655532ff92"></div>',
  },
};

// Inject the markup for a widget kind. Branded Web widget.js auto-detects new
// .mindbody-widget nodes via MutationObserver, so dynamic injection works automatically.
function MindbodyWidget({ kind }) {
  const ref = useRefS(null);
  useEffectS(() => {
    if (!ref.current) return;
    const cfg = BOOKING_WIDGETS[kind];
    if (!cfg) return;
    ref.current.innerHTML = cfg.markup;
  }, [kind]);
  return <div ref={ref} className="widget-container"></div>;
}

function BookingSection({ t }) {
  const TABS = [
    { key: "schedule", num: "01" },
    { key: "appointments", num: "02" },
  ];

  const [active, setActive] = useStateS("schedule");
  // Lazy-mount each tab on first visit; once mounted it stays in the DOM (hidden via CSS).
  const [mounted, setMounted] = useStateS({ schedule: true });

  const switchTab = (key) => {
    setActive(key);
    if (!mounted[key]) {
      setMounted((prev) => ({ ...prev, [key]: true }));
    }
  };

  return (
    <section className="dark" id="booking" data-screen-label="booking">
      <div className="container">
        <SectionHead num={t.booking.num} title={t.booking.title} lede={t.booking.lede} />

        <div className="booking-card">
          <span className="badge">{t.booking.badge}</span>

          <div className="booking-tabs" role="tablist">
            {TABS.map((tab) =>
              <button
                key={tab.key}
                role="tab"
                aria-selected={active === tab.key}
                className={"booking-tab" + (active === tab.key ? " active" : "")}
                onClick={() => switchTab(tab.key)}
                type="button"
              >
                <span className="booking-tab-num">{tab.num}</span>
                <span className="booking-tab-label">{t.booking.tabs[tab.key].label}</span>
              </button>
            )}
          </div>

          <p className="booking-tab-sub">{t.booking.tabs[active].sub}</p>

          <div className="booking-widget-stack">
            {TABS.map((tab) =>
              mounted[tab.key] ? (
                <div
                  key={tab.key}
                  className="booking-widget-slot"
                  role="tabpanel"
                  hidden={active !== tab.key}
                  style={{ display: active === tab.key ? "block" : "none" }}
                >
                  <MindbodyWidget kind={tab.key} />
                </div>
              ) : null
            )}
          </div>

          <div className="booking-footer-meta">
            <span>Site #134138</span>
            <span>SSL secured</span>
          </div>
        </div>

        <ul className="booking-perks">
          {t.booking.perks.map((p, i) =>
            <li key={i}>
              <span className="booking-perks-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="booking-perks-text">{p}</span>
            </li>
          )}
        </ul>
      </div>
    </section>);

}

// ---------- 03 — Waitlist ----------
function WaitlistSection({ t }) {
  const [email, setEmail] = useStateS("");
  const [done, setDone] = useStateS(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    // Production-ready stub — replace with mailing list API
    setDone(true);
  };

  return (
    <section className="cream" id="waitlist" data-screen-label="waitlist">
      <div className="container">
        <div className="waitlist-row">
          <div className="waitlist-head">
            <div className="num" style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.18em", opacity: 0.55, marginBottom: 18 }}>
              {t.waitlist.num}
            </div>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(40px, 5.6vw, 84px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              margin: 0,
            }}>
              {t.waitlist.title.map((s, i) =>
                <span key={i}>{s}{i < t.waitlist.title.length - 1 ? <br/> : null}</span>
              )}
            </h2>
            <p className="lede" style={{ fontSize: 17, lineHeight: 1.55, opacity: 0.78, maxWidth: "46ch", marginTop: 28 }}>
              {t.waitlist.lede}
            </p>
          </div>
          <div className="waitlist">
            {done ?
              <p className="success">{t.waitlist.success}</p> :
              <form onSubmit={submit}>
                <input
                  type="email"
                  required
                  placeholder={t.waitlist.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">{t.waitlist.cta}</button>
              </form>
            }
            <span className="note">{t.waitlist.note}</span>
          </div>
        </div>
      </div>
    </section>);

}

// ---------- 04 — Contact / Map ----------
function ContactSection({ t }) {
  return (
    <section className="paper" id="contact" data-screen-label="contact">
      <div className="container">
        <SectionHead num={t.contact.num} title={t.contact.title} lede={t.contact.lede} />
        <div className="contact-grid">
          <div className="contact-info">
            <dl>
              <dt>{t.contact.labels.studio}</dt>
              <dd style={{ whiteSpace: "pre-line" }}>{t.contact.studio}</dd>

              <dt>{t.contact.labels.email}</dt>
              <dd><a href={`mailto:${t.contact.email}`} style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}>{t.contact.email}</a></dd>

              <dt>{t.contact.labels.instagram}</dt>
              <dd>
                <a href="https://www.instagram.com/ardenstudio_lagreepilates/" target="_blank" rel="noopener noreferrer" style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}>
                  {t.contact.instagram}
                </a>
              </dd>

              <dt>{t.contact.labels.hours}</dt>
              <dd style={{ whiteSpace: "pre-line" }}>{t.contact.hours}</dd>
            </dl>
          </div>

          <div className="map-frame">
            <iframe
              title="Arden Studio — Via Marsala 2, Torino"
              loading="lazy"
              src="https://www.google.com/maps?q=Via+Marsala+2,+10133+Torino,+Italia&hl=it&z=16&output=embed"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ filter: "saturate(0.7) contrast(0.95)" }}>
            </iframe>
            <div style={{
              position: "absolute",
              left: 16, top: 16,
              padding: "6px 12px",
              background: "var(--paper)",
              color: "var(--ink)",
              borderRadius: 999,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              whiteSpace: "nowrap"
            }}>
              Via Marsala 2 · Torino
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ---------- Footer ----------
function FooterSection({ t }) {
  return (
    <footer className="foot" data-screen-label="footer">
      <div className="container">
        <div className="row">
          <div className="eyebrow" style={{ opacity: 0.65 }}>{t.foot.tag}</div>
        </div>
        <div className="marque" data-comment-anchor="cc-2">
          <img
            src="assets/arden-monogram.png"
            alt="Arden Studio"
            style={{

              height: "auto",
              display: "block",
              margin: "48px auto 32px", width: "150px"
            }}
            draggable={false} />
          
        </div>
        <div className="divider"></div>
        <div className="row" style={{ marginTop: 24 }}>
          <div className="colofon">{t.foot.colofon}</div>
          <div className="colofon">{t.foot.rights}</div>
        </div>
      </div>
    </footer>);

}

window.ArdenSections = { AboutSection, InstagramSection, MethodSection, BookingSection, WaitlistSection, ContactSection, FooterSection };