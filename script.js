document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("malla-container");
  const contadorRamos = document.getElementById("contador-ramos");
  const totalRamosSpan = document.getElementById("total-ramos");
  const contadorCreditos = document.getElementById("contador-creditos");
  const resetBtn = document.getElementById("reset");

  const ramos = [
    // aquí va el array completo que ya está definido (semestres 1 al 12)...
  ];

  const ramosMap = {};
  ramos.forEach(r => ramosMap[r.id] = r);

  let progreso = JSON.parse(localStorage.getItem("mallaProgreso")) || {};

  function semestreAprobado(semestre) {
    return ramos.filter(r => r.semestre === semestre).every(r => progreso[r.id]?.estado === "aprobado");
  }

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
      semDiv.innerHTML = `<h2>Semestre ${numSemestre}</h2>`;

      semestres[numSemestre].forEach(ramo => {
        const div = document.createElement("div");
        div.classList.add("ramo");
        div.id = ramo.id;
        div.innerHTML = `<div>${ramo.nombre} (${ramo.creditos} cr.)</div>`;

        let estado = progreso[ramo.id]?.estado || "bloqueado";

        const prereqsCumplidos = ramo.prereqs.every(p => progreso[p]?.estado === "aprobado");
        const semestrePrevioAprobado = ramo.semestre === 1 || semestreAprobado(ramo.semestre - 1);

        if (estado !== "aprobado") {
          if (prereqsCumplidos && semestrePrevioAprobado) {
            estado = "desbloqueado";
            progreso[ramo.id] = progreso[ramo.id] || {};
            progreso[ramo.id].estado = estado;
          } else {
            estado = "bloqueado";
            progreso[ramo.id] = progreso[ramo.id] || {};
            progreso[ramo.id].estado = estado;
          }
        }

        div.classList.remove("bloqueado", "desbloqueado", "aprobado");
        div.classList.add(estado);

        if (estado === "aprobado") {
          aprobados++;
          creditos += ramo.creditos;
          addPromedio(div, progreso[ramo.id]?.promedio || "");
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

        if (estado === "aprobado") {
          addPromedio(div, progreso[ramo.id]?.promedio || "");
        }

        semDiv.appendChild(div);
      });

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
  }

  function desmarcarAprobado(id) {
    progreso[id] = { estado: "bloqueado" };
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
    renderMalla();
  };

  renderMalla();
});
