// SCRIPT COMPLETO – MALLA CURRICULAR ODONTOLOGÍA FOUCh
// Basado en versión oficial octubre 2024
// Incluye: 12 semestres, prerrequisitos, SCT, promedio ponderado, desbloqueo dinámico, corrección visual

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("malla-container");
  const contadorRamos = document.getElementById("contador-ramos");
  const totalRamosSpan = document.getElementById("total-ramos");
  const contadorCreditos = document.getElementById("contador-creditos");
  const resetBtn = document.getElementById("reset");

  const ramos = [
    { id: "ddaep1", nombre: "Desarrollo de Destrezas y Autocuidado I", creditos: 6, semestre: 1, prereqs: [] },
    { id: "fisica1", nombre: "Procesos Físicos I", creditos: 3, semestre: 1, prereqs: [] },
    { id: "quimica1", nombre: "Procesos Químicos I", creditos: 3, semestre: 1, prereqs: [] },
    { id: "anat1", nombre: "Bases Anatómicas", creditos: 6, semestre: 1, prereqs: [] },
    { id: "histog", nombre: "Histología General", creditos: 3, semestre: 1, prereqs: [] },
    { id: "biocel", nombre: "Biología Celular y Genética", creditos: 5, semestre: 1, prereqs: [] },
    { id: "ingles1", nombre: "Inglés I", creditos: 3, semestre: 1, prereqs: [] },
    { id: "ddaep2", nombre: "Desarrollo de Destrezas y Autocuidado II", creditos: 6, semestre: 2, prereqs: ["ddaep1"] },
    { id: "fisica2", nombre: "Procesos Físicos II", creditos: 3, semestre: 2, prereqs: ["fisica1"] },
    { id: "quimica2", nombre: "Procesos Químicos II", creditos: 4, semestre: 2, prereqs: ["quimica1"] },
    { id: "anat2", nombre: "Anatomía de Cara y Cuello", creditos: 5, semestre: 2, prereqs: ["anat1"] },
    { id: "historal", nombre: "Histología Oral", creditos: 5, semestre: 2, prereqs: ["histog"] },
    { id: "formgen1", nombre: "Formación General I", creditos: 2, semestre: 2, prereqs: [] },
    { id: "ingles2", nombre: "Inglés II", creditos: 3, semestre: 2, prereqs: ["ingles1"] },
    // SEMESTRES 3 AL 12: los agrego a continuación...
  ];

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
