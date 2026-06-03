// ─────────────────────────────────────────────────────────────
// Header · Home · Footer
// ─────────────────────────────────────────────────────────────

const Header = ({ onLogo, cartCount = 0, onCart }) => (
  <React.Fragment>
    <div className="topbar">
      <div className="container topbar-in">
        <IconFactory size={15} />
        <span><b className="tb-strong">SANHUA es el fabricante detrás de tu equipo</b><span className="tb-sep"> · </span><span className="tb-soft">el mismo componente original de fábrica</span></span>
      </div>
    </div>
    <header className="header">
      <div className="container header-in">
        <button className="brand" onClick={onLogo} aria-label="Inicio">
          <img className="brand-mark" src={(window.__resources||{}).markLogo||"assets/sanhua-mark.png"} alt="SANHUA" />
          <span className="brand-text">
            <span className="brand-name">SANHUA <span className="brand-ya">YA</span></span>
            <span className="brand-tag">Repuestos HVAC/R · Argentina</span>
          </span>
        </button>
        <nav className="header-nav">
          {cartCount > 0 && (
            <button className="cart-chip" onClick={onCart} aria-label="Ver cotización">
              <IconClipboard size={17} /> <span className="cart-chip-n">{cartCount}</span>
            </button>
          )}
          <WppButton text="WhatsApp" className="btn btn-wpp btn-sm" />
        </nav>
      </div>
    </header>
  </React.Fragment>
);

