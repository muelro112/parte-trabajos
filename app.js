
// ===== CATALOGO ACTUACIONES =====
const ACTUACIONES = [
  { nombre: "Inspección básica Explanaciones Puente Túnel", codigo: "INSP Infra" },
  { nombre: "Inspección DS, EN, VIP, VAC, DS, TUS, TUD y AD", codigo: "INSP Vía" },
  { nombre: "Estabilización de vía", codigo: "1" },
  { nombre: "Nivelación, alineación y perfilado manual o con maquinaria ligera", codigo: "2" },
  { nombre: "Nivelación, alineación y perfilado con maquinaria pesada", codigo: "3" },
  { nombre: "Sustitución, depuración y/o desguarnecido de balasto de forma manual", codigo: "4" },
  { nombre: "Sustitución, depuración y/o desguarnecido de balasto con maquinaria", codigo: "5" },
  { nombre: "Sustitución de carril", codigo: "6" },
  { nombre: "Tratamiento longitudinal de carril", codigo: "7" },
  { nombre: "Tratamiento puntual de carril", codigo: "8" },
  { nombre: "Soldaduras de carril", codigo: "9" },
  { nombre: "Sustitución de traviesas", codigo: "10" },
  { nombre: "Tratamiento de traviesas", codigo: "11" },
  { nombre: "Sustitución o tratamiento de sujeciones", codigo: "12" },
  { nombre: "Sust. pequeño material", codigo: "13" },
  { nombre: "Sustitución de juntas aislantes", codigo: "14" },
  { nombre: "Carga y transporte de materiales", codigo: "15" },
  { nombre: "Tratamiento de aparatos de vía", codigo: "16" },
  { nombre: "Tratamiento pasos a nivel", codigo: "17" },
  { nombre: "Rehabilitación de vía", codigo: "18" },
  { nombre: "Atención incidencias", codigo: "19" },
  { nombre: "Atención inmediata incidencias", codigo: "20" },
  { nombre: "Prestación extraordinaria", codigo: "21" },
  { nombre: "Tratamiento de taludes", codigo: "22" },
  { nombre: "Conservación explanaciones", codigo: "23" },
  { nombre: "Limpieza drenaje", codigo: "24" },
  { nombre: "Limpieza entorno ferroviario", codigo: "25" },
  { nombre: "Tratamiento parejas vía", codigo: "26" },
  { nombre: "Mantenimiento cerramientos", codigo: "27" },
  { nombre: "Engrase agujas", codigo: "28" },
  { nombre: "Otras actuaciones", codigo: "29" }
];

// ===== MAPA DE POSICIONES EN PDF =====
const POS_ACT = {
  "INSP Infra": { x: 432, y: 765 },
  "INSP Vía": { x: 432, y: 752 },
  "1": { x: 432, y: 739 },
  "2": { x: 432, y: 726 },
  "3": { x: 432, y: 713.50 },
  "4": { x: 432, y: 700.50 },
  "5": { x: 432, y: 687.8 },
  "6": { x: 432, y: 675 },
  "7": { x: 432, y: 662 },
  "8": { x: 432, y: 649 },
  "9": { x: 432, y: 636.5 },
  "10": { x: 432, y: 624 },
  "11": { x: 432, y: 611.5 },
  "12": { x: 432, y: 598.5},
  "13": { x: 432, y: 578.5 },
  "14": { x: 432, y: 566 },
  "15": { x: 432, y: 553 },
  "16": { x: 432, y: 534 },
  "17": { x: 432, y: 521.5 },
  "18": { x: 432, y: 508.5 },
  "19": { x: 432, y: 496 },
  "20": { x: 432, y: 483 },
  "21": { x: 432, y: 470.5 },
  "22": { x: 432, y: 458 },
  "23": { x: 432, y: 439 },
  "24": { x: 432, y: 425.5 },
  "25": { x: 432, y: 413.5 },
  "26": { x: 432, y: 401 },
  "27": { x: 432, y: 387.5 },
  "28": { x: 432, y: 375 },
  "29": { x: 432, y: 362 }
};

