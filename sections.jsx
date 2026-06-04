// ─────────────────────────────────────────────────────────────
// Header · Home · Footer
// ─────────────────────────────────────────────────────────────

// Tabla OEM expandible
const TIPO_META = {
  directo:    { label: "OEM directo",  desc: "Documentado por Sanhua o en listas de partes",          color: "var(--green, #1a7a4a)" },
  global:     { label: "OEM global",   desc: "Relación confirmada a nivel global por Sanhua",          color: "var(--orange, #ef741b)" },
  plataforma: { label: "Plataforma",   desc: "Sanhua heredado del OEM fabricante base",                color: "var(--brand, #1763ad)"  },
};

function OemTable() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="oem">
      <div className="oem-label">Fabricantes que equipan sus productos con componentes SANHUA</div>
      <div className="oem-chips">
        {OEM.map((m) => <span key={m} className="oem-chip">{m}</span>)}
      </div>

      <button className="oem-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? "Ocultar detalle ▲" : "Ver relación OEM por marca ▼"}
      </button>

      {open && (
        <div className="oem-table-wrap">
          <table className="oem-table">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Componentes Sanhua</th>
                <th>Segmento en Argentina</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {OEM_DETALLE.map((r) => (
                <tr key={r.marca}>
                  <td>
                    <span className="oem-row-brand">
                      <span className="oem-av" style={{ background: `hsl(${r.hue} 60% 88%)`, color: `hsl(${r.hue} 50% 28%)` }}>{r.ini}</span>
                      <b>{r.marca}</b>
                    </span>
                  </td>
                  <td className="oem-td-comp">{r.componentes}</td>
                  <td className="oem-td-seg">{r.segmento}</td>
                  <td>
                    <span className="oem-tipo" data-tipo={r.tipo}>{TIPO_META[r.tipo].label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="oem-table-leyenda">
            {Object.entries(TIPO_META).map(([k, v]) => (
              <span key={k} className="oem-ley-item">
                <span className="oem-tipo" data-tipo={k}>{v.label}</span>
                <span className="oem-ley-desc">{v.desc}</span>
              </span>
            ))}
          </div>
          <p className="oem-table-note">
            Las marcas mencionadas son propiedad de sus respectivos dueños. Su referencia es exclusivamente a fines de compatibilidad técnica y no implica afiliación ni respaldo comercial.
          </p>
        </div>
      )}
    </div>
  );
}

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

      <OemTable />

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
      <div className="footer-legal">
        <p>
          <b>Aviso legal:</b> Este sitio fue desarrollado con asistencia de inteligencia artificial con fines demostrativos.
          La información presentada (códigos de producto, compatibilidades, equivalencias y relaciones OEM) se basa en
          fuentes públicas y puede contener inexactitudes o estar desactualizada. <b>Verificá siempre los datos con el
          distribuidor oficial antes de realizar una compra o reparación.</b>
        </p>
        <p>
          Las marcas comerciales mencionadas (Daikin, LG, Samsung, Gree, Carrier, Midea, Hisense, BGH, Philco, y otras)
          son propiedad de sus respectivos dueños. Su mención es exclusivamente a fines de indicar compatibilidad técnica
          y no implica ninguna afiliación, patrocinio ni relación comercial con dichas empresas.
          SANHUA y su logotipo son marcas registradas de Sanhua International Inc.
        </p>
        <p className="footer-ai">✦ Contenido generado con asistencia de IA · Sujeto a cambios sin previo aviso · No constituye asesoramiento técnico profesional</p>
      </div>
    </div>
  </footer>
);

Object.assign(window, { Header, Home, Footer });
