// Ejemplo base para implementar el análisis léxico de torneos

// Estados principales del autómata:
// estado 0: inicio o esperando nuevo token
// estado 1: leyendo cadena ("texto")
// estado 2: leyendo identificador o palabra clave
// estado 3: leyendo número


class Token {
  constructor(tipo, valor, linea, columna) {
    this.tipo = tipo;
    this.valor = valor;
    this.linea = linea;
    this.columna = columna;
  }
}

// Algunas palabras clave de ejemplo:
const palabras_clave = {
  TORNEO: 'TORNEO',
  EQUIPOS: 'EQUIPOS',
  EQUIPO: 'EQUIPO',
  JUGADOR: 'JUGADOR',
  POSICION: 'POSICION',
  NUMERO: 'NUMERO',
  EDAD: 'EDAD',
  ELIMINACION: 'ELIMINACION',
  CUARTOS: 'CUARTOS',
  OCTAVOS: 'OCTAVOS',
  PARTIDO: 'PARTIDO',
  RESULTADO: 'RESULTADO',
  GOLEADORES: 'GOLEADORES',
  GOLEADOR: 'GOLEADOR',
  MINUTO: 'MINUTO',
  FINAL: 'FINAL',
  VS: 'VS',
  PARTIDO: 'PARTIDO'
};

// Algunos símbolos reconocidos:
const simbolos = ['{', '}', '[', ']', ':', ','];

class AnalizadorLexicoTorneos {
  constructor() {
    this.palabras_clave = {
      TORNEO: 'TORNEO',
      EQUIPOS: 'EQUIPOS',
      EQUIPO: 'EQUIPO',
      JUGADOR: 'JUGADOR',
      POSICION: 'POSICION',
      NUMERO: 'NUMERO',
      EDAD: 'EDAD',
      ELIMINACION: 'ELIMINACION',
      CUARTOS: 'CUARTOS',
      OCTAVOS: 'OCTAVOS',
      PARTIDO: 'PARTIDO',
      RESULTADO: 'RESULTADO',
      GOLEADORES: 'GOLEADORES',
      GOLEADOR: 'GOLEADOR',
      MINUTO: 'MINUTO',
      FINAL: 'FINAL',
      VS: 'VS',
      PARTIDO: 'PARTIDO'
    };

    this.simbolos = ['{', '}', '[', ']', ':', ','];
    this.gestorErrores = gestorErrores;
  }

  analizar(entrada) {
    let estado = 0;
    let buffer = '';
    let index = 0;
    let lista_tokens = [];

    while (index < entrada.length) {
      const char = entrada[index];

      if (estado === 0) {
        if (this.simbolos.includes(char)) {
          lista_tokens.push(new Token('simbolo', char, index));
        } else if (char === '"') {
          buffer = '';
          estado = 1;
        } else if (/[a-zA-Z_]/.test(char)) {
          buffer = char;
          estado = 2;
        } else if (/\d/.test(char)) {
          buffer = char;
          estado = 3;
        } else if (/\s/.test(char)) {
          // Ignorar espacios
        } else {
          this.gestorErrores.agregarError(`Carácter inesperado '${char}'`, 1, index);
        }
      }

      else if (estado === 1) {
        if (char !== '"') {
          buffer += char;
        } else {
          lista_tokens.push(new Token('cadena', buffer, index));
          estado = 0;
        }
      }

      else if (estado === 2) {
        if (/[a-zA-Z0-9]/.test(char)) {
          buffer += char;
        } else {
          const palabra = buffer.toUpperCase();
          if (this.palabras_clave[palabra]) {
            lista_tokens.push(new Token('palabra_clave', palabra, index));
          } else {
            lista_tokens.push(new Token('identificador', buffer, index));
          }
          estado = 0;
          continue;
        }
      }

      else if (estado === 3) {
        if (/\d/.test(char)) {
          buffer += char;
        } else {
          lista_tokens.push(new Token('numero', buffer, index));
          estado = 0;
          continue;
        }
      }

      index++;
    }

    // Finalizar buffers si quedaron abiertos
    if (estado === 2) {
      const palabra = buffer.toUpperCase();
      if (this.palabras_clave[palabra]) {
        lista_tokens.push(new Token('palabra_clave', palabra, index));
      } else {
        lista_tokens.push(new Token('identificador', buffer, index));
      }
    }

    if (estado === 3) {
      lista_tokens.push(new Token('numero', buffer, index));
    }

    return lista_tokens;
  }
}
class imprimirTokens {
  static imprimir(lista_tokens) {
    console.log('--- TOKENS RECONOCIDOS ---');
    lista_tokens.forEach(token => {
      console.log(`Tipo: ${token.tipo}, Valor: "${token.valor}", Posición: Línea ${token.linea}, Columna ${token.columna}`);
    });
  }
}

class imprimirErrores {
  constructor() {
    this.errores = [];
  }

  agregarError(mensaje, linea, columna) {
    this.errores.push({ mensaje, linea, columna });
  }

  imprimirErrores() {
    if (this.errores.length === 0) {
      console.log('No se encontraron errores léxicos.');
      return;
    }

    console.log('--- ERRORES LÉXICOS ---');
    this.errores.forEach(error => {
      console.log(`Error: ${error.mensaje} en Línea ${error.linea}, Columna ${error.columna}`);
    });
  }
}

const entrada = `
TORNEO: "Champions League",
EQUIPOS: [RealMadrid, Barcelona, Juventus],
PARTIDO: { VS: RealMadrid-Juventus, MINUTO: 90, RESULTADO: "2-1" },
$ErrorSimbolo
`;

const gestorErrores = new imprimirErrores();
const analizador = new AnalizadorLexicoTorneos(gestorErrores);
const tokens = analizador.analizar(entrada);

imprimirTokens.imprimir(tokens);
gestorErrores.imprimirErrores();
