/* analizador java
*/

class Token {
    constructor(tipo, lexema, linea, columna) {
        this.tipo = tipo;
        this.lexema = lexema;
        this.linea = linea;
        this.columna = columna;
    }
}

class Error {
    constructor(tipo, lexema, linea, columna) {
        this.tipo = tipo;
        this.lexema = lexema;
        this.linea = linea;
        this.columna = columna;
    }
}
export class AnalizadorLexico {
    constructor() {
        (this.listaTokens = []), (this.listaError = []);
    }

    palabrasReservadas(buffer) {
        const palabras_clave = {
            "public": "PUBLIC",
            "class": "CLASS",
            "static": "STATIC",            
            "void": "VOID",            
            "main": "MAIN",
            "string": "STRING",
            "args": "ARGS",
            "int": "INT",
            "double": "DOUBLE",
            "char": "CHAR",
            "boolean": "BOOLEAN",
            "true": "TRUE",
            "false": "FALSE",
            "if": "IF",
            "else": "ELSE",
            "while": "WHILE",
            "for": "FOR",
            "return": "RETURN",
            "system": "SYSTEM",
            "out": "OUT",
            "println": "PRINTLN"
        };
        return palabras_clave[buffer];
    }
    identificadores(char) {
        const code = char.charCodeAt(0);
        return (
            (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || "áéíóúÁÉÍÓÚñÑ".includes(char)
        );
    }

    esDigito(c) {
        const code = c.charCodeAt(0);
        return code >= 48 && code <= 57;     // 0-9
    }
    operadores(char) {
        const ops = ["+", "-", "*", "/", "=", "==", "!=", "<", ">", "<=", ">=", "++","--"];
        return ops.includes(char);
    }
    esSimbolo(char) {
        const simbolos = ["{","}","(", ")", "[","]"]
        return simbolos.includes(char);
    }
    esEspacio(char) {
        return /[ \t\n\r]/.test(char);
    }
    analizar(entrada) {
        this.listaTokens = [];
        this.listaError = [];
        let buffer = "";
        const centinela = "#";
        entrada += centinela;
        let linea = 1;
        let columna = 1;
        let estado = 0;
        let index = 0;

        while (index < entrada.length) {
            const char = entrada[index];

            if (estado === 0) {
                if (char === "{") {
                    columna += 1;
                    this.listaTokens.push(new Token("LLAVE_ABRE", char, linea, columna));
                } else if (char === "}") {
                    columna += 1;
                    this.listaTokens.push(
                        new Token("LLAVE_CIERRA", char, linea, columna)
                    );
                } else if (char === "[") {
                    columna += 1;
                    this.listaTokens.push(
                        new Token("CORCHETE_ABRE", char, linea, columna)
                    );
                } else if (char === "]") {
                    columna += 1;
                    this.listaTokens.push(
                        new Token("CORCHETE_CIERRA", char, linea, columna)
                    );
                } else if (char === ":") {
                    columna += 1;
                    this.listaTokens.push(new Token("DOSPUNTOS", char, linea, columna));
                } else if (char === ",") {
                    columna += 1;
                    this.listaTokens.push(new Token("COMA", char, linea, columna));
                } else if (char === '"') {
                    columna += 1;
                    buffer = '"';
                    estado = 1; // reading string
                } else if (this.identificadores(char)) {
                    columna += 1;
                    buffer = char;
                    estado = 2; // reading identifier
                } else if (this.esDigito(char)) {
                    columna += 1;
                    buffer = char;
                    estado = 3; // reading number
                } else if (this.esEspacio(char)) {
                    if (char === "\t") columna += 4;
                    else if (char === " ") columna += 1;
                    else if (char === "\n") {
                        linea += 1;
                        columna = 1;
                    }
                } else if (char === "#") {
                    console.log("Análisis del archivo completado exitosamente");
                    this.listaTokens.push(new Token("CENTINELA", char, linea, columna));
                    break;
                } else {
                    columna += 1;
                    this.listaError.push(
                        new Error("Error Léxico", char, linea, columna)
                    );
                }
            } else if (estado === 1) {
                // inside string
                if (char === '"') {
                    columna += 1;
                    buffer += '"';
                    this.listaTokens.push(new Token("CADENA", buffer, linea, columna));
                    buffer = "";
                    estado = 0;
                } else if (char === "\n") {
                    this.listaError.push(
                        new Error(
                            "Error Léxico: Cadena no cerrada",
                            buffer,
                            linea,
                            columna
                        )
                    );
                    buffer = "";
                    linea += 1;
                    columna = 1;
                    estado = 0;
                } else {
                    columna += 1;
                    buffer += char;
                }
            } else if (estado === 2) {
                if (this.identificadores(char) || this.esDigito(char)) {
                    columna += 1;
                    buffer += char;
                } else {
                    const tipo_token = this.palabrasReservadas(buffer);
                    if (tipo_token) {
                        this.listaTokens.push(
                            new Token(tipo_token, buffer, linea, columna)
                        );
                    } else {
                        this.listaTokens.push(
                            new Token("IDENTIFICADOR", buffer, linea, columna)
                        );
                    }
                    buffer = "";
                    estado = 0;
                    index -= 1;
                }
            } else if (estado === 3) {
                if (this.esDigito(char)) {
                    columna += 1;
                    buffer += char;
                } else {
                    this.listaTokens.push(new Token("ENTERO", buffer, linea, columna));
                    buffer = "";
                    estado = 0;
                    index -= 1;
                }
            }

            index += 1;
        }

        // final buffer
        if (buffer && estado !== 0) {
            if (estado === 1) {
                this.listaError.push(
                    new LexError(
                        "Error Léxico: Cadena no cerrada",
                        buffer,
                        linea,
                        columna
                    )
                );
            } else if (estado === 2) {
                const tipo_token = this.palabrasReservadas(buffer);
                if (tipo_token)
                    this.listaTokens.push(new Token(tipo_token, buffer, linea, columna));
                else
                    this.listaTokens.push(
                        new Token("IDENTIFICADOR", buffer, linea, columna)
                    );
            } else if (estado === 3) {
                this.listaTokens.push(new Token("ENTERO", buffer, linea, columna));
            }
        }
    }
    imprimirTokens() {
        console.log("\n=== TOKENS ENCONTRADOS ===");
        this.listaTokens.forEach((token, i) => {
            console.log(
                `${i + 1}. Tipo: ${token.tipo}, Lexema: '${token.lexema}', Línea: ${token.linea
                }, Columna: ${token.columna}`
            );
        });
    }
    imprimirErrores() {
        if (this.listError.length) {
            console.log("===ERRORES LEXICOS====");
            this.listError.forEach((err, i) => {
                console.log(
                    `${i + 1}, ${err.tipo}: '${err.lexema}', Linea: ${err.linea
                    }, Columna: ${err.columna}`
                );
            });
        } else {
            console.log("\nNo se encontraron errores");
        }
    }
}


const scanner = new AnalizadorLexico();

let entrada = ` public class main{
    public static void main(String args){
        "int" "x" = 2;
        "int" "y" = 4;
    }
}
`;
let analis = scanner.analizar(entrada);

scanner.imprimirTokens();
scanner.imprimirErrores;


/*class Parser {
    constructor() {
        (this.listaTokens = []).at(this.listError = []);

    }
    parse() {
        console.log("Parseando...");
        this.listaTokens.forEach((token) => {
            console.log(`porcesando token: ${token.tipo} ('${token.lexema}')`);
            switch (token.tipo) {
                case "public":
                    console.log("Estructura de main reconocida.");
                    break;
                case "class":
                    break
                default:
                    break;
            }
            console.log("Parseo finalizado");

        });
    }
}*/

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = 0;
        this.errors = [];
    }

    tokenActual() {
        return this.tokens[this.index];
    }

    avanzar() {
        this.index++;
    }

    coincidir(tipoEsperado) {
        const token = this.tokenActual();
        if (token && token.tipo === tipoEsperado) {
            this.avanzar();
            return true;
        } else {
            this.errors.push(`Se esperaba '${tipoEsperado}' en línea ${token?.linea}`);
            return false;
        }
    }

    parse() {
        while (this.index < this.tokens.length) {
            this.instruccion();
        }
        return this.errors;
    }
    instruccion() {
        const token = this.tokenActual(); // ← primero declaramos

        if (!token) return;

        if (token.tipo === "PUBLIC") {
            this.funcion();
            return;
        }

        if (["INT", "FLOAT", "BOOLEAN"].includes(token.tipo)) {
            this.declaracion();
        } else if (token.tipo === "IDENTIFICADOR") {
            this.asignacion();
        } else if (token.tipo === "IF") {
            this.ifStatement();
        } else if (token.tipo === "WHILE") {
            this.whileStatement();
        } else if (token.tipo === "SYM" && token.lexema === "{") {
            this.bloque();
        } else {
            this.errors.push(`Instrucción inválida en línea ${token.linea}`);
            this.avanzar();
        }
    }
    declaracion() {
        this.avanzar(); // tipo
        if (!this.coincidir("ID")) return;
        if (this.tokenActual()?.lexema === "=") {
            this.avanzar();
            this.expresion();
        }
        this.coincidir("SYM"); // ;
    }
    asignacion() {
        this.avanzar(); // ID
        if (!this.coincidir("OP")) return;
        this.expresion();
        this.coincidir("SYM"); // ;
    }
    expresion() {
        this.termino();
        while (["+", "-", "*", "/"].includes(this.tokenActual()?.lexema)) {
            this.avanzar();
            this.termino();
        }
    }

    termino() {
        const token = this.tokenActual();
        if (["INT", "FLOAT", "ID"].includes(token?.tipo)) {
            this.avanzar();
        } else {
            this.errors.push(`Expresión inválida en línea ${token?.linea}`);
            this.avanzar();
        }
    }
    ifStatement() {
        this.avanzar(); // if
        this.coincidir("SYM"); // (
        this.expresion();
        this.coincidir("SYM"); // )
        this.instruccion(); // cuerpo
    }
    bloque() {
        this.coincidir("SYM"); // {
        while (this.tokenActual()?.lexema !== "}") {
            this.instruccion();
        }
        this.coincidir("SYM"); // }
    }
    funcion() {
        // public static void
        this.coincidir("PUBLIC");
        this.coincidir("STATIC");
        this.coincidir("VOID");

        // nombre de la función
        if (!this.coincidir("IDENTIFICADOR")) return;

        // parámetros
        this.coincidirSimbolo("(");
        if (this.tokenActual()?.tipo === "IDENTIFICADOR") {
            this.avanzar(); // args
        }
        this.coincidirSimbolo(")");

        // cuerpo
        this.bloque();
    }
}
const codigoFuente = `
int x = 5;
x = x + 1;
if (x > 0) {
    x = x - 1;
}
`;
const analizador = new AnalizadorLexico();
analizador.analizar(entrada); // donde codigoFuente es un string con el código Java

