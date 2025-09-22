function generarReporte(tokens) {
  const equipos = {};
  const jugadores = {};
  const partidos = [];

  // Extraer datos desde los tokens
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.tipo === 'cadena' && tokens[i - 1]?.valor === 'equipo') {
      const nombreEquipo = token.valor;
      equipos[nombreEquipo] = { nombre: nombreEquipo, goles: 0, puntos: 0 };
    }

    if (token.tipo === 'cadena' && tokens[i - 1]?.valor === 'jugador') {
      const nombreJugador = token.valor;
      jugadores[nombreJugador] = { nombre: nombreJugador, goles: 0 };
    }

    if (token.valor === 'resultado') {
      const resultado = tokens[i + 1]?.valor;
      const [goles1, goles2] = resultado.split('-').map(Number);
      const equipo1 = tokens[i - 5]?.valor;
      const equipo2 = tokens[i - 3]?.valor;

      partidos.push({ equipo1, equipo2, goles1, goles2 });

      // Asignar puntos
      if (goles1 > goles2) equipos[equipo1].puntos += 3;
      else if (goles1 < goles2) equipos[equipo2].puntos += 3;
      else {
        equipos[equipo1].puntos += 1;
        equipos[equipo2].puntos += 1;
      }

      equipos[equipo1].goles += goles1;
      equipos[equipo2].goles += goles2;
    }

    if (token.valor === 'goleadores') {
      let j = i + 2;
      while (tokens[j]?.valor !== ']') {
        const nombre = tokens[j]?.valor;
        if (jugadores[nombre]) jugadores[nombre].goles += 1;
        j += 2;
      }
    }
  }

  // Generar HTML
  const htmlPosiciones = generarTablaPosiciones(equipos);
  const htmlJugadores = generarTablaJugadores(jugadores);
  const htmlEquipos = generarTablaEquipos(equipos);

  document.getElementById('reportePosiciones').innerHTML = htmlPosiciones;
  document.getElementById('reporteJugadores').innerHTML = htmlJugadores;
  document.getElementById('reporteEquipos').innerHTML = htmlEquipos;
}

function generarTablaPosiciones(equipos) {
  const ordenados = Object.values(equipos).sort((a, b) => b.puntos - a.puntos);
  let html = `<table><tr><th>Equipo</th><th>Puntos</th><th>Goles</th></tr>`;
  ordenados.forEach(e => {
    html += `<tr><td>${e.nombre}</td><td>${e.puntos}</td><td>${e.goles}</td></tr>`;
  });
  html += `</table>`;
  return html;
}

function generarTablaJugadores(jugadores) {
  const ordenados = Object.values(jugadores).sort((a, b) => b.goles - a.goles);
  let html = `<table><tr><th>Jugador</th><th>Goles</th></tr>`;
  ordenados.forEach(j => {
    html += `<tr><td>${j.nombre}</td><td>${j.goles}</td></tr>`;
  });
  html += `</table>`;
  return html;
}

function generarTablaEquipos(equipos) {
  let html = `<table><tr><th>Equipo</th><th>Goles Totales</th></tr>`;
  Object.values(equipos).forEach(e => {
    html += `<tr><td>${e.nombre}</td><td>${e.goles}</td></tr>`;
  });
  html += `</table>`;
  return html;
}
