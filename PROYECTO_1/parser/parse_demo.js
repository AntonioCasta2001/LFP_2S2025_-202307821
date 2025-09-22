// Ejemplo base para implementar el análisis léxico de torneos

// Estados principales del autómata:
// estado 0: inicio o esperando nuevo token
// estado 1: leyendo cadena ("texto")
// estado 2: leyendo identificador o palabra clave
// estado 3: leyendo número



// Token.js
class Token {
  constructor(tipo, valor, linea, columna) {
    this.tipo = tipo;
    this.valor = valor;
    this.linea = linea;
    this.columna = columna;
  }
}

// Palabras clave y símbolos
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
  VS: 'VS'
};

const simbolos = ['{', '}', '[', ']', ':', ','];

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

class imprimirTokens {
  static imprimir(lista_tokens) {
    console.log('--- TOKENS RECONOCIDOS ---');
    lista_tokens.forEach(token => {
      console.log(`Tipo: ${token.tipo}, Valor: "${token.valor}", Posición: Línea ${token.linea}, Columna ${token.columna}`);
    });
  }
}
class AnalizadorLexicoTorneos {
  constructor() {
    this.palabras_clave = palabras_clave;
    this.simbolos = simbolos;
    this.listaTokens = [];
    this.listaError = [];
  }

  analizar(entrada) {
    let estado = 0;
    let buffer = '';
    let index = 0;
    let linea = 1;
    let columna = 1;

    while (index < entrada.length) {
      const char = entrada[index];

      if (char === '\n') {
        linea++;
        columna = 0;
      }

      if (estado === 0) {
        if (this.simbolos.includes(char)) {
          this.listaTokens.push(new Token('simbolo', char, linea, columna));
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
          this.listaError.push({ mensaje: `Carácter inesperado '${char}'`, linea, columna });
        }
      }

      else if (estado === 1) {
        if (char !== '"') {
          buffer += char;
        } else {
          this.listaTokens.push(new Token('cadena', buffer, linea, columna));
          estado = 0;
        }
      }

      else if (estado === 2) {
        if (/[a-zA-Z0-9]/.test(char)) {
          buffer += char;
        } else {
          const palabra = buffer.toUpperCase();
          if (this.palabras_clave[palabra]) {
            this.listaTokens.push(new Token('palabra_clave', palabra, linea, columna));
          } else {
            this.listaTokens.push(new Token('identificador', buffer, linea, columna));
          }
          estado = 0;
          continue;
        }
      }

      else if (estado === 3) {
        if (/\d/.test(char)) {
          buffer += char;
        } else {
          this.listaTokens.push(new Token('numero', buffer, linea, columna));
          estado = 0;
          continue;
        }
      }

      index++;
      columna++;
    }

    if (estado === 2) {
      const palabra = buffer.toUpperCase();
      if (this.palabras_clave[palabra]) {
        this.listaTokens.push(new Token('palabra_clave', palabra, linea, columna));
      } else {
        this.listaTokens.push(new Token('identificador', buffer, linea, columna));
      }
    }

    if (estado === 3) {
      this.listaTokens.push(new Token('numero', buffer, linea, columna));
    }
  }

  imprimirTokens() {
    imprimirTokens.imprimir(this.listaTokens);
  }

  imprimirErrores() {
    const gestor = new imprimirErrores();
    this.listaError.forEach(e => gestor.agregarError(e.mensaje, e.linea, e.columna));
    gestor.imprimirErrores();
  }
}

export default { AnalizadorLexicoTorneos, imprimirErrores, imprimirTokens };