// ===== ARRAYS =====
let trabajadores = [];
let maquinaria = [];
let materiales = [];
let cortesVia = [];
let cortesTension = [];

// ===== HELPERS DOM =====
function el(id) {
  const elemento = document.getElementById(id);
  if (!elemento) {
    console.warn("No existe el elemento con id:", id);
  }
  return elemento;
}

function valor(id) {
  const elemento = el(id);
  return elemento ? elemento.value : "";
}

function ponerValor(id, value) {
  const elemento = el(id);
  if (elemento) elemento.value = value || "";
}

async function cargarBytesPlantillaPDF() {
  // 1) Intenta cargar la plantilla desde la misma carpeta cuando la app está servida por web.
  try {
    const response = await fetch("plantilla.pdf");
    if (response.ok) return await response.arrayBuffer();
  } catch (error) {
    console.warn("No se pudo cargar plantilla.pdf con fetch:", error);
  }

  // 2) Si abres el HTML como archivo local, fetch puede fallar. Entonces usa el selector de archivo.
  const inputPlantilla = el("plantilla_pdf");
  if (inputPlantilla && inputPlantilla.files && inputPlantilla.files.length > 0) {
    return await inputPlantilla.files[0].arrayBuffer();
  }

  throw new Error("No se pudo cargar plantilla.pdf. Si estás abriendo el HTML desde una carpeta local, selecciona la plantilla PDF en el campo 'Plantilla PDF'.");
}


// ===== BORRAR FILA =====
function borrarFila(btn, tipo, index) {
  const fila = btn.parentElement;
  if (fila) fila.remove();

  if (tipo === "trabajadores") {
    trabajadores[index] = {};
  } else if (tipo === "maquinaria") {
    maquinaria[index] = {};
  } else if (tipo === "materiales") {
    materiales[index] = {};
  } else if (tipo === "cortesVia") {
    cortesVia[index] = {};
  } else if (tipo === "cortesTension") {
    cortesTension[index] = {};
  }
}


// ===== ACTUACIONES =====
function addActuacion() {
  const cont = el("actuaciones");

  if (cont.children.length >= 10) {
    alert("Máximo 10 actuaciones");
    return;
  }

  const div = document.createElement("div");
  div.className = "fila";

  const opciones = ACTUACIONES.map((a, i) =>
    `<option value="${i}">${a.nombre}</option>`
  ).join("");

  div.innerHTML = `
  <select oninput="ponerCodigo(this)">
    <option value="">Seleccionar actuación</option>
    ${opciones}
  </select>

  <input placeholder="Código" readonly>
  <input placeholder="Cantidad">
  <input placeholder="Unidad">
  <button type="button" class="btn-borrar" onclick="this.parentElement.remove()">🗑 Borrar</button>
`;

  cont.appendChild(div);


  div.scrollIntoView({ behavior: "smooth", block: "center" });


  div.querySelector("select").focus();


}

function ponerCodigo(select) {
  const div = select.parentElement;
  const inputs = div.querySelectorAll("input");
  const act = ACTUACIONES[select.value];

  if (!act) {
    inputs[0].value = "";
    return;
  }

  inputs[0].value = act.codigo;
}

// ===== TRABAJADORES =====
function addTrabajador() {
  if (trabajadores.length >= 15) {
    alert("Máx 15");
    return;
  }

  const i = trabajadores.length;
  const d = document.createElement("div");
  d.className = "fila";

  d.innerHTML = `
  <input placeholder="Categoría" oninput="uT(${i},'categoria',this.value)">
  <input placeholder="Conductor" oninput="uT(${i},'conductor',this.value)">
  <input placeholder="Recurso" oninput="uT(${i},'recurso',this.value)">
  <input placeholder="DNI" oninput="uT(${i},'dni',this.value)">
  <input placeholder="Nombre" oninput="uT(${i},'nombre',this.value)">
  <input placeholder="Horas" oninput="uT(${i},'horas',this.value)">
  <button type="button" class="btn-borrar" onclick="borrarFila(this,'trabajadores',${i})">🗑 Borrar</button>
`;

  el("trabajadores").appendChild(d);
  trabajadores.push({});


  d.scrollIntoView({ behavior: "smooth", block: "center" });


  d.querySelector("input").focus();


}

