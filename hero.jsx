// Arden Studio — Hero variants

const { useEffect, useState, useRef } = React;

// Animated monogram — uses the PNG with a circular clip-path reveal + soft scale
function Monogram({ size = 168, delay = 0, style = "draw", variant = "light" }) {
  // variant: "light" (gold on dark) | "dark" (just the original look)
  // style: "draw" (clip-circle reveal) | "fade" (scale + fade) | "rotate" (rotate in)
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const baseImg = {
    width: size,
    height: size,
    objectFit: "contain",
    display: "block",
    transition: "transform 1.4s cubic-bezier(.2,.7,.2,1), opacity 1.2s ease-out, clip-path 1.6s cubic-bezier(.7,.1,.2,1)",
  };

  let style2 = {};
  if (style === "draw") {
    style2 = {
      clipPath: show ? "circle(60% at 50% 50%)" : "circle(0% at 50% 50%)",
      opacity: show ? 1 : 0,
    };
  } else if (style === "fade") {
    style2 = {
      transform: show ? "scale(1)" : "scale(0.7)",
      opacity: show ? 1 : 0,
    };
  } else if (style === "rotate") {
    style2 = {
      transform: show ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.6)",
      opacity: show ? 1 : 0,
    };
  }

  return (
    <div style={{ width: size, height: size, display: "grid", placeItems: "center" }}>
      <img
        src="assets/arden-monogram.png"
        alt="Arden Studio monogram"
        style={{ ...baseImg, ...style2 }}
        draggable={false}
      />
    </div>
  );
}

// Live countdown to June 1, 2026
function useCountdown(target) {
  const [t, setT] = useState(() => calc(target));
  useEffect(() => {
    const id = setInterval(() => setT(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}
function calc(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
}

function Countdown({ labels }) {
  const target = new Date("2026-06-01T09:00:00");
  const { days, hours, mins, secs } = useCountdown(target);
  const cells = [
    { v: String(days).padStart(2,'0'), l: labels[0] },
    { v: String(hours).padStart(2,'0'), l: labels[1] },
    { v: String(mins).padStart(2,'0'), l: labels[2] },
    { v: String(secs).padStart(2,'0'), l: labels[3] },
  ];
  return (
    <div className="countdown">
      {cells.map((c, i) => (
        <React.Fragment key={i}>
          <div className="cell">
            <span className="num">{c.v}</span>
            <span>{c.l}</span>
          </div>
          {i < cells.length - 1 && (
            <div style={{ alignSelf: "center", opacity: 0.4, fontSize: 18, fontFamily: "var(--font-serif)" }}>·</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ----- HERO A — Centered Stage (dark) -----
function HeroA({ t }) {
  return (
    <section className="hero hero-a" data-hero="A">
      <div className="container">
        <div className="stack">
          <div className="opening-pill fade-up"><span className="pulse"></span>{t.opening}</div>
          <div className="monogram-wrap">
            <Monogram size={168} delay={200} style="draw" />
          </div>
          <h1 className="fade-up d1">
            {t.hero.titleA[0]} <br />
            <em>{t.hero.titleA[1]}</em> {t.hero.titleA[2]}
          </h1>
          <p className="sub fade-up d2">{t.hero.subA}</p>
          <Countdown labels={t.hero.countdownLabel} />
          <div className="cta-row fade-up d4">
            <a href="#booking" className="btn btn-primary">{t.hero.ctaPrimary}</a>
            <a href="#method" className="btn btn-ghost-dark">{t.hero.ctaSecondary}</a>
          </div>
        </div>
      </div>
      <div className="scroll-hint">
        <span>scroll</span>
        <span className="line"></span>
      </div>
    </section>
  );
}

// ----- HERO B — Editorial Split -----
function HeroB({ t }) {
  return (
    <section className="hero hero-b" data-hero="B">
      <div className="container">
        <div className="grid">
          <div className="left">
            <div className="opening-pill fade-up" style={{ alignSelf: "flex-start" }}>
              <span className="pulse"></span>{t.opening}
            </div>
            <h1 className="fade-up d1">
              {t.hero.titleB[0]}
              <br />
              <span className="em">{t.hero.titleB[1]} {t.hero.titleB[2]}</span>
            </h1>
            <p className="sub fade-up d2">{t.hero.subB}</p>
            <Countdown labels={t.hero.countdownLabel} />
            <div className="cta-row fade-up d4">
              <a href="#booking" className="btn btn-primary">{t.hero.ctaPrimary}</a>
              <a href="#waitlist" className="btn btn-ghost-light">{t.hero.ctaTertiary}</a>
            </div>
          </div>
          <div className="right">
            <span className="label">Torino · IT</span>
            <span className="label r">Est. 2026</span>
            <span className="label b">45.06° N · 7.69° E</span>
            <div className="monogram-wrap">
              <Monogram size={320} delay={400} style="fade" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- HERO C — Marquee Motion -----
function HeroC({ t }) {
  return (
    <section className="hero hero-c" data-hero="C">
      <div style={{ position: "absolute", top: 96, left: 0, right: 0, paddingLeft: 48, paddingRight: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="opening-pill fade-up"><span className="pulse"></span>{t.opening}</div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6 }}>
            Lagree · Pilates · Torino
          </div>
        </div>
      </div>

      <div style={{ width: "100%", marginTop: 64 }}>
        <div className="marquee">
          <div className="row">
            <span>Arden</span><span className="dot"></span>
            <span><em>Studio</em></span><span className="dot"></span>
            <span>Arden</span><span className="dot"></span>
            <span><em>Studio</em></span><span className="dot"></span>
            <span>Arden</span><span className="dot"></span>
            <span><em>Studio</em></span><span className="dot"></span>
          </div>
        </div>

        <div className="container">
          <div className="center-row">
            <div className="left fade-up d2">
              <span className="eyebrow">{t.hero.subC}</span>
              <p>{t.hero.subC2}</p>
              <Countdown labels={t.hero.countdownLabel} />
            </div>
            <div className="monogram-wrap fade-up">
              <Monogram size={200} delay={300} style="rotate" />
            </div>
            <div className="right fade-up d3">
              <span className="eyebrow">Founding members</span>
              <p>{t.method.lede.split('.')[0]}.</p>
              <div className="cta-row">
                <a href="#booking" className="btn btn-primary">{t.hero.ctaPrimary}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="marquee" style={{ marginTop: 16 }}>
          <div className="row" style={{ animationDirection: "reverse", animationDuration: "36s" }}>
            <span>Move</span><span className="dot"></span>
            <span><em>gently</em></span><span className="dot"></span>
            <span>grow</span><span className="dot"></span>
            <span><em>strong</em></span><span className="dot"></span>
            <span>Move</span><span className="dot"></span>
            <span><em>gently</em></span><span className="dot"></span>
            <span>grow</span><span className="dot"></span>
            <span><em>strong</em></span><span className="dot"></span>
          </div>
        </div>
      </div>
    </section>
  );
}

window.ArdenHeroes = { HeroA, HeroB, HeroC, Monogram };