const Home = ({ go, goApp, openApp }) => (
  <div className="fade">
    {/* HERO */}
    <section className="hero">
      <div className="hero-copy">
        <span className="pill"><span className="pill-dot" /> Distribuidor oficial SANHUA · Argentina</span>
        <h1 className="hero-h1">El repuesto original,<br /><span className="accent">entregado donde estés.</span></h1>
        <p className="hero-p">
          Encontrá el componente SANHUA exacto para tu Daikin, Samsung, LG,
          Carrier, Gree, Midea o Hisense — con el código original de fábrica. Lo cotizás
          online y coordinamos precio y entrega por WhatsApp.
        </p>
        <div className="hero-cta">
          <button className="btn btn-primary btn-lg" onClick={go}>
            <IconSearch size={18} /> Buscar por marca
          </button>
          <button className="btn btn-outline btn-lg" onClick={goApp}>
            <IconClipboard size={18} /> Buscar por aplicación
          </button>
        </div>
        <div className="hero-trust">
          {CERTS.slice(0, 5).map((c) => <span key={c} className="cert">{c}</span>)}
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-video-frame">
          <video className="hero-video" src={(window.__resources||{}).heroVideo||"assets/sanhua-video.mp4"}
            autoPlay muted loop playsInline poster={(window.__resources||{}).anuncioPng||"assets/sanhua-anuncio.png"} />
          <span className="hero-video-tag"><span className="pill-dot" /> Componente original de fábrica</span>
        </div>
        <span className="float f1" aria-hidden="true"><IconWrench size={20} /></span>
        <span className="float f3" aria-hidden="true"><IconGauge size={20} /></span>
      </div>
    </section>

    {/* ANUNCIO — imagen destacada */}
    <section className="anuncio">
      <div className="anuncio-media">
        <img src={(window.__resources||{}).anuncioPng||"assets/sanhua-anuncio.png"} alt="SANHUA: el corazón de tu aire acondicionado — componentes originales detrás de las marcas líderes." />
      </div>
      <div className="anuncio-copy">
        <span className="pill alt"><IconFactory size={14} /> El fabricante de fabricantes</span>
        <h2 className="anuncio-h2">El corazón de tu equipo es SANHUA.</h2>
        <p className="anuncio-p">
          Válvulas, filtros, bobinas y sensores SANHUA vienen instalados de fábrica en los
          equipos de las marcas líderes. Reponé con <b>el mismo componente original</b> — no con un genérico.
        </p>
        <WppButton text="Consultar disponibilidad" className="btn btn-wpp" />
      </div>
    </section>

    {/* BUSCAR POR APLICACIÓN */}
    <section className="block">
      <h2 className="block-title">Buscar por aplicación</h2>
      <p className="block-sub">¿No tenés el modelo a mano? Elegí dónde se usa el repuesto.</p>
      <div className="grid grid-apps">
        {APLICACIONES.map((a) => {
          const AIcon = ICONS[a.icon] || IconWrench;
          const n = a.repuestos.length;
          return (
            <button key={a.id} className="app-tile" onClick={() => openApp(a)}>
              <span className="app-tile-ico"><AIcon size={22} /></span>
              <span className="app-tile-name">{a.nombre}</span>
              <span className="app-tile-desc">{a.desc}</span>
              <span className="app-tile-meta">
                {a.marcaFlow
                  ? <React.Fragment>Elegí tu marca <IconArrowRight size={14} /></React.Fragment>
                  : <React.Fragment>{n} repuesto{n === 1 ? "" : "s"} <IconArrowRight size={14} /></React.Fragment>}
              </span>
            </button>
          );
        })}
      </div>
    </section>

    {/* CÓMO FUNCIONA */}
    <section className="block">
      <h2 className="block-title">Cómo funciona</h2>
      <div className="grid grid-3">
        {[
          { I: IconSearch, t: "1 · Marca y modelo", d: "Elegí la marca de tu equipo y su serie. Mostramos solo lo compatible." },
          { I: IconClipboard, t: "2 · Componente exacto", d: "Confirmá el código Sanhua correcto, con su equivalencia OEM de fábrica." },
          { I: IconWhatsApp, t: "3 · Cotizá y recibilo", d: "Te pasamos precio y disponibilidad por WhatsApp, y coordinamos la entrega." },
        ].map((c, i) => (
          <div key={i} className="how">
            <span className="how-ico"><c.I size={24} /></span>
            <div className="how-t">{c.t}</div>
            <div className="how-d">{c.d}</div>
          </div>
        ))}
      </div>
    </section>

    {/* CONOCÉ LOS COMPONENTES */}
    <section className="block">
      <h2 className="block-title">Conocé cada componente</h2>
      <p className="block-sub">Qué hace cada pieza SANHUA y dónde se ubica dentro de tu equipo.</p>
      <div className="grid comp-grid">
        {COMPONENTES_INFO.map((c) => {
          const img = prodImg(c.categoria, null, c.nombre);
          return (
          <article key={c.id} className="comp-card">
            <div className={"comp-iso" + (img ? " comp-iso--photo" : "")} role="img" aria-label={c.iso}>
              {img
                ? <img className="comp-iso-img" src={img} alt={c.nombre} />
                : <React.Fragment>
                    <span className="comp-iso-ico"><PartIcon categoria={c.categoria} size={30} /></span>
                    <span className="comp-iso-label">{c.iso}</span>
                  </React.Fragment>
              }
            </div>
            <div className="comp-body">
              <div className="comp-head">
                <span className="comp-ico"><PartIcon categoria={c.categoria} size={22} /></span>
                <h3 className="comp-name">{c.nombre}</h3>
              </div>
              <div className="comp-block">
                <span className="comp-k">Función principal</span>
                <p className="comp-t">{c.funcion}</p>
              </div>
              <div className="comp-block comp-loc">
                <span className="comp-k"><IconMapPin size={14} /> Ubicación</span>
                <p className="comp-t">{c.ubicacion}</p>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </section>

    {/* SANHUA — EL FABRICANTE */}
    <section className="block band">
      <div className="band-head">
        <span className="pill alt"><IconFactory size={14} /> Componente original de fábrica</span>
        <h2 className="band-title">SANHUA es el fabricante detrás de tu equipo</h2>
        <p className="band-p">
          Fundada en 1984, SANHUA es uno de los principales proveedores OEM de la industria HVAC/R:
          válvulas de expansión, válvulas reversibles de 4 vías, sensores e intercambiadores que vienen
          instalados de fábrica en equipos de las marcas más grandes del mundo. Reponer con SANHUA es
          colocar <b>la misma pieza original</b> que traía tu equipo.
        </p>
      </div>

      <div className="grid grid-4 metrics">
        {SANHUA_FACTS.map((m, i) => (
          <div key={i} className="metric">
            <div className="metric-n">{m.n}</div>
            <div className="metric-t">{m.t}</div>
          </div>
        ))}
      </div>

      <div className="oem">
        <div className="oem-label">Fabricantes que equipan sus productos con componentes SANHUA</div>
        <div className="oem-chips">
          {OEM.map((m) => <span key={m} className="oem-chip">{m}</span>)}
        </div>
        <div className="oem-note">Marcas mencionadas solo a fines de compatibilidad. No representan vínculo comercial.</div>
      </div>

      <div className="band-cta">
        <button className="btn btn-primary btn-lg" onClick={go}>
          Buscá tu repuesto original <IconArrowRight size={18} />
        </button>
      </div>
    </section>
  </div>
);

const Footer = () => (
  <footer className="footer">
    <div className="container footer-in">
      <div className="footer-brand">
        <img className="brand-mark sm" src={(window.__resources||{}).markLogo||"assets/sanhua-mark.png"} alt="SANHUA" />
        <span>SANHUA <b>YA</b></span>
      </div>
      <div className="footer-certs">
        {CERTS.map((c) => <span key={c} className="cert">{c}</span>)}
      </div>
      <div className="footer-legal">Prototipo demostrativo · Repuestos HVAC/R · No es un sitio comercial real</div>
    </div>
  </footer>
);

Object.assign(window, { Header, Home, Footer });
