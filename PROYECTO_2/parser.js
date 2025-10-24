import AnalizadorLexico from "./Analisis.js"

class Parser {
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
        if (token.tipo === "PUBLIC") {
            this.funcion();
        }
        const token = this.tokenActual();
        if (!token) return;

        if (["INT", "FLOAT", "BOOLEAN"].includes(token.tipo)) {
            this.declaracion();
        } else if (token.tipo === "ID") {
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
const parser = new Parser(tokens);
const errores = parser.parse();

