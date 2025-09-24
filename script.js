// Reemplaza con tu ID de Google Sheet y el nombre de la hoja
const sheetID = "TU_ID_AQUI";
//const sheetName = "4_Science"; // usa el nombre de tu pestaña
const urlJSON = `https://docs.google.com/spreadsheets/d/18MrE2FSIqQQYP5CUrDDbc_RKExfxlXG0TxiuPHNt6iU/gviz/tq?tqx=out:json&sheet=`;

document.getElementById("btnBuscar").addEventListener("click", buscarAlumno);

async function buscarAlumno(sheetName) {
  const codigo = document.getElementById("codigo").value.trim();
  if (!codigo) return alert("Ingresa tu código");

  try {
    const res = await fetch(urlJSON + sheetName);
    let text = await res.text();

    // Limpiar el JSON que devuelve Google
    text = text.substr(47).slice(0, -2);
    const json = JSON.parse(text);

    // Encabezados
    const headers = json.table.cols.map(c => c.label);
    // Filas
    const filas = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));
    const subheader = filas[0];

    // Buscar alumno por código (columna 0)
    const alumno = filas.find(r => r[0] == codigo);
    const cont = document.getElementById("resultado");
    cont.innerHTML = "";

    if (!alumno) {
      cont.innerHTML = "<p>No se encontró el código</p>";
      return;
    }

    // Mostrar resultados
    let total = 0;
    let html = "<h3>Resultados:</h3><ul>";
    for (let i = 1; i < headers.length -1 ; i++) {
      html += `<li><strong>${headers[i]}:</strong> ${alumno[i]} / ${subheader[i]} </li>`;
      total += parseFloat(alumno[i]) || 0;
    }
    html += "</ul>";
    html += `<p><strong>Total Calificacion:</strong> ${total} / 100 </p>`;
    cont.innerHTML = html;

  } catch (e) {
    console.error(e);
    alert("Error cargando los datos");
  }
}