function uT(i, c, v) {
  trabajadores[i][c] = v;
}

// ===== VEHICULOS =====
function addMaquina() {
  if (maquinaria.length >= 5) {
    alert("Máx 5");
    return;
  }

  const i = maquinaria.length;
  const d = document.createElement("div");
  d.className = "fila";

  d.innerHTML = `
  <input placeholder="Descripción" oninput="uM(${i},'desc',this.value)">
  <input placeholder="Tipo" oninput="uM(${i},'tipo',this.value)">
  <input placeholder="Matrícula" oninput="uM(${i},'mat',this.value)">
  <input placeholder="Horas" oninput="uM(${i},'horas',this.value)">
  <button type="button" class="btn-borrar" onclick="borrarFila(this,'maquinaria',${i})">🗑 Borrar</button>
`;

  el("maquinaria").appendChild(d);
  maquinaria.push({});


  d.scrollIntoView({ behavior: "smooth", block: "center" });


  d.scrollIntoView({ behavior: "smooth", block: "center" });
  
  
  d.querySelector("input").focus();
  

}

function uM(i, c, v) {
  maquinaria[i][c] = v;
}

// ===== MATERIAL =====
function addMaterial() {
  if (materiales.length >= 5) {
    alert("Máx 5");
    return;
  }

  const i = materiales.length;
  const d = document.createElement("div");
  d.className = "fila";

  d.innerHTML = `
  <input placeholder="Nombre" oninput="uMat(${i},'nom',this.value)">
  <input placeholder="Cantidad" oninput="uMat(${i},'cant',this.value)">
  <input placeholder="Unidad" oninput="uMat(${i},'uni',this.value)">
  <button type="button" class="btn-borrar" onclick="borrarFila(this,'materiales',${i})">🗑 Borrar</button>
`;

  el("material").appendChild(d);
  materiales.push({});


  d.scrollIntoView({ behavior: "smooth", block: "center" });


  d.querySelector("input").focus();


}

function uMat(i, c, v) {
  materiales[i][c] = v;
}

// ===== CORTE VIA =====
function addCorteVia() {
  if (cortesVia.length >= 3) {
    alert("Máx 3");
    return;
  }

  const i = cortesVia.length;
  const d = document.createElement("div");
  d.className = "fila";

  d.innerHTML = `
  <input placeholder="Vía" oninput="uCV(${i},'via',this.value)">
  <input placeholder="Estación" oninput="uCV(${i},'est',this.value)">
  <input placeholder="Trayecto_Inicio" oninput="uCV(${i},'ini',this.value)">
  <input placeholder="Trayecto_Fin" oninput="uCV(${i},'fin',this.value)">
  <input placeholder="H.Previsto_Inicio" oninput="uCV(${i},'hi',this.value)">
  <input placeholder="H.Previsto_Fin" oninput="uCV(${i},'hf',this.value)">
  <input placeholder="H.Concesión" oninput="uCV(${i},'hc',this.value)">
  <input placeholder="H.Devolución" oninput="uCV(${i},'hd',this.value)">
  <button type="button" class="btn-borrar" onclick="borrarFila(this,'cortesVia',${i})">🗑 Borrar</button>
`;

  el("corte_via").appendChild(d);
  cortesVia.push({});


  d.scrollIntoView({ behavior: "smooth", block: "center" });


  d.querySelector("input").focus();


}

function uCV(i, c, v) {
  cortesVia[i][c] = v;
}

