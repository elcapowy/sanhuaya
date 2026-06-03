// ─────────────────────────────────────────────────────────────
// SANHUA YA — App principal
// Flujo: Tipo de equipo → Marca → Serie/Modelo → Componentes (carrito) → Cotización → Listo
// Catálogo real en window.CATALOGO (catalogo.js)
// ─────────────────────────────────────────────────────────────
const { useState, useMemo, useEffect } = React;

function App() {
  const [step, setStep] = useState(0); // 0 home · 1 tipo · 2 marca · 3 serie · 4 comp · 5 datos · 6 ok
  const [tipo, setTipo] = useState("todos");
  const [marca, setMarca] = useState(null);
  const [serie, setSerie] = useState(null);
  const [filtroCat, setFiltroCat] = useState("Todos");
  const [appSel, setAppSel] = useState(null); // aplicación elegida (flujo por aplicación)
  const [appFrom, setAppFrom] = useState(0); // a dónde vuelve el back del detalle de aplicación
  const [carrito, setCarrito] = useState([]); // [{ marca, serie, modelos, item, cantidad }]
  const [pedido, setPedido] = useState({ nombre: "", tel: "", direccion: "", ciudad: "", nota: "" });

  const mt = (s, it) => matchTipo(tipo, s, it);
  const tipoNombre = (TIPOS.find((t) => t.id === tipo) || {}).nombre;

  const marcas = useMemo(() => CATALOGO
    .map((b) => ({ b, n: b.series.reduce((a, s) => a + s.items.filter((it) => mt(s, it)).length, 0) }))
    .filter((x) => x.n > 0), [tipo]);

  const series = useMemo(() => !marca ? [] : marca.series
    .map((s) => ({ s, n: s.items.filter((it) => mt(s, it)).length }))
    .filter((x) => x.n > 0), [marca, tipo]);

  const cats = useMemo(() => {
    if (!serie) return ["Todos"];
    return ["Todos", ...new Set(serie.items.filter((it) => mt(serie, it)).map((i) => CAT_LABEL[i.categoria] || "Otros"))];
  }, [serie, tipo]);

  const items = useMemo(() => !serie ? [] : serie.items
    .filter((it) => mt(serie, it) && (filtroCat === "Todos" || CAT_LABEL[it.categoria] === filtroCat)), [serie, filtroCat, tipo]);

  // ── Carrito ──
  const totalUnidades = carrito.reduce((a, c) => a + c.cantidad, 0);
  const inCart = (it) => carrito.some((c) => c.item === it);
  const toggleCartCtx = (it, ctx) => {
    setCarrito((prev) => prev.some((c) => c.item === it)
      ? prev.filter((c) => c.item !== it)
      : [...prev, { marca: ctx.marca, serie: ctx.serie || "", modelos: ctx.modelos || "", item: it, cantidad: 1 }]);
  };
  const toggleCart = (it) => toggleCartCtx(it, { marca: marca.marca, serie: serie.serie, modelos: serie.modelos || "" });
  const setQty = (it, d) => setCarrito((prev) => prev.map((c) =>
    c.item === it ? { ...c, cantidad: Math.max(1, c.cantidad + d) } : c));
  const removeCart = (it) => setCarrito((prev) => prev.filter((c) => c.item !== it));

  const formValido = pedido.nombre && pedido.tel && pedido.ciudad && carrito.length > 0;

  const reset = () => {
    setStep(0); setTipo("todos"); setMarca(null); setSerie(null); setFiltroCat("Todos"); setAppSel(null);
    setCarrito([]); setPedido({ nombre: "", tel: "", direccion: "", ciudad: "", nota: "" });
  };

  // Abrir una aplicación: las que dependen de marca van al flujo de marcas (part-to-part);
  // el resto abre su detalle de repuestos.
  const openApp = (a, from = 0) => {
    if (a.marcaFlow) { setTipo(a.tipo || "todos"); setMarca(null); setSerie(null); setStep(2); return; }
    setAppSel(a); setAppFrom(from); setStep(11);
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const wppMsg = () => {
    const L = ["Hola SANHUA YA, quiero cotizar estos repuestos:", ""];
    carrito.forEach((c, i) => {
      L.push(`${i + 1}) ${c.item.componente}${c.cantidad > 1 ? `  ×${c.cantidad}` : ""}`);
      L.push(`   • Sanhua: ${c.item.codigoSanhua}`);
      if (c.item.codigoOEM) L.push(`   • ${c.marca}: ${c.item.codigoOEM}`);

      const eq = [c.marca, c.serie].filter(Boolean).join(" · ");
      if (eq) L.push(`   • ${c.serie ? "Equipo" : "Aplicación"}: ${eq}`);
    });
    L.push("");
    if (pedido.nombre) L.push(`Cliente: ${pedido.nombre}`);
    if (pedido.tel) L.push(`Tel: ${pedido.tel}`);
    if (pedido.ciudad || pedido.direccion) L.push(`Entrega: ${[pedido.direccion, pedido.ciudad].filter(Boolean).join(", ")}`);
    if (pedido.nota) L.push(`Nota: ${pedido.nota}`);
    return L.join("\n");
  };

  // El carrito flotante se muestra mientras se navega el catálogo
  const showCart = carrito.length > 0 && ((step >= 1 && step <= 4) || step === 10 || step === 11);

  return (
    <div className="app">
      <Header onLogo={reset} cartCount={totalUnidades} onCart={() => carrito.length && setStep(5)} />

      {step > 0 && step < 6 && (
        <div className="stepper-wrap"><div className="container"><Stepper step={step} /></div></div>
      )}

      <main className={"container main" + (showCart ? " with-cart" : "")}>
        {step === 0 && <Home go={() => setStep(1)} goApp={() => setStep(10)} openApp={(a) => openApp(a, 0)} />}

        {/* STEP 1 — TIPO DE EQUIPO */}
        {step === 1 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(0)} />
            <h2 className="screen-title">¿Qué tipo de equipo es?</h2>
            <p className="screen-sub">Filtrá por aplicación para ver solo los componentes Sanhua que correspondan.</p>
            <div className="grid grid-equipos">
              {TIPOS.map((t) => {
                const TIcon = ICONS[t.icon] || IconWrench;
                return (
                  <button key={t.id} className={"tipo-card" + (tipo === t.id ? " sel" : "")}
                    onClick={() => { setTipo(t.id); setMarca(null); setSerie(null); setStep(2); }}>
                    <span className="tipo-ico"><TIcon size={26} /></span>
                    <span className="tipo-body">
                      <span className="tipo-name">{t.nombre}</span>
                      <span className="tipo-desc">{t.desc}</span>
                    </span>
                    <span className="tipo-arrow"><IconArrowRight size={18} /></span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 2 — MARCA */}
        {step === 2 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(1)} />
            <h2 className="screen-title">¿De qué marca es tu equipo?</h2>
            <p className="screen-sub">
              {tipo === "todos" ? "Marcas más instaladas en Argentina" : <React.Fragment>Tipo: <b>{tipoNombre}</b></React.Fragment>}
              {" "}— el componente Sanhua original de cada una.
            </p>
            <div className="grid grid-marcas-big">
              {marcas.map(({ b, n }) => (
                <button key={b.marca} className={"mk-card" + (marca?.marca === b.marca ? " sel" : "")}
                  onClick={() => { setMarca(b); setSerie(null); setStep(3); }}>
                  <span className="mk-avatar" style={{ "--hue": (BRAND_HUE[b.marca] || 210) }}>{b.marca.slice(0, 2)}</span>
                  <span className="mk-body">
                    <span className="mk-name">{b.marca}</span>
                    <span className="mk-tag">{b.tag}</span>
                  </span>
                  <span className="mk-meta">{n} repuestos <IconArrowRight size={15} /></span>
                </button>
              ))}
              {marcas.length === 0 && <div className="empty">No hay marcas para este tipo de equipo.</div>}
            </div>
            <p className="hint"><IconShield size={15} /> Las marcas se citan solo a fines de compatibilidad. SANHUA es el componente original de fábrica.</p>
          </section>
        )}

        {/* STEP 3 — SERIE / MODELO */}
        {step === 3 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(2)} />
            <h2 className="screen-title">{marca?.marca} · elegí tu serie</h2>
            <p className="screen-sub">Seleccioná la línea o serie de tu equipo para ver sus componentes Sanhua.</p>
            <div className="grid grid-series">
              {series.map(({ s, n }, i) => (
                <button key={i} className={"sr-card" + (serie === s ? " sel" : "")}
                  onClick={() => { setSerie(s); setFiltroCat("Todos"); setStep(4); }}>
                  <div className="sr-top">
                    <span className="sr-name">{s.serie}</span>
                    {s.refrigerante && <span className="rfr">{s.refrigerante}</span>}
                  </div>
                  {s.modelos && <div className="sr-models">{s.modelos}</div>}
                  <div className="sr-foot">
                    {s.btu && <span className="sr-btu">{s.btu}</span>}
                    <span className="sr-go">{n} repuesto{n === 1 ? "" : "s"} <IconArrowRight size={14} /></span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STEP 4 — COMPONENTES (carrito) */}
        {step === 4 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(3)} />
            <h2 className="screen-title">Componentes Sanhua</h2>
            <p className="screen-sub">{marca?.marca} · <b>{serie?.serie}</b>{serie?.modelos ? ` — ${serie.modelos}` : ""}</p>
            <p className="add-tip"><IconClipboard size={15} /> Agregá todos los repuestos que necesites — podés sumar de varias marcas y cotizarlos juntos.</p>

            {cats.length > 2 && (
              <div className="chips">
                {cats.map((t) => (
                  <button key={t} className={"chip" + (filtroCat === t ? " on" : "")} onClick={() => setFiltroCat(t)}>{t}</button>
                ))}
              </div>
            )}

            <div className="list">
              {items.map((it, i) => {
                const added = inCart(it);
                return (
                  <div key={i} className={"prod" + (added ? " sel" : "")}>
                    <span className="prod-ico">
                      {prodImg(it.categoria, it.tipoLabel, it.componente)
                        ? <img className="prod-ico-img" src={prodImg(it.categoria, it.tipoLabel, it.componente)} alt="" />
                        : <PartIcon categoria={it.categoria} size={26} />}
                    </span>
                    <span className="prod-body">
                      <span className="prod-top">
                        <span className="cat-pill">{CAT_LABEL[it.categoria] || "Componente"}</span>
                        {it.confirmado
                          ? <span className="ver ver-ok"><IconCheck size={12} /> Código confirmado</span>
                          : <span className="ver">Equivalencia</span>}
                      </span>
                      <span className="prod-name">{it.componente}</span>
                      <span className="codes">
                        <span className="code code-sh"><span className="code-k">Sanhua</span>{it.codigoSanhua}</span>
                        {it.codigoOEM && <span className="code"><span className="code-k">{marca?.marca}</span>{it.codigoOEM}</span>}

                      </span>
                      {it.nota && <span className="prod-note">{it.nota}</span>}
                    </span>
                    <span className="prod-right">
                      <button className={"add-btn" + (added ? " on" : "")} onClick={() => toggleCart(it)}>
                        {added ? <React.Fragment><IconCheck size={15} /> Agregado</React.Fragment>
                               : <React.Fragment><IconPlus size={15} /> Agregar</React.Fragment>}
                      </button>
                    </span>
                  </div>
                );
              })}
              {items.length === 0 && <div className="empty">No hay componentes para este filtro.</div>}
            </div>
          </section>
        )}

        {/* STEP 5 — DATOS + RESUMEN CARRITO */}
        {step === 5 && (
          <section className="fade screen narrow">
            <BackBtn onClick={() => setStep(4)} />
            <h2 className="screen-title">Tu cotización</h2>
            <p className="screen-sub">{carrito.length} repuesto{carrito.length === 1 ? "" : "s"} · te pasamos precio y disponibilidad por WhatsApp.</p>

            <div className="cart-list">
              {carrito.map((c, i) => (
                <div key={i} className="cart-item">
                  <span className="cart-ico"><PartIcon categoria={c.item.categoria} size={22} /></span>
                  <span className="cart-text">
                    <span className="cart-name">{c.item.componente}</span>
                    <span className="cart-meta">{[c.item.codigoSanhua, [c.marca, c.serie].filter(Boolean).join(" ")].filter(Boolean).join(" · ")}</span>
                  </span>
                  <span className="qty">
                    <button className="qty-b" onClick={() => setQty(c.item, -1)} aria-label="Menos">−</button>
                    <span className="qty-n">{c.cantidad}</span>
                    <button className="qty-b" onClick={() => setQty(c.item, +1)} aria-label="Más">+</button>
                  </span>
                  <button className="cart-x" onClick={() => removeCart(c.item)} aria-label="Quitar"><IconX size={16} /></button>
                </div>
              ))}
              <button className="btn btn-ghost btn-add-more" onClick={() => setStep(1)}>
                <IconPlus size={16} /> Agregar otro repuesto
              </button>
            </div>

            <div className="form">
              <Field label="Nombre / Razón social" value={pedido.nombre} onChange={(v) => setPedido({ ...pedido, nombre: v })} placeholder="Ej: Refrigeración del Sur SRL" />
              <div className="form-2">
                <Field label="Teléfono / WhatsApp" value={pedido.tel} onChange={(v) => setPedido({ ...pedido, tel: v })} placeholder="11 5555-5555" />
                <Field label="Ciudad / Localidad" value={pedido.ciudad} onChange={(v) => setPedido({ ...pedido, ciudad: v })} placeholder="San Isidro, BA" />
              </div>
              <Field label="Dirección de entrega (opcional)" value={pedido.direccion} onChange={(v) => setPedido({ ...pedido, direccion: v })} placeholder="Calle y número" />
              <div className="field">
                <label className="field-label">Nota (opcional)</label>
                <textarea className="field-input" rows={3} value={pedido.nota}
                  onChange={(e) => setPedido({ ...pedido, nota: e.target.value })}
                  placeholder="Cantidad, urgencia, modelo exacto del equipo…" />
              </div>
            </div>

            <p className="hint"><IconWhatsApp size={15} /> Coordinamos precio, pago y entrega por WhatsApp.</p>

            <button className="btn btn-primary btn-block" disabled={!formValido} onClick={() => setStep(6)}>
              Enviar solicitud <IconArrowRight size={18} />
            </button>
          </section>
        )}

        {/* STEP 6 — CONFIRMACIÓN */}
        {step === 6 && (
          <section className="fade screen narrow center">
            <div className="done-badge"><IconCheck size={40} /></div>
            <h2 className="screen-title big">¡Solicitud enviada!</h2>
            <p className="screen-sub center-sub">
              {pedido.nombre}, recibimos tu pedido de <b>{carrito.length} repuesto{carrito.length === 1 ? "" : "s"}</b>.
              Te contactamos por WhatsApp al <b>{pedido.tel}</b> con precio y disponibilidad{pedido.ciudad ? ` para ${pedido.ciudad}` : ""}.
            </p>

            <div className="recap">
              {carrito.map((c, i) => (
                <div key={i} className="recap-item">
                  <span className="recap-q">{c.cantidad}×</span>
                  <span className="recap-body">
                    <span className="recap-name">{c.item.componente}</span>
                    <span className="recap-codes">
                      <span className="code code-sh"><span className="code-k">Sanhua</span>{c.item.codigoSanhua}</span>
                      {c.item.codigoOEM && <span className="code"><span className="code-k">{c.marca}</span>{c.item.codigoOEM}</span>}
                    </span>
                    <span className="recap-eq">{[c.marca, c.serie].filter(Boolean).join(" · ")}</span>
                  </span>
                </div>
              ))}
            </div>

            <WppButton text="Adelantar consulta por WhatsApp" msg={wppMsg()} className="btn btn-wpp btn-block" />
            <button className="btn btn-ghost btn-block" onClick={reset}>Hacer otra consulta</button>
          </section>
        )}

        {/* STEP 10 — CATEGORÍAS DE APLICACIÓN */}
        {step === 10 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(0)} />
            <h2 className="screen-title">Buscar por aplicación</h2>
            <p className="screen-sub">¿No sabés el modelo exacto? Elegí dónde se usa el repuesto y te mostramos las opciones Sanhua.</p>
            <div className="grid grid-marcas-big">
              {APLICACIONES.map((a) => {
                const AIcon = ICONS[a.icon] || IconWrench;
                const n = a.repuestos.length;
                return (
                  <button key={a.id} className={"mk-card" + (appSel?.id === a.id ? " sel" : "")}
                    onClick={() => openApp(a, 10)}>
                    <span className="mk-avatar app-av"><AIcon size={26} /></span>
                    <span className="mk-body">
                      <span className="mk-name app-name">{a.nombre}</span>
                      <span className="mk-tag">{a.desc}</span>
                    </span>
                    <span className="mk-meta">
                      {a.marcaFlow
                        ? <React.Fragment>Elegí tu marca <IconArrowRight size={15} /></React.Fragment>
                        : <React.Fragment>{n} repuesto{n === 1 ? "" : "s"} <IconArrowRight size={15} /></React.Fragment>}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="hint"><IconShield size={15} /> Repuestos Sanhua originales. Las marcas y modelos se citan solo a fines de compatibilidad.</p>
          </section>
        )}

        {/* STEP 11 — REPUESTOS DE UNA APLICACIÓN (detalle) */}
        {step === 11 && (() => {
          const AIcon = ICONS[appSel?.icon] || IconWrench;
          const n = (appSel?.repuestos || []).length;
          return (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(appFrom)} />
            <div className="appd-hero">
              <span className="appd-hero-ico"><AIcon size={30} /></span>
              <div className="appd-hero-body">
                <span className="appd-kicker">Buscar por aplicación</span>
                <h2 className="screen-title appd-title">{appSel?.nombre}</h2>
                <p className="appd-intro">{appSel?.intro || appSel?.desc}</p>
                <span className="appd-count"><IconClipboard size={15} /> {n} repuesto{n === 1 ? "" : "s"} Sanhua para esta aplicación</span>
              </div>
            </div>

            <div className="appd-list">
              {(appSel?.repuestos || []).map((it, i) => {
                const added = inCart(it);
                return (
                  <article key={i} className={"appd-card" + (added ? " sel" : "")}>
                    <div className={"appd-iso" + (prodImg(it.categoria, it.tipoLabel, it.componente) ? " appd-iso--photo" : "")} role="img" aria-label={it.iso || it.componente}>
                      {prodImg(it.categoria, it.tipoLabel, it.componente)
                        ? <img className="appd-iso-img" src={prodImg(it.categoria, it.tipoLabel, it.componente)} alt={it.componente} />
                        : <React.Fragment>
                            <span className="appd-iso-ico"><PartIcon categoria={it.categoria} size={30} /></span>
                            <span className="appd-iso-label">{it.iso || it.componente}</span>
                          </React.Fragment>
                      }
                    </div>
                    <div className="appd-content">
                      <div className="appd-top">
                        <span className="cat-pill">{it.tipoLabel || CAT_LABEL[it.categoria] || "Componente"}</span>
                        {(it.gases || []).map((g) => <span key={g} className="gas-chip">{g}</span>)}
                      </div>
                      <h3 className="appd-name">{it.componente}</h3>
                      {it.codigoSanhua && (
                        <span className="codes">
                          <span className="code code-sh"><span className="code-k">Sanhua</span>{it.codigoSanhua}</span>
                        </span>
                      )}
                      <div className="appd-block">
                        <span className="comp-k">Función principal</span>
                        <p className="comp-t">{it.aplicacion}</p>
                      </div>
                      {it.ubicacion && (
                        <div className="appd-block comp-loc">
                          <span className="comp-k"><IconMapPin size={14} /> Ubicación</span>
                          <p className="comp-t">{it.ubicacion}</p>
                        </div>
                      )}
                      <button className={"add-btn appd-add" + (added ? " on" : "")}
                        onClick={() => toggleCartCtx(it, { marca: appSel.nombre, serie: "" })}>
                        {added ? <React.Fragment><IconCheck size={15} /> Agregado a la cotización</React.Fragment>
                               : <React.Fragment><IconPlus size={15} /> Agregar a la cotización</React.Fragment>}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="hint"><IconShield size={15} /> Repuestos Sanhua originales. Las marcas y modelos se citan solo a fines de compatibilidad.</p>
          </section>
          );
        })()}
      </main>

      {/* Barra flotante de carrito */}
      {showCart && (
        <div className="cart-bar">
          <div className="container cart-bar-in">
            <div className="cart-bar-info">
              <span className="cart-badge">{totalUnidades}</span>
              <span>{carrito.length} repuesto{carrito.length === 1 ? "" : "s"} en tu cotización</span>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(5)}>
              Pedir cotización <IconArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

Object.assign(window, { App });
