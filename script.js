document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("malla-container");
  const contadorRamos = document.getElementById("contador-ramos");
  const totalRamosSpan = document.getElementById("total-ramos");
  const contadorCreditos = document.getElementById("contador-creditos");
  const resetBtn = document.getElementById("reset");

  const ramos = [/* ... todos los ramos definidos correctamente ... */];

  const ramosMap = Object.fromEntries(ramos.map(r => [r.id, r]));
  let progreso = JSON.parse(localStorage.getItem("mallaProgreso")) || {};

  function semestreAprobado(semestre) {
    const ramosDelSemestre = ramos.filter(r => r.semestre === semestre);
    return ramosDelSemestre.every(r => progreso[r.id]?.estado === "aprobado");
  }

  function actualizarDesbloqueo() {
    ramos.forEach(r => {
      const estadoActual = progreso[r.id]?.estado || "bloqueado";
      if (estadoActual === "aprobado") return;

      const semestreAnterior = r.semestre - 1;
      const anteriorAprobado = semestreAnterior === 0 || semestreAprobado(semestreAnterior);

      const cumplePrerreq = r.prereqs.length === 0 || r.prereqs.every(pr => progreso[pr]?.estado === "aprobado");

      const nuevoEstado = (anteriorAprobado && cumplePrerreq) ? "desbloqueado" : "bloqueado";
      progreso[r.id] = { ...progreso[r.id], estado: nuevoEstado };
    });
  }

  function renderMalla() {
    actualizarDesbloqueo();
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
    guardarProgreso();
  }

  function desmarcarAprobado(id) {
    progreso[id] = { estado: "desbloqueado" };
    bloquearDependientes(id);
    guardarProgreso();
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
      progreso[r.id] = { estado: r.semestre === 1 ? "desbloqueado" : "bloqueado" };
    });
    renderMalla();
  };

  resetBtn.click();
});
