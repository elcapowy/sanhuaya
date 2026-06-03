// ─────────────────────────────────────────────────────────────
// Datos de marca SANHUA + metadatos del catálogo (data real en catalogo.js)
// ─────────────────────────────────────────────────────────────

// Fabricantes (OEM) que equipan sus productos con componentes SANHUA.
// Verificado en las listas de partes oficiales del catálogo Bellini.
const OEM = [
  "Daikin", "Samsung", "Carrier", "LG", "Gree", "Midea", "Hisense",
  "Haier", "Trane", "Mitsubishi", "York", "Copeland", "Emerson", "Heatcraft",
];

// Datos corporativos verificados de SANHUA.
const SANHUA_FACTS = [
  { n: ">60%", t: "del mercado mundial de válvulas reversibles de 4 vías" },
  { n: "Nº1", t: "mundial en válvulas de 4 vías y de expansión electrónica" },
  { n: "+100M", t: "válvulas producidas por año en sus plantas" },
  { n: "1984", t: "más de 40 años abasteciendo a la industria HVAC/R" },
];

// Certificaciones reales asociadas a la fabricación SANHUA.
const CERTS = ["ISO 9001", "ISO 14001", "UL", "TÜV", "VDE", "CE", "RoHS"];

// Etiqueta legible por categoría técnica de componente.
const CAT_LABEL = {
  reversing: "Válvula 4 vías",
  valve: "Válvula de expansión",
  coil: "Bobina",
  solenoid: "Solenoide",
  filter: "Filtro / Deshidratador",
  sensor: "Sensor / Termistor",
  service: "Llave de servicio",
  pressure: "Presostato",
};

// Acento de color por marca (solo para el avatar tipográfico, no es el logo oficial).
const BRAND_HUE = {
  DAIKIN: 210, GREE: 150, SAMSUNG: 232, LG: 358, CARRIER: 8, MIDEA: 200, HISENSE: 350,
};

// Prefiltro por tipo de aplicación (primer paso del flujo).
const TIPOS = [
  { id: "todos", nombre: "Todos los equipos", desc: "Ver el catálogo completo", icon: "wrench" },
  { id: "split", nombre: "Split residencial", desc: "Alta pared, inverter y on/off", icon: "wind" },
  { id: "vrf", nombre: "VRF / Multisplit", desc: "Caudal variable, Multi V, cassette y ducto", icon: "gauge" },
  { id: "comercial", nombre: "Comercial / Refrigeración", desc: "Cámaras, vitrinas, equipo de paquete", icon: "snowflake" },
];

// Clasifica un componente por tipo de aplicación según texto de serie/modelo/nota.
function itemTipos(serie, modelos, comp, nota) {
  const c = [serie, modelos, comp, nota].join(" ").toLowerCase();
  const t = new Set();
  if (/vrf|vrv|multi ?v\b|multi v|multisplit|multi-split|cassette|ducto/.test(c)) t.add("vrf");
  if (/comercial|c[áa]mara|g[óo]ndola|vitrina|bohn|heatcraft|copeland|manitowoc|paquete|packaged|\brack\b|condensad/.test(c)) t.add("comercial");
  if (/split|alta pared|residencial|9\.000|12\.000|18\.000|24\.000|\b9k\b|\b12k\b|\b18k\b|\b24k\b/.test(c)) t.add("split");
  if (t.size === 0) t.add("split");
  return t;
}
function matchTipo(tipoId, serie, item) {
  if (!tipoId || tipoId === "todos") return true;
  return itemTipos(serie.serie, serie.modelos || "", item.componente, item.nota || "").has(tipoId);
}

