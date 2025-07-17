document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("malla-container");
  const contadorRamos = document.getElementById("contador-ramos");
  const totalRamosSpan = document.getElementById("total-ramos");
  const contadorCreditos = document.getElementById("contador-creditos");
  const resetBtn = document.getElementById("reset");

  // Malla completa con todos los semestres (1 al 12)
  const ramos = [
    // Semestre 1
    { id: "bio_cel", nombre: "Biología Celular y Genética", creditos: 6, semestre: 1, prereqs: [] },
    { id: "histologia", nombre: "Histología General", creditos: 6, semestre: 1, prereqs: [] },
    { id: "fisica1", nombre: "Procesos Físicos I", creditos: 6, semestre: 1, prereqs: [] },
    { id: "quimica1", nombre: "Procesos Químicos I", creditos: 6, semestre: 1, prereqs: [] },
    { id: "anatomia1", nombre: "Bases Anatómicas", creditos: 6, semestre: 1, prereqs: [] },
    { id: "ingles1", nombre: "Inglés I", creditos: 4, semestre: 1, prereqs: [] },

    // Semestre 2
    { id: "microbio", nombre: "Microbiología", creditos: 6, semestre: 2, prereqs: ["bio_cel"] },
    { id: "histologia_oral", nombre: "Histología Oral", creditos: 5, semestre: 2, prereqs: ["histologia"] },
    { id: "fisica2", nombre: "Procesos Físicos II", creditos: 6, semestre: 2, prereqs: ["fisica1"] },
    { id: "quimica2", nombre: "Procesos Químicos II", creditos: 6, semestre: 2, prereqs: ["quimica1"] },
    { id: "anatomia2", nombre: "Anatomía de Cara y Cuello", creditos: 6, semestre: 2, prereqs: ["anatomia1"] },
    { id: "ingles2", nombre: "Inglés II", creditos: 4, semestre: 2, prereqs: ["ingles1"] },

    // Semestre 3
    { id: "bioquimica1", nombre: "Bioquímica I", creditos: 6, semestre: 3, prereqs: ["quimica2"] },
    { id: "fisio1", nombre: "Fisiología I", creditos: 6, semestre: 3, prereqs: ["fisica2"] },
    { id: "semiologia", nombre: "Semiología Clínica", creditos: 6, semestre: 3, prereqs: ["histologia_oral"] },
    { id: "psicologia", nombre: "Psicología", creditos: 4, semestre: 3, prereqs: [] },
    { id: "ingles3", nombre: "Inglés III", creditos: 4, semestre: 3, prereqs: ["ingles2"] },

    // Semestre 4
    { id: "bioquimica2", nombre: "Bioquímica II", creditos: 6, semestre: 4, prereqs: ["bioquimica1"] },
    { id: "fisio2", nombre: "Fisiología II", creditos: 6, semestre: 4, prereqs: ["fisio1"] },
    { id: "odontopediatria1", nombre: "Odontopediatría I", creditos: 6, semestre: 4, prereqs: ["semiologia"] },
    { id: "preclinico1", nombre: "Preclínico Integral I", creditos: 8, semestre: 4, prereqs: ["semiologia"] },
    { id: "ingles4", nombre: "Inglés IV", creditos: 4, semestre: 4, prereqs: ["ingles3"] },

    // Semestre 5
    { id: "patologia1", nombre: "Patología I", creditos: 6, semestre: 5, prereqs: ["bioquimica2"] },
    { id: "farmacologia", nombre: "Farmacología", creditos: 6, semestre: 5, prereqs: ["fisio2"] },
    { id: "odontopediatria2", nombre: "Odontopediatría II", creditos: 6, semestre: 5, prereqs: ["odontopediatria1"] },
    { id: "preclinico2", nombre: "Preclínico Integral II", creditos: 8, semestre: 5, prereqs: ["preclinico1"] },

    // Semestre 6
    { id: "patologia2", nombre: "Patología II", creditos: 6, semestre: 6, prereqs: ["patologia1"] },
    { id: "radiologia", nombre: "Radiología", creditos: 6, semestre: 6, prereqs: ["anatomia2"] },
    { id: "clinica1", nombre: "Clínica Integral I", creditos: 10, semestre: 6, prereqs: ["preclinico2"] },

    // Semestre 7
    { id: "clinica2", nombre: "Clínica Integral II", creditos: 10, semestre: 7, prereqs: ["clinica1"] },
    { id: "rehabilitacion1", nombre: "Rehabilitación Oral I", creditos: 6, semestre: 7, prereqs: ["clinica1"] },

    // Semestre 8
    { id: "clinica3", nombre: "Clínica Integral III", creditos: 10, semestre: 8, prereqs: ["clinica2"] },
    { id: "rehabilitacion2", nombre: "Rehabilitación Oral II", creditos: 6, semestre: 8, prereqs: ["rehabilitacion1"] },

    // Semestre 9
    { id: "clinica4", nombre: "Clínica Integral IV", creditos: 10, semestre: 9, prereqs: ["clinica3"] },
    { id: "gestion", nombre: "Gestión en Salud", creditos: 4, semestre: 9, prereqs: [] },
    { id: "electivo1", nombre: "Electivo I", creditos: 4, semestre: 9, prereqs: [] },
    { id: "formacion1", nombre: "Formación General I", creditos: 4, semestre: 9, prereqs: [] },

    // Semestre 10
    { id: "clinica5", nombre: "Clínica Integral V", creditos: 10, semestre: 10, prereqs: ["clinica4"] },
    { id: "electivo2", nombre: "Electivo II", creditos: 4, semestre: 10, prereqs: [] },
    { id: "formacion2", nombre: "Formación General II", creditos: 4, semestre: 10, prereqs: [] },

    // Semestre 11
    { id: "internado1", nombre: "Internado Clínico I", creditos: 14, semestre: 11, prereqs: ["clinica5"] },
    { id: "seminario1", nombre: "Seminario de Investigación I", creditos: 2, semestre: 11, prereqs: [] },

    // Semestre 12
    { id: "internado2", nombre: "Internado Clínico II", creditos: 14, semestre: 12, prereqs: ["internado1"] },
    { id: "seminario2", nombre: "Seminario de Investigación II", creditos: 2, semestre: 12, prereqs: ["seminario1"] },
  ];

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

        div.addEventListener("click", () => {
          const input = div.querySelector("input");
          if (input) input.focus();
        });

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
