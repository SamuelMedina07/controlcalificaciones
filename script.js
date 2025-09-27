// ID de tu Google Sheet
const sheetID = "18MrE2FSIqQQYP5CUrDDbc_RKExfxlXG0TxiuPHNt6iU";
const urlJSON = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=`;

// Evento de búsqueda
document.getElementById("btnBuscar").addEventListener("click", () => {
  const sheetName = document.getElementById("clase").value;
  if (!sheetName) {
    alert("Selecciona un grado y clase primero");
    return;
  }
  buscarAlumno(sheetName);
});

async function buscarAlumno(sheetName) {
  const select = document.getElementById("clase");
  const textoSeleccionado = select.options[select.selectedIndex].text;
  const codigo = document.getElementById("codigo").value.trim();
  if (!codigo) return alert("Ingresa tu código");

  try {
    const res = await fetch(urlJSON + sheetName);
    let text = await res.text();
  
    // Google envuelve el JSON, hay que limpiarlo
    text = text.substr(47).slice(0, -2);
    const json = JSON.parse(text);

    // Encabezados
    const headers = json.table.cols.map(c => c.label);
    // Todas las filas
    const filas = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));
    // Subheader = fila 0 (pesos)
    const subheader = filas[0];
    // Buscar alumno desde fila 1 en adelante
    const alumno = filas.find((r, i) => i > 0 && r[0] == codigo);

    const cont = document.getElementById("resultado");
    cont.innerHTML = "";

    if (!alumno) {
      cont.innerHTML = "<p>No se encontró el código</p>";
      return;
    }

    let total = 0;
    let totalPosible = 0;
    let html = `<h3 class="text-2xl text-justify">${alumno[1]} (Código: ${codigo}) para la clase de ${textoSeleccionado}</h3><ul class="space-y-2 text-2xl">`;

    for (let i = 2; i < headers.length; i++) {
      const tarea = headers[i];
      const peso = subheader[i];
      const nota = alumno[i];
      html += `<li>${tarea}: ${nota} / ${peso}</li>`;
      total += parseFloat(nota) || 0;
      totalPosible += parseFloat(peso) || 0;
    }

   html += `</ul>
  <button onclick="limpiar();" class="h-10 px-4 py-2 text-sm text-teal-600 transition duration-150 ease-in-out rounded-full outline-none right-3 top-3 bg-[#ffffff] sm:px-6 sm:text-base sm:font-medium hover:bg-[#efefef] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
    Limpiar Pantalla
  </button>`;

    cont.innerHTML = html;

  } catch (e) {
    console.error(e);
    alert("Error cargando los datos");
  }
}
 function limpiar() {
  document.getElementById('codigo').value = "";
  document.getElementById('clase').value = "";
   const lista = document.getElementById('resultado');
    while (lista.firstChild) {
   lista.removeChild(lista.firstChild);
    }
 }
