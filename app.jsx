// Arden Studio — main app

const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp } = React;
const { HeroA, HeroB, HeroC } = window.ArdenHeroes;
const { AboutSection, InstagramSection, MethodSection, BookingSection, ContactSection, FooterSection } = window.ArdenSections;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor, TweakSelect } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "A",
  "accent": ["#1f1610", "#c1a380", "#f5ede0"],
  "order": "about-instagram-method-booking-contact"
}/*EDITMODE-END*/;

// Map a chosen palette array → CSS vars
function applyPalette(palette) {
  const [dark, accent, soft] = palette;
  const root = document.documentElement;
  root.style.setProperty("--bg-dark", dark);
  root.style.setProperty("--bg-soft", soft);
  root.style.setProperty("--accent", accent);
  // derive ink (text on soft) by darkening — but simpler: keep ink fixed, swap only the surfaces
}

const PALETTES = [
  ["#1f1610", "#c1a380", "#f5ede0"], // Espresso — deep, moody (default)
  ["#3a2c20", "#b48a5d", "#efe6d4"], // Coffee — warm, mid
  ["#53402f", "#cdb18a", "#f7f1e6"], // Bronze — original site brown
  ["#2a1f15", "#d9c4a6", "#faf5eb"], // Onyx — high contrast, lighter tan
];

const SECTION_ORDERS = {
  "about-instagram-method-booking-contact": ["about", "instagram", "method", "booking", "contact"],
  "about-method-instagram-booking-contact": ["about", "method", "instagram", "booking", "contact"],
  "booking-about-instagram-method-contact":  ["booking", "about", "instagram", "method", "contact"],
};

function App() {
  const [lang, setLang] = useStateApp(() => {
    return localStorage.getItem("arden_lang") || "it";
  });
  useEffectApp(() => { localStorage.setItem("arden_lang", lang); }, [lang]);

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply palette whenever tweak changes
  useEffectApp(() => { applyPalette(tweaks.accent); }, [tweaks.accent]);

  // Scroll to top when hero variant changes (so the user sees the new hero)
  const heroRef = React.useRef(tweaks.hero);
  useEffectApp(() => {
    if (heroRef.current !== tweaks.hero) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      heroRef.current = tweaks.hero;
    }
  }, [tweaks.hero]);

  // Track scroll position to swap topbar color on dark sections
  const heroIsDark = tweaks.hero === "A";
  const [onDark, setOnDark] = useStateApp(heroIsDark);
  useEffectApp(() => {
    setOnDark(heroIsDark);
    const update = () => {
      const els = document.querySelectorAll("section.dark, .hero.hero-a, footer.foot");
      const y = window.scrollY + 32;
      let hit = false;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        const bot = top + r.height;
        if (y >= top && y < bot) hit = true;
      });
      setOnDark(hit);
    };
    const id = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [tweaks.hero, tweaks.order, heroIsDark]);

  const t = window.COPY[lang];

  // Mobile nav drawer state — closes on resize / link click
  const [menuOpen, setMenuOpen] = useStateApp(false);
  useEffectApp(() => {
    if (!menuOpen) return;
    const onResize = () => { if (window.innerWidth > 880) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Pick the hero component
  const Hero = tweaks.hero === "A" ? HeroA : tweaks.hero === "B" ? HeroB : HeroC;

  // Build the sections in chosen order
  const sectionMap = {
    about:     <AboutSection key="about" t={t} />,
    instagram: <InstagramSection key="instagram" t={t} />,
    method:    <MethodSection key="method"  t={t} />,
    booking:   <BookingSection key="booking" t={t} />,
    contact:   <ContactSection key="contact" t={t} />,
  };
  const order = SECTION_ORDERS[tweaks.order] || SECTION_ORDERS["about-instagram-method-booking-contact"];

  return (
    <React.Fragment>
      {/* Topbar */}
      <header className={"topbar" + (onDark ? " on-dark" : "") + (menuOpen ? " menu-open" : "")}>
        <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
          <img src="assets/Ardenlogo.png" alt="Arden Studio" style={{ height: 114, width: "auto" }} draggable={false} />
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="menu-toggle-bar"></span>
          <span className="menu-toggle-bar"></span>
          <span className="menu-toggle-bar"></span>
        </button>
        <nav className={"topbar-nav" + (menuOpen ? " open" : "")}>
          <a href="#about" onClick={() => setMenuOpen(false)}>{t.nav.about}</a>
          <a href="#method" onClick={() => setMenuOpen(false)}>{t.nav.method}</a>
          <a href="#booking" onClick={() => setMenuOpen(false)}>{t.nav.booking}</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>{t.nav.contact}</a>
          <a href="#booking" onClick={() => setMenuOpen(false)}>{t.nav.account}</a>
          <div className="lang-toggle">
            <button
              onClick={() => setLang("it")}
              className={lang === "it" ? "active" : ""}
              style={lang === "it" ? {
                backgroundColor: onDark ? "#faf5eb" : "#2a1f15",
                color: onDark ? "#2a1f15" : "#faf5eb",
              } : undefined}
            >
              IT
            </button>
            <button
              onClick={() => setLang("en")}
              className={lang === "en" ? "active" : ""}
              style={lang === "en" ? {
                backgroundColor: onDark ? "#faf5eb" : "#2a1f15",
                color: onDark ? "#2a1f15" : "#faf5eb",
              } : undefined}
            >
              EN
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <Hero t={t} />
        {order.map((id) => sectionMap[id])}
        <FooterSection t={t} />
      </main>

      <TweaksPanel title="Tweaks · Arden">
        <TweakSection label="Hero layout">
          <TweakRadio
            label="Variant"
            value={tweaks.hero}
            onChange={(v) => setTweak("hero", v)}
            options={[
              { value: "A", label: "Centered" },
              { value: "B", label: "Split" },
              { value: "C", label: "Marquee" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Color emphasis">
          <TweakColor
            label="Palette"
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={PALETTES}
          />
          <div style={{ fontSize: 11, opacity: 0.6, lineHeight: 1.5, marginTop: 6 }}>
            Each option swaps the dark surface, the accent gold, and the soft cream together.
          </div>
        </TweakSection>

        <TweakSection label="Section order">
          <TweakSelect
            label="Order"
            value={tweaks.order}
            onChange={(v) => setTweak("order", v)}
            options={[
              { value: "about-instagram-method-booking-contact", label: "Studio → IG → Method → Booking → Contact" },
              { value: "about-method-instagram-booking-contact", label: "Studio → Method → IG → Booking → Contact" },
              { value: "booking-about-instagram-method-contact", label: "Booking → Studio → IG → Method → Contact" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