// ===== CORTE TENSION =====
function addCorteTension() {
  if (cortesTension.length >= 3) {
    alert("Máx 3");
    return;
  }

  const i = cortesTension.length;
  const d = document.createElement("div");
  d.className = "fila";

  d.innerHTML = `
  <input placeholder="Vía" oninput="uCT(${i},'via',this.value)">
  <input placeholder="Estación" oninput="uCT(${i},'est',this.value)">
  <input placeholder="Inicio" oninput="uCT(${i},'ini',this.value)">
  <input placeholder="Fin" oninput="uCT(${i},'fin',this.value)">
  <input placeholder="H.Inicio" oninput="uCT(${i},'hi',this.value)">
  <input placeholder="H.Fin" oninput="uCT(${i},'hf',this.value)">
  <input placeholder="Concesión" oninput="uCT(${i},'hc',this.value)">
  <input placeholder="Devolución" oninput="uCT(${i},'hd',this.value)">
  <button type="button" class="btn-borrar" onclick="borrarFila(this,'cortesTension',${i})">🗑 Borrar</button>
`;

  el("corte_tension").appendChild(d);
  cortesTension.push({});


  d.scrollIntoView({ behavior: "smooth", block: "center" });


  d.querySelector("input").focus();


}

function uCT(i, c, v) {
  cortesTension[i][c] = v;
}

// ===== UBICACIONES =====
function addUbicacion() {
  const cont = el("ubicaciones");

  if (cont.children.length >= 3) {
    alert("Máximo 3 ubicaciones");
    return;
  }

  const div = document.createElement("div");
  div.className = "fila";

  div.innerHTML = `
  <input placeholder="Hilo">
  <input placeholder="PK inicio">
  <input placeholder="PK fin">
  <button type="button" class="btn-borrar" onclick="this.parentElement.remove()">🗑 Borrar</button>
`;

  cont.appendChild(div);


  div.scrollIntoView({ behavior: "smooth", block: "center" });


  div.querySelector("input").focus();


}

// ===== DATOS =====
function getData() {
  const ubicaciones = [];
  document.querySelectorAll("#ubicaciones div").forEach(div => {
    const inputs = div.querySelectorAll("input");

    ubicaciones.push({
      hilo: inputs[0].value,
      pk_ini: inputs[1].value,
      pk_fin: inputs[2].value
    });
  });

  const actuaciones = [];
  document.querySelectorAll("#actuaciones div").forEach(div => {
    const inputs = div.querySelectorAll("input");

    actuaciones.push({
      codigo: inputs[0].value,
      cantidad: inputs[1].value,
      unidad: inputs[2].value
    });
  });

  return {
    g: {
      ap: valor("actuacion_principal"),
      f: valor("fecha"),
      l: valor("linea"),
      j: valor("jefatura"),
      d: valor("distrito")
    },
    t: trabajadores,
    m: maquinaria,
    mat: materiales,
    cv: cortesVia,
    ct: cortesTension,
    p2: {
      ubicaciones,
      detalle: valor("detalle_trabajos")
    },
    actuaciones,
    obs: valor("observaciones"),
    ute: valor("agente_ute"),
    enc: valor("encargado")
  };
}

function verJSON() {
  const salida = el("out");
  if (salida) salida.textContent = JSON.stringify(getData(), null, 2);
}

// ===== TEXTO AZUL =====
function azul(p, txt, x, y, size = 9) {
  p.drawText(String(txt || ""), {
    x,
    y,
    size,
    color: PDFLib.rgb(0, 0.1, 0.7)
  });
}

// ===== TEXTO MULTILINEA =====

function azulMulti(page, txt, x, y, maxChars = 80, lineHeight = 10, maxLines = 5) {
  if (!txt) return;

  // Respetar saltos manuales
  const bloques = txt.split("\n");

  let lineasFinales = [];

  bloques.forEach(bloque => {
    const palabras = bloque.split(" ");
    let linea = "";

    palabras.forEach(palabra => {
      const prueba = linea ? linea + " " + palabra : palabra;

      if (prueba.length > maxChars) {
        lineasFinales.push(linea);
        linea = palabra;
      } else {
        linea = prueba;
      }
    });

    if (linea) lineasFinales.push(linea);
  });

  // Limitar número de líneas
  lineasFinales = lineasFinales.slice(0, maxLines);

  // Dibujar
  lineasFinales.forEach((l, i) => {
    azul(page, l, x, y - (i * lineHeight));
  });
}