if (analizador.listaError.length === 0) {
    const parser = new Parser(analizador.listaTokens);
    const erroresSintacticos = parser.parse();

    if (erroresSintacticos.length === 0) {
        console.log("✅ Análisis sintáctico exitoso.");
    } else {
        console.log("❌ Errores sintácticos:");
        erroresSintacticos.forEach((e, i) => console.log(`${i + 1}. ${e}`));
    }
} else {
    console.log("❌ Errores léxicos:");
    analizador.listaError.forEach((err, i) =>
        console.log(`${i + 1}. ${err.tipo} → '${err.lexema}' en línea ${err.linea}, columna ${err.columna}`)
    );
}

/* traductor */

class Traductor {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = 0;
        this.codigoPython = "";
        this.indentacion = 0;
    }
    
    declaracion() {
        this.avanzar(); // tipo
        const nombre = this.tokenActual()?.lexema;
        this.avanzar(); // identificador

        let valor = "None";
        if (this.tokenActual()?.lexema === "=") {
            this.avanzar();
            valor = this.expresion();
        }

        this.avanzar(); // ;
        this.escribir(`${nombre} = ${valor}`);
    };

    asignacion() {
        const nombre = this.tokenActual()?.lexema;
        this.avanzar(); // identificador
        this.avanzar(); // =
        const valor = this.expresion();
        this.avanzar(); // ;
        this.escribir(`${nombre} = ${valor}`);
    }
    expresion() {
        let resultado = "";
        while (this.tokenActual() && this.tokenActual().tipo !== "SYM") {
            resultado += this.tokenActual().lexema + " ";
            this.avanzar();
        }
        return resultado.trim();
    }
    whileStatement() {
        this.avanzar(); // while
        this.avanzar(); // (
        const condicion = this.expresion();
        this.avanzar(); // )
        this.escribir(`while ${condicion}:`);
        this.bloque();
    }
    bloque() {
        this.avanzar(); // {
        this.indentacion++;
        while (this.tokenActual()?.lexema !== "}") {
            this.instruccion();
        }
        this.indentacion--;
        this.avanzar(); // }
    }
    instruccion() {
        const token = this.tokenActual();
        if (!token) return;

        if (["INT", "FLOAT", "BOOLEAN"].includes(token.tipo)) {
            this.declaracion();
        } else if (token.tipo === "IDENTIFICADOR") {
            this.asignacion();
        } else if (token.tipo === "IF") {
            this.ifStatement();
        } else if (token.tipo === "WHILE") {
            this.whileStatement();
        } else if (token.tipo === "SYM" && token.lexema === "{") {
            this.bloque();
        } else {
            this.avanzar(); // ignorar token no traducible
        }
    }
    traducir() {
        while (this.index < this.tokens.length) {
            this.instruccion();
        }
        return this.codigoPython;
    }

    tokenActual() {
        return this.tokens[this.index];
    }

    avanzar() {
        this.index++;
    }

    escribir(linea) {
        this.codigoPython += "    ".repeat(this.indentacion) + linea + "\n";
    }
}


class variables {

}
const traductor = new Traductor(analizador.listaTokens);
const codigoPython = traductor.traducir();
console.log("Código Python generado:\n", codigoPython);