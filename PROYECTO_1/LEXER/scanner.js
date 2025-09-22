import {AnalizadorLexicoTorneos, Token, imprimirErrores } from "../parser/parse_demo"

function procesarArchivo() {
  const archivo = document.getElementById('archivoEntrada').files[0];
  if (!archivo) {
    alert('Por favor selecciona un archivo de texto.');
    return;
  }

  const lector = new FileReader();
  lector.onload = function (e) {
    const contenido = e.target.result;

    const impresorErrores = new imprimirErrores();
    const analizador = new AnalizadorLexicoTorneos(impresorErrores);
    const tokens = analizador.analizar(contenido);

    ImpresorTokens.imprimir(tokens);
    impresorErrores.imprimirErrores();

    mostrarTokens(tokens);
    mostrarErrores(impresorErrores.errores);
  };

  lector.readAsText(archivo);
}

function mostrarTokens(tokens) {
  const tabla = document.getElementById('tablaTokens');
  tabla.innerHTML = `
    <tr>
      <th>#</th>
      <th>Tipo</th>
      <th>Valor</th>
      <th>Línea</th>
      <th>Columna</th>
    </tr>
  `;

  tokens.forEach((token, i) => {
    const fila = tabla.insertRow();
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${token.tipo}</td>
      <td>${token.valor}</td>
      <td>${token.linea}</td>
      <td>${token.columna}</td>
    `;
  });
}

function mostrarErrores(errores) {
  const tabla = document.getElementById('tablaErrores');
  tabla.innerHTML = `
    <tr>
      <th>#</th>
      <th>Lexema</th>
      <th>Tipo de Error</th>
      <th>Descripción</th>
      <th>Línea</th>
      <th>Columna</th>
    </tr>
  `;

  errores.forEach((error, i) => {
    const fila = tabla.insertRow();
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${error.lexema || '—'}</td>
      <td>${error.tipo}</td>
      <td>${error.mensaje}</td>
      <td>${error.linea}</td>
      <td>${error.columna}</td>
    `;
  });
}