// ===== PDF =====
async function generarPDF() {
  try {
    if (typeof PDFLib === "undefined") {
      throw new Error("No se ha cargado pdf-lib.min.js");
    }

    const bytes = await cargarBytesPlantillaPDF();
    const pdf = await PDFLib.PDFDocument.load(bytes);
    const pages = pdf.getPages();

    if (pages.length < 2) {
      throw new Error("La plantilla PDF debe tener al menos 2 páginas");
    }

    const page1 = pages[0];
    const page2 = pages[1];

    const h = page1.getSize().height;
    const h2 = page2.getSize().height;

    const d = getData();

    // ===== GENERALES =====
    azul(page1, d.g.ap, 160, h - 120);
    azul(page1, d.g.f, 300, h - 133);
    azul(page1, d.g.l, 501, h - 101);
    azul(page1, d.g.j, 501, h - 120);
    azul(page1, d.g.d, 501, h - 133);

    // ===== TRABAJADORES =====
    const baseTrabY = h - 192;
    const saltoTrab = 12.85;

    d.t.forEach((t, i) => {
      const y = baseTrabY - (i * saltoTrab);

      azul(page1, t.categoria, 24, y);
      azul(page1, t.conductor, 92, y);
      azul(page1, t.recurso, 161, y);
      azul(page1, t.dni, 228, y);
      azul(page1, t.nombre, 296, y);
      azul(page1, t.horas, 500, y);
    });

    // ===== VEHICULOS =====
    const baseVehY = h - 420;
    const saltoVeh = 12.85;

    d.m.forEach((v, i) => {
      const y = baseVehY - (i * saltoVeh);

      azul(page1, v.desc, 24, y);
      azul(page1, v.tipo, 296, y);
      azul(page1, v.mat, 364, y);
      azul(page1, v.horas, 500, y);
    });

    // ===== MATERIAL =====
    const baseMatY = h - 520;
    const saltoMat = 12.85;

    d.mat.forEach((m, i) => {
      const y = baseMatY - (i * saltoMat);

      azul(page1, m.nom, 24, y);
      azul(page1, m.cant, 296, y);
      azul(page1, m.uni, 432, y);
    });

    // ===== CORTE VIA =====
    const baseViaY = h - 640;
    const saltoVia = 12.85;

    d.cv.forEach((c, i) => {
      const y = baseViaY - (i * saltoVia);

      azul(page1, c.via, 24, y);
      azul(page1, c.est, 92, y);
      azul(page1, c.ini, 161, y);
      azul(page1, c.fin, 228, y);
      azul(page1, c.hi, 296, y);
      azul(page1, c.hf, 364, y);
      azul(page1, c.hc, 432, y);
      azul(page1, c.hd, 500, y);
    });

    // ===== CORTE TENSION =====
    const baseTenY = h - 720;
    const saltoTen = 12.85;

    d.ct.forEach((c, i) => {
      const y = baseTenY - (i * saltoTen);

      azul(page1, c.via, 24, y);
      azul(page1, c.est, 92, y);
      azul(page1, c.ini, 161, y);
      azul(page1, c.fin, 228, y);
      azul(page1, c.hi, 296, y);
      azul(page1, c.hf, 364, y);
      azul(page1, c.hc, 432, y);
      azul(page1, c.hd, 500, y);
    });

    // ===== OBS =====
    azulMulti(page1, d.obs, 24, h - 765, 95, 10, 3);

    // ===== FIRMAS =====
    azul(page1, d.ute, 295, h - 785);
    azul(page1, d.enc, 363, h - 805);

    // ===== PAGINA 2 =====
    azul(page2, d.g.f, 501, h2 - 50);

    // ===== DETALLE TRABAJOS =====
    if (d.p2 && d.p2.detalle) {
      azulMulti(page2, d.p2.detalle, 24, h2 - 510, 100, 10, 8);
    }

    // ===== DATOS CORTE VIA EN PAGINA 2 =====
    if (d.cv.length > 0) {
      const c = d.cv[0];
      azul(page2, c.est, 92, h2 - 715);
      azul(page2, c.ini, 161, h2 - 715);
      azul(page2, c.fin, 228, h2 - 715);
      azul(page2, c.via, 296, h2 - 715);
    }

    // ===== UBICACIONES =====
    const baseUbY = h2 - 715;
    const saltoUb = 12.85;

    if (d.p2 && d.p2.ubicaciones) {
      d.p2.ubicaciones.forEach((u, i) => {
        const y = baseUbY - (i * saltoUb);

        azul(page2, u.hilo, 364, y);
        azul(page2, u.pk_ini, 432, y);
        azul(page2, u.pk_fin, 500, y);
      });
    }

    // ===== LISTA DE CODIGOS =====
    const baseCodY = h2 - 715;
    const saltoCod = 12.85;

    if (d.actuaciones) {
      d.actuaciones.forEach((a, i) => {
        const y = baseCodY - (i * saltoCod);
        azul(page2, a.codigo, 24, y);
      });
    }

    // ===== FIRMAS PAGINA 2 =====
    azul(page2, d.ute, 24, h2 - 800);
    azul(page2, d.enc, 161, h2 - 800);

    // ===== ACTUACIONES POR POSICION FIJA =====
    d.actuaciones.forEach(a => {
      const pos = POS_ACT[a.codigo];
      if (!pos) return;

      azul(page2, a.cantidad, pos.x, pos.y);
      azul(page2, a.unidad, pos.x + 69, pos.y);
    });

    // ===== GUARDAR =====
    const pdfBytes = await pdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;


    let nombreArchivo = "parte.pdf";

if (d.g.f && d.g.f.includes("-")) {
  const partes = d.g.f.split("-"); // yyyy-mm-dd

  if (partes.length === 3) {
    const anio = partes[0].slice(-2);
    const mes = partes[1];
    const dia = partes[2];

    nombreArchivo = `parte_${dia}-${mes}-${anio}.pdf`;
  }
}

a.download = nombreArchivo;

console.log("Nombre archivo:", nombreArchivo);

    document.body.appendChild(a);
    a.click();
    a.remove();

console.log("Nombre archivo:", nombreArchivo);


  } catch (error) {
    console.error(error);
    alert("Error al generar PDF: " + error.message);
  }
}