// ─────────────────────────────────────────────────────────────
// Guía de componentes — qué hace cada pieza y dónde se ubica.
// "iso" es el slot para la imagen isométrica (dónde se aplica / cambia).
// ─────────────────────────────────────────────────────────────
const COMPONENTES_INFO = [
  {
    id: "service", categoria: "service", emoji: "🔧", nombre: "Llave de servicio",
    funcion: "Son los puntos de acceso seguro al sistema sellado. Actúan como una canilla que permite conectar manómetros y bombas de vacío para medir presiones, extraer el aire del circuito o cargar gas refrigerante sin que se escape a la atmósfera.",
    ubicacion: "Fijadas en el lateral de la unidad exterior, donde se enroscan las tuercas de los caños de cobre que conectan con el interior.",
    iso: "Llave de servicio · lateral de la unidad exterior",
  },
  {
    id: "reversing", categoria: "reversing", emoji: "🔄", nombre: "Válvula 4 vías",
    funcion: "Es la pieza clave de los equipos frío/calor. Invierte físicamente el sentido en que circula el gas refrigerante impulsado por el compresor: absorbe calor de la calle y lo lleva al interior en invierno, o al revés en verano.",
    ubicacion: "Dentro de la unidad exterior, soldada a la tubería de descarga del compresor.",
    iso: "Válvula 4 vías · soldada a la descarga del compresor",
  },
  {
    id: "valve", categoria: "valve", emoji: "🎛️", nombre: "Válvula de expansión",
    funcion: "Genera una caída brusca de presión. Recibe el líquido refrigerante a alta presión y lo obliga a pasar por un orificio muy pequeño; al expandirse, su temperatura cae drásticamente. Las electrónicas (VEE) ajustan el flujo milimétricamente, ahorrando energía.",
    ubicacion: "En los splits modernos suele alojarse dentro de la unidad exterior, justo antes del viaje del refrigerante hacia la unidad interior.",
    iso: "Válvula de expansión · interior de la unidad exterior",
  },
  {
    id: "sensor", categoria: "sensor", emoji: "🌡️", nombre: "Sensor / Termistor",
    funcion: "Son los \"sentidos\" del aire acondicionado: resistencias que cambian su valor según el calor que reciben. La placa de control lee esos valores para saber la temperatura del ambiente o de los caños, y decide si acelerar o detener el compresor.",
    ubicacion: "Varios distribuidos: el de ambiente va detrás de los filtros de la unidad interior; otros metálicos van pegados a las tuberías, adentro y afuera.",
    iso: "Sensor / termistor · detrás de los filtros y en tuberías",
  },
  {
    id: "coil", categoria: "coil", emoji: "🧲", nombre: "Bobina",
    funcion: "Es el \"músculo\" eléctrico que acciona las válvulas a distancia. Un electroimán (solenoide) que, al recibir corriente de la placa, genera un campo magnético y mueve un pistón interno para abrir o cambiar la posición de la válvula.",
    ubicacion: "Se acopla por fuera del cuerpo de bronce de las válvulas, fijada con un tornillo, dentro de la unidad exterior.",
    iso: "Bobina solenoide · acoplada al cuerpo de la válvula",
  },
  {
    id: "filter", categoria: "filter", emoji: "💧", nombre: "Filtro / Deshidratador",
    funcion: "Protege al compresor y evita que el sistema se tape. Una malla metálica retiene partículas sólidas (virutas de cobre, suciedad) y un material desecante absorbe la humedad del circuito, letal para el motor y el aceite.",
    ubicacion: "Va soldado en la línea de refrigerante líquido, generalmente dentro de la unidad exterior.",
    iso: "Filtro deshidratador · soldado en la línea de líquido",
  },
];

// ─────────────────────────────────────────────────────────────
// Fotos de producto — usa window.__resources (bundle) con fallback a ruta local
// ─────────────────────────────────────────────────────────────
const _WR = window.__resources || {};
const _A = {
  reversing:   _WR.prodReversing   || "assets/prod-reversing.png",
  valve:       _WR.prodValve       || "assets/prod-valve.png",
  solenoid:    _WR.prodSolenoid    || "assets/prod-solenoid.png",
  filter:      _WR.prodFilter      || "assets/prod-filter.png",
  sensor:      _WR.prodSensor      || "assets/prod-sensor.png",
  pressure:    _WR.prodPressure    || "assets/prod-pressure.png",
  service:     _WR.prodService     || "assets/prod-service.png",
  sight:       _WR.prodSight       || "assets/prod-sight.png",
  serviceBall: _WR.prodServiceBall || "assets/prod-service-ball.png",
  threeWay:    _WR.prod3way        || "assets/prod-3way.png",
  sek:         _WR.prodSek         || "assets/prod-sek.png",
  eev:         _WR.prodEev         || "assets/prod-eev.png",
  core:        _WR.prodCore        || "assets/prod-core.png",
};

