// Documentos disponibles
const documentos = [
  {
    nombre: 'Diagrama de Actividades',
    archivo: 'Documentos/Diagrama-actividades.pdf'
  },
  {
    nombre: 'Fichas de Caso de Uso',
    archivo: 'Documentos/Fichas-caso-de-uso.pdf'
  },
  {
    nombre: 'IEE 830 Interagro',
    archivo: 'Documentos/IEE 830 Interagro.pdf'
  },
  {
    nombre: 'Product Backlog',
    archivo: 'Documentos/Product-blackog.pdf'
  }
];

let actual = 0;

function mostrarDocumento(idx) {
  const doc = documentos[idx];
  const card = document.getElementById('docu-card');
  card.innerHTML = `
    <div class="docu-pdf-icon">📄</div>
    <div class="docu-name">${doc.nombre}</div>
    <button class="docu-open" onclick="window.open('${doc.archivo}', '_blank')">Abrir documento</button>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarDocumento(actual);
  document.getElementById('docu-prev').addEventListener('click', () => {
    actual = (actual - 1 + documentos.length) % documentos.length;
    mostrarDocumento(actual);
  });
  document.getElementById('docu-next').addEventListener('click', () => {
    actual = (actual + 1) % documentos.length;
    mostrarDocumento(actual);
  });
});
