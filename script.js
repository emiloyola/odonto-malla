document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("malla-container");
  const contadorRamos = document.getElementById("contador-ramos");
  const totalRamosSpan = document.getElementById("total-ramos");
  const contadorCreditos = document.getElementById("contador-creditos");
  const resetBtn = document.getElementById("reset");

  // [... Aquí va TODO el array "ramos" que ya pegaste antes, no lo repito por espacio ...]

  // Convertir array en diccionario para acceso rápido
  const ramosMap = {};
  ramos.forEach(r => ramosMap[r.id] = r);

  let progreso = JSON.parse(localStorage.getItem("mallaProgreso")) || {};

  ramos.forEach(r => {
    if (r.prereqs.length === 0 && !progreso[r.id]) {
      progreso[r.id] = { estado: "desbloqueado" };
    }
  });

  function renderMalla() {
    container.innerHTML = "";
    let aprobados = 0;
    let creditos = 0;

    // Agrupar ramos por semestre
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

        const estado = progreso[ramo.id]?.estado || "bloqueado";
        div.classList.remove("bloqueado", "desbloqueado", "aprobado");
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
            desmarcarAprobado(ramo.id);
          }
          guardarProgreso();
          renderMalla();
        };

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
      if (r.prereqs.includes(id) && progreso[r.id]?.estado !== "aprobado") {
        const todosAprobados = r.prereqs.every(pre => progreso[pre]?.estado === "aprobado");
        if (todosAprobados) {
          progreso[r.id] = { estado: "desbloqueado" };
        }
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
      if (r.prereqs.length === 0) {
        progreso[r.id] = { estado: "desbloqueado" };
      }
    });
    renderMalla();
  };

  renderMalla();
});
