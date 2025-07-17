document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("malla-container");
  const contadorRamos = document.getElementById("contador-ramos");
  const totalRamosSpan = document.getElementById("total-ramos");
  const contadorCreditos = document.getElementById("contador-creditos");
  const resetBtn = document.getElementById("reset");

  if (!container || !contadorRamos || !totalRamosSpan || !contadorCreditos || !resetBtn) return;

  const ramos = [
    // ... (aquí va tu array completo de ramos actualizado)
  ];

  const ramosMap = {};
  ramos.forEach(r => ramosMap[r.id] = r);

  let progreso = JSON.parse(localStorage.getItem("mallaProgreso")) || {};

  function obtenerSemestresAprobados() {
    const aprobadosPorSemestre = {};
    ramos.forEach(r => {
      if (progreso[r.id]?.estado === "aprobado") {
        aprobadosPorSemestre[r.semestre] = (aprobadosPorSemestre[r.semestre] || 0) + 1;
      }
    });
    return aprobadosPorSemestre;
  }

  ramos.forEach(r => {
    if (!progreso[r.id]) {
      progreso[r.id] = { estado: "bloqueado" };
    }
  });

  function renderMalla() {
    container.innerHTML = "";
    let aprobados = 0;
    let creditos = 0;

    const semestres = {};
    ramos.forEach(r => {
      if (!semestres[r.semestre]) semestres[r.semestre] = [];
      semestres[r.semestre].push(r);
    });

    const ordenSemestres = Object.keys(semestres).sort((a, b) => a - b);

    ordenSemestres.forEach(numSemestre => {
      const semDiv = document.createElement("div");
      semDiv.className = "semestre";

      let totalCreditos = 0;
      let sumaPonderada = 0;

      const ramosSem = semestres[numSemestre];

      ramosSem.forEach(ramo => {
        const div = document.createElement("div");
        div.classList.add("ramo");
        div.id = ramo.id;
        div.innerHTML = `<div>${ramo.nombre} (${ramo.creditos} cr.)</div>`;

        const estado = progreso[ramo.id]?.estado || "bloqueado";
        div.classList.remove("bloqueado", "desbloqueado", "aprobado");
        div.classList.add(estado);

        if (estado === "aprobado") {
          aprobados++;
          creditos += ramo.creditos;
          const promedio = parseFloat(progreso[ramo.id]?.promedio);
          if (!isNaN(promedio)) {
            sumaPonderada += promedio * ramo.creditos;
            totalCreditos += ramo.creditos;
          }
        }

        div.addEventListener("dblclick", () => {
          if (div.classList.contains("bloqueado")) return;
          if (!div.classList.contains("aprobado")) {
            marcarAprobado(ramo.id);
          } else {
            desmarcarAprobado(ramo.id);
          }
          guardarProgreso();
          renderMalla();
        });

        if (estado === "aprobado" || estado === "desbloqueado") {
          addPromedio(div, progreso[ramo.id]?.promedio || "");
        }

        semDiv.appendChild(div);
      });

      let promedio = totalCreditos > 0 ? (sumaPonderada / totalCreditos).toFixed(2) : "-";
      semDiv.innerHTML = `<h2>Semestre ${numSemestre} – Promedio: ${promedio}</h2>` + semDiv.innerHTML;

      container.appendChild(semDiv);
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
    input.step = "0.1";
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
    ramos.forEach(r => {
      const todosAprobados = r.prereqs.every(pre => progreso[pre]?.estado === "aprobado");
      const semestreAnterior = parseInt(r.semestre) - 1;
      const anteriorCompletado = semestreAnterior === 0 || ramos.filter(rm => rm.semestre === semestreAnterior).every(rm => progreso[rm.id]?.estado === "aprobado");
      if (todosAprobados && anteriorCompletado && progreso[r.id]?.estado !== "aprobado") {
        progreso[r.id] = { estado: "desbloqueado", promedio: progreso[r.id]?.promedio || "" };
      }
    });
  }

  function desmarcarAprobado(id) {
    progreso[id] = { estado: "desbloqueado" };
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
      if (r.semestre === 1) {
        progreso[r.id] = { estado: "desbloqueado" };
      } else {
        progreso[r.id] = { estado: "bloqueado" };
      }
    });
    renderMalla();
  };

  renderMalla();
});