// ===== GUARDAR MANUAL =====
function guardarManual() {
  const datos = getData();
  localStorage.setItem("parteADIF", JSON.stringify(datos));
  alert("Parte guardado correctamente");
}

// ===== RECUPERAR =====
function recuperarParte() {
  const datos = localStorage.getItem("parteADIF");

  if (!datos) {
    alert("No hay datos guardados");
    return;
  }

  const d = JSON.parse(datos);
  cargarDesdeJSON(d);
}

// ===== NUEVO =====
function nuevoParte() {
  if (!confirm("Se borrarán los datos actuales")) return;

  localStorage.removeItem("parteADIF");
  location.reload();
}

// ===== CARGAR DATOS =====
function cargarDesdeJSON(d) {
  trabajadores = [];
  maquinaria = [];
  materiales = [];
  cortesVia = [];
  cortesTension = [];

  // ===== GENERALES =====
  ponerValor("actuacion_principal", d.g?.ap);
  ponerValor("fecha", d.g?.f);
  ponerValor("linea", d.g?.l);
  ponerValor("jefatura", d.g?.j);
  ponerValor("distrito", d.g?.d);

  // ===== TRABAJADORES =====
  const contTrab = el("trabajadores");
  contTrab.innerHTML = "";

  if (d.t && d.t.length) {
    d.t.forEach(trab => {
      addTrabajador();

      const fila = contTrab.lastElementChild;
      const inputs = fila.querySelectorAll("input");

      inputs[0].value = trab.categoria || "";
      inputs[1].value = trab.conductor || "";
      inputs[2].value = trab.recurso || "";
      inputs[3].value = trab.dni || "";
      inputs[4].value = trab.nombre || "";
      inputs[5].value = trab.horas || "";

      trabajadores[trabajadores.length - 1] = { ...trab };
    });
  }

  // ===== VEHÍCULOS =====
  const contMaq = el("maquinaria");
  contMaq.innerHTML = "";

  if (d.m && d.m.length) {
    d.m.forEach(v => {
      addMaquina();

      const fila = contMaq.lastElementChild;
      const inputs = fila.querySelectorAll("input");

      inputs[0].value = v.desc || "";
      inputs[1].value = v.tipo || "";
      inputs[2].value = v.mat || "";
      inputs[3].value = v.horas || "";

      maquinaria[maquinaria.length - 1] = { ...v };
    });
  }

  // ===== MATERIAL =====
  const contMat = el("material");
  contMat.innerHTML = "";

  if (d.mat && d.mat.length) {
    d.mat.forEach(m => {
      addMaterial();

      const fila = contMat.lastElementChild;
      const inputs = fila.querySelectorAll("input");

      inputs[0].value = m.nom || "";
      inputs[1].value = m.cant || "";
      inputs[2].value = m.uni || "";

      materiales[materiales.length - 1] = { ...m };
    });
  }

  // ===== CORTE VIA =====
  const contCV = el("corte_via");
  contCV.innerHTML = "";

  if (d.cv && d.cv.length) {
    d.cv.forEach(c => {
      addCorteVia();

      const fila = contCV.lastElementChild;
      const inputs = fila.querySelectorAll("input");

      inputs[0].value = c.via || "";
      inputs[1].value = c.est || "";
      inputs[2].value = c.ini || "";
      inputs[3].value = c.fin || "";
      inputs[4].value = c.hi || "";
      inputs[5].value = c.hf || "";
      inputs[6].value = c.hc || "";
      inputs[7].value = c.hd || "";

      cortesVia[cortesVia.length - 1] = { ...c };
    });
  }

  // ===== CORTE TENSION =====
  const contCT = el("corte_tension");
  if (contCT) {
    contCT.innerHTML = "";

    if (d.ct && d.ct.length) {
      d.ct.forEach(c => {
        addCorteTension();

        const fila = contCT.lastElementChild;
        const inputs = fila.querySelectorAll("input");

        inputs[0].value = c.via || "";
        inputs[1].value = c.est || "";
        inputs[2].value = c.ini || "";
        inputs[3].value = c.fin || "";
        inputs[4].value = c.hi || "";
        inputs[5].value = c.hf || "";
        inputs[6].value = c.hc || "";
        inputs[7].value = c.hd || "";

        cortesTension[cortesTension.length - 1] = { ...c };
      });
    }
  }

  // ===== OBS =====
  ponerValor("observaciones", d.obs);

  // ===== FIRMAS =====
  ponerValor("agente_ute", d.ute);
  ponerValor("encargado", d.enc);

  // ===== PAGINA 2 =====
  ponerValor("detalle_trabajos", d.p2?.detalle);

  const contUb = el("ubicaciones");
  contUb.innerHTML = "";

  if (d.p2?.ubicaciones) {
    d.p2.ubicaciones.forEach(u => {
      addUbicacion();

      const fila = contUb.lastElementChild;
      const inputs = fila.querySelectorAll("input");

      inputs[0].value = u.hilo || "";
      inputs[1].value = u.pk_ini || "";
      inputs[2].value = u.pk_fin || "";
    });
  }

  // ===== ACTUACIONES =====
  const contAct = el("actuaciones");
  contAct.innerHTML = "";

  if (d.actuaciones) {
    d.actuaciones.forEach(a => {
      addActuacion();

      const fila = contAct.lastElementChild;
      const select = fila.querySelector("select");
      const inputs = fila.querySelectorAll("input");

      const index = ACTUACIONES.findIndex(act => act.codigo === a.codigo);
      if (index >= 0) {
        select.value = String(index);
      } else {
        select.value = "";
      }

      inputs[0].value = a.codigo || "";
      inputs[1].value = a.cantidad || "";
      inputs[2].value = a.unidad || "";
    });
  }
}


 // ===== CARGA AUTOMATICA =====
 
window.addEventListener("DOMContentLoaded", () => {
  const datosGuardados = localStorage.getItem("parteADIF");

  if (datosGuardados) {
    try {
      const d = JSON.parse(datosGuardados);
      cargarDesdeJSON(d);
    } catch (error) {
      console.error("Error al cargar datos guardados:", error);
      alert("Los datos guardados están dañados y no se pudieron cargar.");
    }
  }
});