const PRODUCT_IMAGES = {
  reversing: _A.reversing,
  valve:     _A.valve,
  coil:      _A.solenoid,
  solenoid:  _A.solenoid,
  filter:    _A.filter,
  sensor:    _A.sensor,
  pressure:  _A.pressure,
  service:   _A.service,
  // tipoLabel overrides
  "Visor de líquido":   _A.sight,
  "Llave esférica":     _A.serviceBall,
  "Llave de servicio":  _A.serviceBall,
  "Válvula 3 vías":     _A.threeWay,
  "VEE / Kit SEK":      _A.sek,
  "Orificio / tobera":  _A.valve,
  "Núcleo recambiable": _A.core,
  "Núcleo / cartucho":  _A.core,
};

// Reglas por nombre de componente (más específicas que categoría)
const PROD_IMG_RULES = [
  { re: /bobina|coil/i,                                   img: _A.solenoid    },
  { re: /kit\s*SEK|SEK\d/i,                               img: _A.sek         },
  { re: /núcleo|cartucho|SH48|HTG-A80/i,                  img: _A.core        },
  { re: /3 vías|3vias|KMV|doble mando/i,                  img: _A.threeWay    },
  { re: /electr[oó]nica|VEE|EEV/i,                        img: _A.eev         },
  { re: /termostática|TXV/i,                              img: _A.valve       },
  { re: /4 vías|inversora|reversing/i,                    img: _A.reversing   },
  { re: /solenoide|solenoid/i,                            img: _A.solenoid    },
  { re: /visor|sight/i,                                   img: _A.sight       },
  { re: /transductor|presostato/i,                        img: _A.pressure    },
  { re: /llave esférica|llave de bola|ball valve/i,       img: _A.serviceBall },
  { re: /llave.*servicio|service valve|stop valve/i,      img: _A.service     },
  { re: /válvula de servicio|válvula servicio/i,          img: _A.service     },
  { re: /deshidratador|filter drier|secador/i,            img: _A.filter      },
  { re: /filtro|filter|strainer/i,                        img: _A.filter      },
  { re: /sensor|termistor|NTC|thermistor/i,               img: _A.sensor      },
];

// Helper: nombre > tipoLabel > categoría
function prodImg(categoria, tipoLabel, nombre) {
  if (nombre) {
    const hit = PROD_IMG_RULES.find((r) => r.re.test(nombre));
    if (hit) return hit.img;
  }
  if (tipoLabel && PRODUCT_IMAGES[tipoLabel]) return PRODUCT_IMAGES[tipoLabel];
  return PRODUCT_IMAGES[categoria] || null;
}

Object.assign(window, { OEM, SANHUA_FACTS, CERTS, CAT_LABEL, BRAND_HUE, TIPOS, itemTipos, matchTipo, COMPONENTES_INFO, PRODUCT_IMAGES, PROD_IMG_RULES, prodImg });

