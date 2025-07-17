document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("malla-container");
  const contadorRamos = document.getElementById("contador-ramos");
  const totalRamosSpan = document.getElementById("total-ramos");
  const contadorCreditos = document.getElementById("contador-creditos");
  const resetBtn = document.getElementById("reset");

  const ramos = [
    // SEMESTRE 1
    { id: "ddaep1", nombre: "Desarrollo de Destrezas y Autocuidado I", creditos: 6, semestre: 1, prereqs: [] },
    { id: "fisica1", nombre: "Procesos Físicos I", creditos: 3, semestre: 1, prereqs: [] },
    { id: "quimica1", nombre: "Procesos Químicos I", creditos: 3, semestre: 1, prereqs: [] },
    { id: "anat1", nombre: "Bases Anatómicas", creditos: 6, semestre: 1, prereqs: [] },
    { id: "histog", nombre: "Histología General", creditos: 3, semestre: 1, prereqs: [] },
    { id: "biocel", nombre: "Biología Celular y Genética", creditos: 5, semestre: 1, prereqs: [] },
    { id: "ingles1", nombre: "Inglés I", creditos: 3, semestre: 1, prereqs: [] },

    // SEMESTRE 2
    { id: "ddaep2", nombre: "Desarrollo de Destrezas y Autocuidado II", creditos: 6, semestre: 2, prereqs: ["ddaep1"] },
    { id: "fisica2", nombre: "Procesos Físicos II", creditos: 3, semestre: 2, prereqs: ["fisica1"] },
    { id: "quimica2", nombre: "Procesos Químicos II", creditos: 4, semestre: 2, prereqs: ["quimica1"] },
    { id: "anat2", nombre: "Anatomía de Cara y Cuello", creditos: 5, semestre: 2, prereqs: ["anat1"] },
    { id: "historal", nombre: "Histología Oral", creditos: 5, semestre: 2, prereqs: ["histog"] },
    { id: "formgen1", nombre: "Formación General I", creditos: 2, semestre: 2, prereqs: [] },
    { id: "ingles2", nombre: "Inglés II", creditos: 3, semestre: 2, prereqs: ["ingles1"] },

    // SEMESTRE 3
    { id: "sim1", nombre: "Simulaciones para el Ejercicio Profesional I", creditos: 8, semestre: 3, prereqs: ["ddaep2"] },
    { id: "bps1", nombre: "Bases Psicosociales y Antropológicas de la Salud I", creditos: 2, semestre: 3, prereqs: [] },
    { id: "biof1", nombre: "Bases Bioquímicas y Fisiológicas I", creditos: 6, semestre: 3, prereqs: ["quimica2"] },
    { id: "patomicro", nombre: "Bases Científicas de Patología y Microbiología", creditos: 6, semestre: 3, prereqs: ["historal"] },
    { id: "promo1", nombre: "Promoción y Educación en Salud I", creditos: 3, semestre: 3, prereqs: [] },
    { id: "formgen2", nombre: "Formación General II", creditos: 2, semestre: 3, prereqs: [] },
    { id: "ingles3", nombre: "Inglés III", creditos: 3, semestre: 3, prereqs: ["ingles2"] },

    // SEMESTRE 4
    { id: "sim2", nombre: "Simulaciones para el Ejercicio Profesional II", creditos: 8, semestre: 4, prereqs: ["sim1"] },
    { id: "bps2", nombre: "Bases Psicosociales y Antropológicas de la Salud II", creditos: 2, semestre: 4, prereqs: ["bps1"] },
    { id: "biof2", nombre: "Bases Bioquímicas y Fisiológicas II", creditos: 6, semestre: 4, prereqs: ["biof1"] },
    { id: "semiologia", nombre: "Bases Semiológicas", creditos: 6, semestre: 4, prereqs: ["sim1"] },
    { id: "promo2", nombre: "Promoción y Educación en Salud II", creditos: 3, semestre: 4, prereqs: ["promo1"] },
    { id: "formgen3", nombre: "Formación General III", creditos: 2, semestre: 4, prereqs: ["formgen2"] },
    { id: "ingles4", nombre: "Inglés IV", creditos: 3, semestre: 4, prereqs: ["ingles3"] },

    // SEMESTRE 5
    { id: "nino1", nombre: "Clínica Odontológica del Niño y Adolescente I", creditos: 6, semestre: 5, prereqs: ["sim2"] },
    { id: "adulto1", nombre: "Clínica Odontológica del Adulto I", creditos: 7, semestre: 5, prereqs: ["sim2"] },
    { id: "mayor1", nombre: "Clínica Odontológica del Adulto Mayor I", creditos: 7, semestre: 5, prereqs: ["sim2"] },
    { id: "gestion", nombre: "Gestión y Administración para el Ejercicio Profesional", creditos: 4, semestre: 5, prereqs: [] },
    { id: "fund1", nombre: "Fund. Científicos y Clínicos de la Enfermedad I", creditos: 4, semestre: 5, prereqs: ["patomicro"] },
    { id: "interv1", nombre: "Intervención Familiar y Comunitaria I", creditos: 3, semestre: 5, prereqs: [] },

    // SEMESTRE 6
    { id: "nino2", nombre: "Clínica Odontológica del Niño y Adolescente II", creditos: 6, semestre: 6, prereqs: ["nino1"] },
    { id: "adulto2", nombre: "Clínica Odontológica del Adulto II", creditos: 7, semestre: 6, prereqs: ["adulto1"] },
    { id: "mayor2", nombre: "Clínica Odontológica del Adulto Mayor II", creditos: 7, semestre: 6, prereqs: ["mayor1"] },
    { id: "farmaco", nombre: "Farmacología", creditos: 2, semestre: 6, prereqs: ["biof2"] },
    { id: "fund2", nombre: "Fund. Científicos y Clínicos de la Enfermedad II", creditos: 6, semestre: 6, prereqs: ["fund1"] },
    { id: "interv2", nombre: "Intervención Familiar y Comunitaria II", creditos: 3, semestre: 6, prereqs: ["interv1"] },
  ];
  // SEMESTRE 7
  ramos.push(
    { id: "nino3", nombre: "Clínica Odontológica del Niño y Adolescente III", creditos: 7, semestre: 7, prereqs: ["nino2"] },
    { id: "adulto3", nombre: "Clínica Odontológica del Adulto III", creditos: 7, semestre: 7, prereqs: ["adulto2"] },
    { id: "mayor3", nombre: "Clínica Odontológica del Adulto Mayor III", creditos: 7, semestre: 7, prereqs: ["mayor2"] },
    { id: "urg1", nombre: "Urgencias Odontológicas I", creditos: 3, semestre: 7, prereqs: [] },
    { id: "proj1", nombre: "Proyecto de Investigación I", creditos: 3, semestre: 7, prereqs: [] },
    { id: "mant1", nombre: "Mantención del Estado de Salud I", creditos: 3, semestre: 7, prereqs: [] }
  );

  // SEMESTRE 8
  ramos.push(
    { id: "nino4", nombre: "Clínica Odontológica del Niño y Adolescente IV", creditos: 7, semestre: 8, prereqs: ["nino3"] },
    { id: "adulto4", nombre: "Clínica Odontológica del Adulto IV", creditos: 7, semestre: 8, prereqs: ["adulto3"] },
    { id: "mayor4", nombre: "Clínica Odontológica del Adulto Mayor IV", creditos: 7, semestre: 8, prereqs: ["mayor3"] },
    { id: "urg2", nombre: "Urgencias Odontológicas II", creditos: 3, semestre: 8, prereqs: ["urg1"] },
    { id: "proj2", nombre: "Proyecto de Investigación II", creditos: 3, semestre: 8, prereqs: ["proj1"] },
    { id: "mant2", nombre: "Mantención del Estado de Salud II", creditos: 3, semestre: 8, prereqs: ["mant1"] }
  );

  // SEMESTRE 9
  ramos.push(
    { id: "urg_multi", nombre: "Urgencias Odontológicas Multidisciplinarias", creditos: 2, semestre: 9, prereqs: [] },
    { id: "neces1", nombre: "Clínica Integral Pacientes con Necesidades Especiales I", creditos: 3, semestre: 9, prereqs: [] },
    { id: "proj3", nombre: "Proyecto de Investigación III", creditos: 4, semestre: 9, prereqs: ["proj2"] },
    { id: "mant3", nombre: "Mantención del Estado de Salud III", creditos: 3, semestre: 9, prereqs: ["mant2"] },
    { id: "nino5", nombre: "Clínica Odontológica del Niño y Adolescente V", creditos: 6, semestre: 9, prereqs: ["nino4"] },
    { id: "adulto5", nombre: "Clínica Odontológica del Adulto V", creditos: 6, semestre: 9, prereqs: ["adulto4"] },
    { id: "mayor5", nombre: "Clínica Odontológica del Adulto Mayor V", creditos: 6, semestre: 9, prereqs: ["mayor4"] }
  );

  // SEMESTRE 10
  ramos.push(
    { id: "urg_med", nombre: "Urgencias Médicas", creditos: 2, semestre: 10, prereqs: ["urg_multi"] },
    { id: "neces2", nombre: "Clínica Integral Pacientes con Necesidades Especiales II", creditos: 3, semestre: 10, prereqs: ["neces1"] },
    { id: "proj4", nombre: "Ejecución Proyecto Investigación IV", creditos: 4, semestre: 10, prereqs: ["proj3"] },
    { id: "mant4", nombre: "Mantención del Estado de Salud IV", creditos: 3, semestre: 10, prereqs: ["mant3"] },
    { id: "nino6", nombre: "Clínica Odontológica del Niño y Adolescente VI", creditos: 6, semestre: 10, prereqs: ["nino5"] },
    { id: "adulto6", nombre: "Clínica Odontológica del Adulto VI", creditos: 6, semestre: 10, prereqs: ["adulto5"] },
    { id: "mayor6", nombre: "Clínica Odontológica del Adulto Mayor VI", creditos: 6, semestre: 10, prereqs: ["mayor5"] }
  );

  // SEMESTRE 11
  ramos.push(
    { id: "internado1", nombre: "Internado Docente Asistencial", creditos: 30, semestre: 11, prereqs: ["proj4", "neces2"] }
  );

  // SEMESTRE 12
  ramos.push(
    { id: "tesis", nombre: "Tesis de Grado", creditos: 30, semestre: 12, prereqs: ["internado1"] }
  );

  const ramosMap = Object.fromEntries(ramos.map(r => [r.id, r]));
  let progreso = JSON.parse(localStorage.getItem("mallaProgreso")) || {};

  ramos.forEach(r => {
    if (r.prereqs.length === 0 && !progreso[r.id]) {
      progreso[r.id] = { estado: "desbloqueado" };
    }
  });

  function renderMalla() {
    container.innerHTML = "";
    let aprobados = 0, creditos = 0;
    const semestres = {};

    ramos.forEach(r => {
      if (!semestres[r.semestre]) semestres[r.semestre] = [];
      semestres[r.semestre].push(r);
    });

    Object.keys(semestres).sort((a, b) => a - b).forEach(numSemestre => {
      const semDiv = document.createElement("div");
      semDiv.className = "semestre";

      const ramosSem = semestres[numSemestre];
      const totalCreditosSem = ramosSem.reduce((sum, r) => sum + r.creditos, 0);
      let sumaPonderada = 0, creditosAprobados = 0;

      ramosSem.forEach(ramo => {
        const div = document.createElement("div");
        div.classList.add("ramo");
        div.id = ramo.id;
        div.innerHTML = `<div>${ramo.nombre} (${ramo.creditos} cr.)</div>`;

        const estado = progreso[ramo.id]?.estado || "bloqueado";
        div.className = `ramo ${estado}`;

        if (estado === "aprobado") {
          aprobados++;
          creditos += ramo.creditos;
          const promedio = parseFloat(progreso[ramo.id]?.promedio || 0);
          if (promedio) {
            sumaPonderada += promedio * ramo.creditos;
            creditosAprobados += ramo.creditos;
          }
        }

        div.addEventListener("dblclick", () => {
          if (estado === "bloqueado") return;
          if (estado !== "aprobado") marcarAprobado(ramo.id);
          else desmarcarAprobado(ramo.id);
          guardarProgreso();
          renderMalla();
        });

        if (estado !== "bloqueado") {
          const input = document.createElement("input");
          input.type = "number";
          input.min = 1;
          input.max = 7;
          input.step = 0.1;
          input.value = progreso[ramo.id]?.promedio || "";
          input.placeholder = "Promedio";
          input.addEventListener("input", (e) => {
            progreso[ramo.id].promedio = e.target.value;
            guardarProgreso();
          });
          div.appendChild(document.createElement("br"));
          div.appendChild(input);
        }

        semDiv.appendChild(div);
      });

      const promedioSem = creditosAprobados ? (sumaPonderada / creditosAprobados).toFixed(2) : "-";
      semDiv.insertAdjacentHTML("afterbegin", `<h2>Semestre ${numSemestre} – Promedio: ${promedioSem}</h2>`);
      container.appendChild(semDiv);
    });

    contadorRamos.textContent = aprobados;
    totalRamosSpan.textContent = ramos.length;
    contadorCreditos.textContent = creditos;
  }

  function marcarAprobado(id) {
    progreso[id] = { estado: "aprobado", promedio: progreso[id]?.promedio || "" };
    ramos.forEach(r => {
      if (r.prereqs.includes(id)) {
        const desbloquear = r.prereqs.every(pr => progreso[pr]?.estado === "aprobado");
        if (desbloquear && progreso[r.id]?.estado !== "aprobado") {
          progreso[r.id] = { estado: "desbloqueado" };
        }
      }
    });
  }

  function desmarcarAprobado(id) {
    progreso[id] = { estado: "desbloqueado" };
    ramos.forEach(r => {
      if (r.prereqs.includes(id)) {
        progreso[r.id] = { estado: "bloqueado" };
        desmarcarAprobado(r.id);
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
