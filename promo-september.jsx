// Arden Studio — Hello, September promo popup ("Back to the city")

const { useState: useStateSep, useEffect: useEffectSep } = React;

const SEPT_PROMOS = [
  { id: 103, cat: { it: "Body Shape",       en: "Body Shape" },
             sessions: { it: "3 Lagree · 3 Pilates",                   en: "3 Lagree · 3 Pilates" },                   price: 205 },
  { id: 104, cat: { it: "Body Shape",       en: "Body Shape" },
             sessions: { it: "5 Lagree · 5 Pilates",                   en: "5 Lagree · 5 Pilates" },                   price: 350 },
  { id: 105, cat: { it: "+ Osteopata",      en: "+ Osteopathy" },
             sessions: { it: "3 Lagree · 3 Pilates · 1 Osteopata",     en: "3 Lagree · 3 Pilates · 1 Osteopathy" },    price: 285 },
  { id: 106, cat: { it: "+ Osteopata",      en: "+ Osteopathy" },
             sessions: { it: "5 Lagree · 5 Pilates · 2 Osteopata",     en: "5 Lagree · 5 Pilates · 2 Osteopathy" },    price: 510 },
  { id: 107, cat: { it: "+ Linfodrenante",  en: "+ Lymphatic Drainage" },
             sessions: { it: "3 Lagree · 3 Pilates · 1 Linfodrenante", en: "3 Lagree · 3 Pilates · 1 Lymphatic" },     price: 315 },
  { id: 108, cat: { it: "+ Linfodrenante",  en: "+ Lymphatic Drainage" },
             sessions: { it: "5 Lagree · 5 Pilates · 2 Linfodrenanti", en: "5 Lagree · 5 Pilates · 2 Lymphatic" },     price: 570 },
];

const cartUrl = (id) => `https://cart.mindbodyonline.com/sites/134138/cart/add_contract?mbo_item_id=${id}`;

function SeptemberPromoPopup() {
  const [visible, setVisible] = useStateSep(false);
  const lang = (typeof localStorage !== "undefined" && localStorage.getItem("arden_lang")) || "it";

  useEffectSep(() => {
    if (sessionStorage.getItem("sept_promo_dismissed")) return;
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffectSep(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [visible]);

  function dismiss() {
    setVisible(false);
    try { sessionStorage.setItem("sept_promo_dismissed", "1"); } catch (e) {}
  }

  if (!visible) return null;

  return (
    <div
      className="sept-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
      role="presentation"
    >
      <div className="sept-popup" role="dialog" aria-modal="true" aria-labelledby="sept-title">
        <button className="sept-close" onClick={dismiss} aria-label={lang === "it" ? "Chiudi" : "Close"}>×</button>

        <div className="sept-header">
          <h2 id="sept-title" className="sept-title">
            Hello, <em>September</em>
          </h2>
          <p className="sept-sub">
            {lang === "it"
              ? "Torna in forma. Bentornato in città."
              : "Get back in shape. Welcome back to the city."}
          </p>
        </div>

        <div className="sept-cards">
          {SEPT_PROMOS.map((p) => (
            <a
              key={p.id}
              className="sept-card"
              href={cartUrl(p.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="sept-card-cat">{p.cat[lang] || p.cat.it}</div>
              <div className="sept-card-sessions">{p.sessions[lang] || p.sessions.it}</div>
              <div className="sept-card-price">
                <span className="sept-currency">€</span>{p.price}
              </div>
              <div className="sept-card-cta">
                {lang === "it" ? "Acquista" : "Buy now"} <span className="sept-arrow">→</span>
              </div>
            </a>
          ))}
        </div>

        <button className="sept-dismiss-link" onClick={dismiss}>
          {lang === "it" ? "No grazie, chiudi" : "No thanks, close"}
        </button>
      </div>
    </div>
  );
}

window.ArdenSeptember = { SeptemberPromoPopup };