// ─────────────────────────────────────────────────────────────
// Catálogo por APLICACIÓN — repuestos Sanhua agrupados por dónde se usan.
// Vía de búsqueda paralela al flujo por marca; alimenta el mismo carrito.
// ─────────────────────────────────────────────────────────────
const APLICACIONES = [
  {
    id: "heladeras", nombre: "Heladeras familiares", icon: "snowflake",
    desc: "Doble mando residencial",
    intro: "Repuestos Sanhua para heladeras con freezer de doble mando, donde una válvula deriva el gas para controlar cada cámara por separado. Componentes del circuito sellado, en el compartimento del compresor.",
    repuestos: [
      { componente: "Válvula de 3 vías (Kohinoor / Original)", categoria: "reversing", tipoLabel: "Válvula 3 vías",
        codigoSanhua: "Modelos KMV432 · KHG41D/8", gases: ["R600", "R134a"],
        aplicacion: "Permite derivar el gas para apagar la heladera y dejar el freezer funcionando (o viceversa). Es el corazón del sistema de doble mando.",
        ubicacion: "Soldada en la línea de gas, dentro del compartimento del compresor, en la parte trasera inferior de la heladera.",
        iso: "Válvula 3 vías · línea de gas en el compresor" },
      { componente: "Filtro deshidratador capilar", categoria: "filter",
        codigoSanhua: "Capilar o para soldar · R600a / R134a", gases: ["R600", "R134a"],
        aplicacion: "Retiene humedad y partículas del circuito sellado. Se reemplaza siempre que se abre el sistema para una reparación.",
        ubicacion: "Soldado a la salida del condensador, justo antes del tubo capilar de entrada al evaporador.",
        iso: "Filtro deshidratador · salida del condensador" },
    ],
  },
  {
    id: "aire", nombre: "Aire acondicionado", icon: "wind",
    desc: "Splits frío/calor y bombas de calor",
    marcaFlow: true, tipo: "todos",
    intro: "Componentes Sanhua de los splits frío/calor. Como dependen del modelo exacto, te llevamos a elegir tu marca y serie para darte la pieza part-to-part.",
    repuestos: [],
  },
  {
    id: "electricos", nombre: "Eléctricos", icon: "bolt",
    desc: "Bobinas y actuadores",
    intro: "Los componentes eléctricos que la placa de control usa para accionar válvulas y leer temperaturas. Se reemplazan sin tocar el circuito de gas.",
    repuestos: [
      { componente: "Bobinas para válvulas / solenoide", categoria: "coil",
        codigoSanhua: "24 V · 220 V · Inverter (Kelvinator) · 4.5 / 3.5 W", gases: [],
        aplicacion: "Actuador magnético de la válvula inversora o solenoide. Se cambia ante una falla eléctrica sin desoldar caños.",
        ubicacion: "Acoplada por fuera del cuerpo de bronce de la válvula, fijada con un tornillo, en la unidad exterior.",
        iso: "Bobina · acoplada al cuerpo de la válvula" },
      { componente: "Sensores / termistores NTC", categoria: "sensor",
        codigoSanhua: "Serie NTC · ambiente y tubería · varias longitudes", gases: [],
        aplicacion: "Resistencias que cambian su valor con la temperatura. La placa los lee para decidir si acelerar o detener el compresor.",
        ubicacion: "El de ambiente va detrás de los filtros de la unidad interior; otros metálicos van pegados a las tuberías, adentro y afuera.",
        iso: "Sensor NTC · detrás de filtros y en tuberías" },
    ],
  },
  {
    id: "comercial", nombre: "Refrigeración comercial", icon: "snowflake",
    desc: "Exhibidoras, góndolas y vitrinas",
    intro: "Línea comercial Sanhua para exhibidoras de supermercado, góndolas y vitrinas — los mismos componentes que importan distribuidores como Good Cold para el mercado argentino.",
    repuestos: [
      { componente: "Válvula de expansión termostática (TXV)", categoria: "valve",
        codigoSanhua: "Serie RFGD03E (2.5 a 9.0) · RFKH03E-4.8", gases: ["R404", "R507", "R134a"],
        aplicacion: "Regula la inyección exacta de líquido refrigerante hacia el evaporador para generar el frío en exhibidoras, góndolas y chillers.",
        ubicacion: "En la línea de líquido, a la entrada del evaporador; el bulbo se fija a la línea de aspiración.",
        iso: "Válvula expansión termostática · entrada del evaporador" },
      { componente: "Orificios / toberas intercambiables", categoria: "valve", tipoLabel: "Orificio / tobera",
        codigoSanhua: "RFKH-023-00 a RFKH-023-06", gases: [],
        aplicacion: "Componente interno de la TXV. Se elige el número de orificio (00 a 06) para ajustar el caudal según la capacidad del equipo.",
        ubicacion: "Dentro del cuerpo de la válvula de expansión termostática.",
        iso: "Tobera RFKH-023 · dentro de la válvula" },
      { componente: "Visor de líquido (sight glass)", categoria: "service", tipoLabel: "Visor de líquido",
        codigoSanhua: "SYJ10 / 12 / 16 / 19 / 22 H51 (10–22 mm)", gases: [],
        aplicacion: "Permite ver el estado del refrigerante: si burbujea falta carga, y el indicador de color avisa si hay humedad en el sistema.",
        ubicacion: "Soldado o roscado en la línea de líquido, después del filtro secador.",
        iso: "Visor SYJ · línea de líquido" },
      { componente: "Núcleo de filtro recambiable", categoria: "filter", tipoLabel: "Núcleo recambiable",
        codigoSanhua: "HTG-A80-010001", gases: [],
        aplicacion: "Recambio interno para carcasas de filtro atornilladas. Se reemplaza el núcleo sin cambiar toda la carcasa.",
        ubicacion: "Dentro de la carcasa de filtro atornillada, en la línea de líquido.",
        iso: "Núcleo HTG-A80 · carcasa atornillada" },
      { componente: "VEE — Kit SEK (válvula de expansión electrónica)", categoria: "valve", tipoLabel: "VEE / Kit SEK",
        codigoSanhua: "SEK08-01 · SEK10-01 · SEK14-01 · SEK18-01 · SEK24-01 — LPF + SEC612", gases: ["R404", "R449", "R452", "R134a"],
        aplicacion: "Modernización de exhibidoras y góndolas: reemplaza la TXV por control electrónico de recalentamiento. Kit completo con VEE LPF, controlador SEC612, transductor YCQC02L18 y sonda NTC. Mejora eficiencia y reduce temperatura de conservación más estable.",
        ubicacion: "La VEE se suelda a la entrada del evaporador de cada módulo exhibidor; el controlador va montado en el tablero del rack.",
        iso: "Kit SEK · exhibidora o góndola" },
    ],
  },
  {
    id: "camaras", nombre: "Cámaras frigoríficas", icon: "box",
    desc: "Cuartos fríos y túneles",
    intro: "Componentes Sanhua para cámaras de frío y cuartos de congelado: control del líquido por pump-down, expansión y monitoreo de la carga. Línea importada por Good Cold.",
    repuestos: [
      { componente: "Válvula solenoide (control de líquido)", categoria: "solenoid",
        codigoSanhua: "Serie MDF-A03 (6–22 mm) · MDF-B03 (25–40 mm)", gases: ["R404", "R507", "R22"],
        aplicacion: "Corta el paso de líquido refrigerante según el termostato de la cámara (sistema pump-down), protegiendo el compresor en cada arranque.",
        ubicacion: "En la línea de líquido, antes de la válvula de expansión que alimenta el evaporador de la cámara.",
        iso: "Solenoide MDF · línea de líquido de la cámara" },
      { componente: "Válvula de expansión termostática (TXV)", categoria: "valve",
        codigoSanhua: "Serie RFGD03E (2.5 a 9.0) · R404 / R507", gases: ["R404", "R507"],
        aplicacion: "Inyecta el caudal justo de refrigerante al evaporador de la cámara para mantener la temperatura de conservación o congelado.",
        ubicacion: "A la entrada del evaporador dentro de la cámara; el bulbo se fija a la línea de aspiración.",
        iso: "TXV RFGD03E · evaporador de la cámara" },
      { componente: "Visor de líquido (sight glass)", categoria: "service", tipoLabel: "Visor de líquido",
        codigoSanhua: "SYJ10 / 12 / 16 / 19 / 22 H51", gases: [],
        aplicacion: "Controla la carga y la humedad del sistema. Imprescindible en cámaras para detectar falta de gas antes de que falle la conservación.",
        ubicacion: "En la línea de líquido, después del filtro secador y antes de la solenoide.",
        iso: "Visor SYJ · línea de líquido" },
      { componente: "Filtro deshidratador (drier)", categoria: "filter",
        codigoSanhua: "Serie DTG-E (03024 a 30050) · soldar", gases: ["R404", "R507"],
        aplicacion: "Retiene humedad y partículas del circuito. Tamaño según la capacidad de la cámara y el caudal de la línea de líquido.",
        ubicacion: "Soldado en la línea de líquido, a la salida del recibidor / condensador.",
        iso: "Filtro DTG-E · línea de líquido" },
      { componente: "VEE — Kit SEK (válvula de expansión electrónica)", categoria: "valve", tipoLabel: "VEE / Kit SEK",
        codigoSanhua: "SEK10-01 · SEK14-01 · SEK18-01 · SEK24-01 · SEK30-01 · SEK32-01 — LPF series + SEC612", gases: ["R404", "R449", "R452", "R507"],
        aplicacion: "Kit llave en mano que reemplaza la TXV por control electrónico de recalentamiento. Incluye VEE serie LPF (muy bajo leakage <1 ml/min), controlador SEC612, transductor de presión YCQC02L18 con cable Packard y sonda NTC. Control más preciso = mayor eficiencia y protección del compresor.",
        ubicacion: "La VEE (LPF) se suelda a la entrada del evaporador de la cámara; el controlador SEC612 se monta en el tablero; la sonda NTC se fija a la línea de aspiración.",
        iso: "Kit SEK · evaporador de la cámara" },
      { componente: "VEE serie LPF (válvula sola)", categoria: "valve", tipoLabel: "Válvula electrónica",
        codigoSanhua: "LPF08 · LPF10 · LPF14 · LPF18 · LPF24 · LPF30 · LPF32 · LPF45 · LPF52 · LPF62", gases: ["R404", "R449", "R452", "R507", "R134a"],
        aplicacion: "Válvula de expansión electrónica de muy bajo leakage. Se selecciona por capacidad del evaporador en kW y refrigerante. Requiere controlador externo (SEC612 u otro compatible).",
        ubicacion: "Soldada a la entrada del evaporador dentro de la cámara.",
        iso: "VEE LPF · evaporador de la cámara" },
    ],
  },
  {
    id: "mochilas", nombre: "Mochilas / Condensadoras", icon: "unit",
    desc: "Unidades condensadoras compactas",
    intro: "Repuestos para equipos mochila y unidades condensadoras: las llaves, reguladoras de presión y filtros que van a la salida de la condensadora. Línea comercial importada por Good Cold.",
    repuestos: [
      { componente: "Llave de servicio (válvula de bola)", categoria: "service",
        codigoSanhua: "Serie SBV(M)-JA5 a JA21 · SBV04-319T", gases: [],
        aplicacion: "Punto de corte y de carga a la salida de la condensadora. Permite aislar el equipo y conectar manómetros sin perder gas.",
        ubicacion: "A la salida de la unidad condensadora (mochila), en las líneas de líquido y aspiración.",
        iso: "Llave SBV · salida de la condensadora" },
      { componente: "Válvula reguladora de presión", categoria: "pressure",
        codigoSanhua: "XTF15 / 22 / 28 / 35 H01 · LTF16H01", gases: ["R404", "R507"],
        aplicacion: "Mantiene estable la presión de evaporación o de cárter, evitando que el sistema baje de la presión de trabajo y proteger el compresor.",
        ubicacion: "Intercalada en la línea de aspiración, dentro o a la salida de la unidad condensadora.",
        iso: "Reguladora XTF/LTF · línea de aspiración" },
      { componente: "Bobina para válvula solenoide", categoria: "coil",
        codigoSanhua: "MQ-A0622G-000001 (para serie MDF)", gases: [],
        aplicacion: "Electroimán que acciona la válvula solenoide del control de líquido. Se reemplaza ante una falla eléctrica sin tocar el circuito de gas.",
        ubicacion: "Acoplada por fuera del cuerpo de la válvula solenoide MDF, fijada con tuerca.",
        iso: "Bobina MQ · sobre la solenoide MDF" },
      { componente: "Filtro deshidratador (drier)", categoria: "filter",
        codigoSanhua: "Serie DTG-E · HTG-A48 (070 a 170)", gases: ["R404", "R507"],
        aplicacion: "Protege el compresor reteniendo humedad y suciedad. Las series HTG-A48 son de mayor capacidad para condensadoras grandes.",
        ubicacion: "Soldado en la línea de líquido a la salida de la condensadora.",
        iso: "Filtro DTG / HTG · salida de la condensadora" },
      { componente: "VEE serie LPF — Kit SEK (expansión electrónica)", categoria: "valve", tipoLabel: "VEE / Kit SEK",
        codigoSanhua: "SEK14-01 · SEK18-01 · SEK24-01 · SEK30-01 · SEK32-01 · SEK45-01 — LPF + SEC612", gases: ["R404", "R449", "R452", "R507"],
        aplicacion: "Válvula de expansión electrónica para condensadoras de alta eficiencia. Reemplaza la TXV para control más preciso del recalentamiento con variación de carga. Kit SEK incluye VEE LPF, controlador SEC612, transductor YCQC02L18 y sonda NTC.",
        ubicacion: "En la línea de líquido a la salida de la condensadora, antes de la entrada al evaporador.",
        iso: "VEE LPF · línea de líquido condensadora" },
    ],
  },
  {
    id: "industria", nombre: "Industria / Grandes superficies", icon: "factory",
    desc: "Hipermercados y frigoríficos",
    intro: "Para cañerías largas de hipermercados y frigoríficos, donde hay que aislar y monitorear sectores del circuito sin perder la carga de gas del local.",
    repuestos: [
      { componente: "Llave esférica (válvula de bola)", categoria: "service",
        codigoSanhua: 'Conexiones soldables · 7/8" o 1.3/8" con acceso', gases: [],
        aplicacion: "Permite cerrar y aislar un sector roto para repararlo sin liberar a la atmósfera toda la carga de gas del local.",
        ubicacion: "Intercalada en las líneas principales de gas, en sala de máquinas y troncales de la instalación.",
        iso: "Llave esférica · troncal de la instalación" },
      { componente: "Visor de líquido", categoria: "service", tipoLabel: "Visor de líquido",
        codigoSanhua: "Serie SYJ · con indicador de humedad", gases: [],
        aplicacion: "Permite ver el estado del refrigerante: si pasa burbujeando falta carga, y el indicador avisa si hay humedad en el sistema.",
        ubicacion: "Soldado o roscado en la línea de líquido, después del filtro secador.",
        iso: "Visor de líquido · línea de líquido" },
    ],
  },
  {
    id: "mantenimiento", nombre: "Mantenimiento general", icon: "filter",
    desc: "Filtros secadores",
    intro: "Lo que se cambia en todo service: filtros y llaves de carga para dejar el circuito limpio y seco después de una intervención.",
    repuestos: [
      { componente: "Filtros secadores moleculares", categoria: "filter",
        codigoSanhua: "Rosca (flare) o para soldar · Bidireccionales (STGB)", gases: [],
        aplicacion: "Absorben humedad en todo circuito abierto para reparación. Los bidireccionales se usan en aires frío/calor por el doble sentido del gas.",
        ubicacion: "Soldado o roscado en la línea de líquido, dentro de la unidad exterior.",
        iso: "Filtro secador · línea de líquido" },
      { componente: "Llave de servicio / carga", categoria: "service", tipoLabel: "Llave de servicio",
        codigoSanhua: "Serie SSV · acceso 1/4\" para manómetros", gases: [],
        aplicacion: "Punto de acceso para conectar manómetros y bomba de vacío, medir presiones y cargar gas sin pérdidas.",
        ubicacion: "En el lateral de la unidad exterior, donde se enroscan las tuercas de los caños de cobre.",
        iso: "Llave de servicio · lateral de la unidad exterior" },
    ],
  },
  {
    id: "criticas", nombre: "Reparaciones críticas", icon: "shield",
    desc: "Compresor quemado",
    intro: "Cuando el compresor se funde, el aceite quemado deja ácido en todo el circuito. Estos filtros lo neutralizan y protegen el compresor nuevo.",
    repuestos: [
      { componente: "Filtro antiácido (motor quemado)", categoria: "filter",
        codigoSanhua: "Antiácido (DTGH)", gases: [],
        aplicacion: "Limpia el ácido que deja el aceite quemado tras un compresor fundido o en corto, evitando que dañe el compresor de reemplazo.",
        ubicacion: "Soldado en la línea de aspiración, antes de la entrada al compresor nuevo.",
        iso: "Filtro antiácido · línea de aspiración" },
      { componente: "Núcleo / cartucho cerámico", categoria: "filter", tipoLabel: "Núcleo / cartucho",
        codigoSanhua: "Cartucho cerámico (SH48)", gases: [],
        aplicacion: "Recambio interno para carcasas industriales atornilladas. Se reemplaza el núcleo sin cambiar todo el filtro.",
        ubicacion: "Dentro de la carcasa de filtro atornillada, en la línea de líquido o aspiración.",
        iso: "Núcleo cerámico · carcasa de filtro atornillada" },
    ],
  },
];

Object.assign(window, { APLICACIONES });
