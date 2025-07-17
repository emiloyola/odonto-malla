document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("malla-container");
  const contadorRamos = document.getElementById("contador-ramos");
  const totalRamosSpan = document.getElementById("total-ramos");
  const contadorCreditos = document.getElementById("contador-creditos");
  const resetBtn = document.getElementById("reset");

  // Datos malla (completa, ordenada por semestre)
  // NOTA: IDs sin espacios, todo lowercase, reemplazando ñ con n y acentos por letras simples para JS
  const ramos = [
    // Semestre 1
    {id:"histologia", nombre:"Histología General", creditos:6, semestre:1, prereqs:[], desbloquea:["histologia_oral"]},
    {id:"histologia_oral", nombre:"Histología Oral", creditos:5, semestre:2, prereqs:["histologia"], desbloquea:["bases_biologicas"]},
    {id:"biologia_celular", nombre:"Biología Celular y Genética", creditos:6, semestre:1, prereqs:[], desbloquea:["bases_microbiologia"]},
    {id:"bases_microbiologia", nombre:"Bases Científicas de la Microbiología", creditos:6, semestre:2, prereqs:["biologia_celular"], desbloquea:["bases_semiologicas"]},
    {id:"bases_anatomicas", nombre:"Bases Anatómicas", creditos:6, semestre:1, prereqs:[], desbloquea:["anatomia_cara_cuello"]},
    {id:"anatomia_cara_cuello", nombre:"Anatomía de Cara y Cuello", creditos:6, semestre:2, prereqs:["bases_anatomicas"], desbloquea:["bases_biologicas"]},
    {id:"procesos_quimicos_1", nombre:"Procesos Químicos I", creditos:6, semestre:1, prereqs:[], desbloquea:["procesos_quimicos_2"]},
    {id:"procesos_quimicos_2", nombre:"Procesos Químicos II", creditos:6, semestre:2, prereqs:["procesos_quimicos_1"], desbloquea:["bases_bioquimicas_1","simulaciones_1"]},
    {id:"procesos_fisicos_1", nombre:"Procesos Físicos I", creditos:6, semestre:1, prereqs:[], desbloquea:["procesos_fisicos_2"]},
    {id:"procesos_fisicos_2", nombre:"Procesos Físicos II", creditos:6, semestre:2, prereqs:["procesos_fisicos_1"], desbloquea:["bases_bioquimicas_1","simulaciones_1"]},
    {id:"destrezas_autocuidado_1", nombre:"Desarrollo de Destrezas y Autocuidado I", creditos:4, semestre:1, prereqs:[], desbloquea:["destrezas_autocuidado_2"]},
    {id:"destrezas_autocuidado_2", nombre:"Desarrollo de Destrezas y Autocuidado II", creditos:4, semestre:2, prereqs:["destrezas_autocuidado_1"], desbloquea:["simulaciones_1"]},
    {id:"ingles_1", nombre:"Inglés I", creditos:4, semestre:1, prereqs:[], desbloquea:["ingles_2"]},
    {id:"ingles_2", nombre:"Inglés II", creditos:4, semestre:2, prereqs:["ingles_1"], desbloquea:["ingles_3"]},

    // Semestre 2
    {id:"bases_biologicas", nombre:"Bases Biológicas y Fisiológicas", creditos:6, semestre:3, prereqs:["histologia_oral","anatomia_cara_cuello"], desbloquea:["bases_bioquimicas_2"]},
    {id:"bases_bioquimicas_1", nombre:"Bases Bioquímicas y Fisiológicas I", creditos:6, semestre:2, prereqs:["procesos_quimicos_2","procesos_fisicos_2"], desbloquea:["bases_bioquimicas_2"]},
    {id:"simulaciones_1", nombre:"Simulaciones para el Ejercicio Profesional I", creditos:6, semestre:2, prereqs:["destrezas_autocuidado_2","procesos_quimicos_2","procesos_fisicos_2"], desbloquea:["simulaciones_2"]},
    {id:"ingles_3", nombre:"Inglés III", creditos:4, semestre:3, prereqs:["ingles_2"], desbloquea:["ingles_4"]},

    // Semestre 3
    {id:"bases_bioquimicas_2", nombre:"Bases Bioquímicas y Fisiológicas II", creditos:6, semestre:3, prereqs:["bases_biologicas","bases_bioquimicas_1"], desbloquea:["clinica_nino_1","clinica_adulto_1","clinica_rehabilitacion_1"]},
    {id:"bases_semiologicas", nombre:"Bases Semiológicas", creditos:6, semestre:3, prereqs:["bases_microbiologia"], desbloquea:["simulaciones_2"]},
    {id:"simulaciones_2", nombre:"Simulaciones para el Ejercicio Profesional II", creditos:6, semestre:3, prereqs:["simulaciones_1","bases_semiologicas"], desbloquea:["clinica_nino_1","clinica_adulto_1","clinica_rehabilitacion_1"]},
    {id:"ingles_4", nombre:"Inglés IV", creditos:4, semestre:4, prereqs:["ingles_3"], desbloquea:[]},

    // Semestre 4
    {id:"clinica_nino_1", nombre:"Clínica Integral del Niño I", creditos:8, semestre:4, prereqs:["bases_bioquimicas_2","simulaciones_2"], desbloquea:["clinica_nino_2"]},
    {id:"clinica_adulto_1", nombre:"Clínica Integral del Adulto I", creditos:8, semestre:4, prereqs:["bases_bioquimicas_2","simulaciones_2"], desbloquea:["clinica_adulto_2"]},
    {id:"clinica_rehabilitacion_1", nombre:"Clínica de Rehabilitación I", creditos:8, semestre:4, prereqs:["bases_bioquimicas_2","simulaciones_2"], desbloquea:["clinica_rehabilitacion_2"]},

    // Semestre 5
    {id:"clinica_nino_2", nombre:"Clínica Integral del Niño II", creditos:8, semestre:5, prereqs:["clinica_nino_1"], desbloquea:["clinica_nino_3"]},
    {id:"clinica_adulto_2", nombre:"Clínica Integral del Adulto II", creditos:8, semestre:5, prereqs:["clinica_adulto_1"], desbloquea:["clinica_adulto_3"]},
    {id:"clinica_rehabilitacion_2", nombre:"Clínica de Rehabilitación II", creditos:8, semestre:5, prereqs:["clinica_rehabilitacion_1"], desbloquea:["clinica_rehabilitacion_3"]},

    // Semestre 6
    {id:"clinica_nino_3", nombre:"Clínica Integral del Niño III", creditos:8, semestre:6, prereqs:["clinica_nino_2"], desbloquea:["clinica_nino_4"]},
    {id:"clinica_adulto_3", nombre:"Clínica Integral del Adulto III", creditos:8, semestre:6, prereqs:["clinica_adulto_2"], desbloquea:["clinica_adulto_4"]},
    {id:"clinica_rehabilitacion_3", nombre:"Clínica de Rehabilitación III", creditos:8, semestre:6, prereqs:["clinica_rehabilitacion_2"], desbloquea:["clinica_rehabilitacion_4"]},

    // Semestre 7
    {id:"clinica_nino_4", nombre:"Clínica Integral del Niño IV", creditos:8, semestre:7, prereqs:["clinica_nino_3"], desbloquea:[]},
    {id:"clinica_adulto_4", nombre:"Clínica Integral del Adulto IV", creditos:8, semestre:7, prereqs:["clinica_adulto_3"], desbloquea:[]},
    {id:"clinica_rehabilitacion_4", nombre:"Clínica de Rehabilitación IV", creditos:8, semestre:7, prereqs:["clinica_rehabilitacion_3"], desbloquea:[]},

    // Semestre 9 y 10 (internado y otros)
    {id:"internado_docente", nombre:"Internado Docente", creditos:12, semestre:9, prereqs:["clinica_nino_4","clinica_adulto_4","clinica_rehabilitacion_4"], desbloquea:[]},
    {id:"trabajo_investigacion", nombre:"Trabajo de Investigación", creditos:6, semestre:9, prereqs:["clinica_nino_4","clinica_adulto_4","clinica_rehabilitacion_4"], desbloquea:[]},
    {id:"actividades_electivas", nombre:"Actividades Electivas y de Formación General", creditos:4, semestre:9, prereqs:["clinica_nino_4","clinica_adulto_4","clinica_rehabilitacion_4"], desbloquea:[]},
    {id:"gestion_salud_publica", nombre:"Gestión y Salud Pública", creditos:4, semestre:9, prereqs:["clinica_nino_4","clinica_adulto_4","clinica_rehabilitacion_4"], desbloquea:[]},
  ];

  // Convertir array en diccionario para acceso rápido
  const ramosMap = {};
  ramos.forEach(r => ramosMap[r.id] = r);

  let progreso = JSON.parse(localStorage.getItem("mallaProgreso")) || {};

  // Inicial: desbloquear los que no tienen prereqs si no hay progreso
  ramos.forEach(r => {
    if (r.prereqs.length === 0 && !progreso[r.id]) {
      progreso[r.id] = { estado: "desbloqueado" };
    }
  });

  function renderMalla() {
    container.innerHTML = "";
    let aprobados = 0;
    let creditos = 0;

    ramos.forEach(ramo => {
      const div = document.createElement("div");
      div.classList.add("ramo");
      div.id = ramo.id;
      div.innerHTML = `<div>${ramo.nombre} (${ramo.creditos} cr.)</div>`;

      const estado = progreso[ramo.id]?.estado || "bloqueado";

      div.classList.remove("bloqueado","desbloqueado","aprobado");
      div.classList.add(estado);

      if (estado === "aprobado") {
        aprobados++;
        creditos += ramo.creditos;
        addPromedio(div, progreso[ramo.id]?.promedio || "");
      }

      div.onclick = () => {
        if (div.classList.contains("bloqueado")) return;

        if (!div.classList.contains("aprobado")) {
          marcarAprobado(ramo.id);
        } else {
          // Opcional: permitir desmarcar aprobado para probar
          desmarcarAprobado(ramo.id);
        }
        guardarProgreso();
        renderMalla();
      };

      container.appendChild(div);
    });

    contadorRamos.textContent = aprobados;
    totalRamosSpan.textContent = ramos.length;
    contadorCreditos.textContent = creditos;
  }

  function addPromedio(div, valor) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = 1;
    input.max = 7;
    input.placeholder = "Promedio";
    input.value = valor;
    input.oninput = (e) => {
      progreso[div.id].promedio = e.target.value;
      guardarProgreso();
    };
    div.appendChild(document.createElement("br"));
    div.appendChild(input);
  }

  function marcarAprobado(id) {
    progreso[id] = { estado: "aprobado", promedio: progreso[id]?.promedio || "" };
    // Desbloquear los que dependen de este ramo (puede ser varios)
    ramos.forEach(r => {
      if (r.prereqs.includes(id) && progreso[r.id]?.estado !== "aprobado") {
        // Comprobar que TODOS sus prereqs estén aprobados para desbloquear
        const todosAprobados = r.prereqs.every(pre => progreso[pre]?.estado === "aprobado");
        if (todosAprobados) {
          progreso[r.id] = { estado: "desbloqueado" };
        }
      }
    });
  }

  function desmarcarAprobado(id) {
    // Quitar aprobado
    progreso[id] = { estado: "desbloqueado" };
    // Recursivamente bloquear dependientes si no cumplen prereqs
    bloquearDependientes(id);
  }

  function bloquearDependientes(id) {
    ramos.forEach(r => {
      if (r.prereqs.includes(id)) {
        progreso[r.id] = { estado: "bloqueado" };
        bloquearDependientes(r.id);
      }
    });
  }

  function guardarProgreso() {
    localStorage.setItem("mallaProgreso", JSON.stringify(progreso));
  }

  resetBtn.onclick = () => {
    progreso = {};
    localStorage.removeItem("mallaProgreso");
    ramos.forEach(r => {
      if (r.prereqs.length === 0) {
        progreso[r.id] = { estado: "desbloqueado" };
      }
    });
    renderMalla();
  };

  renderMalla();
});
