var readline = require('readline-sync');
/**
 * Token Types
 *
 * EOF (end-of-file) token is used to indicate that
 * there is no more input left for Lexical analysis
 */
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Integer"] = 0] = "Integer";
    TokenType[TokenType["Plus"] = 1] = "Plus";
    TokenType[TokenType["EOF"] = 2] = "EOF";
})(TokenType || (TokenType = {}));
var Token = (function () {
    function Token(type, value) {
        this.type = type;
        this.value = value;
    }
    Token.prototype.toString = function () {
        "String representation of the class instance.\n    Examples:\n      Token(TokenType.Integer, 3)\n      Token(TokenType.Plus, '+')\n    ";
        return "Token(" + TokenType[this.type] + ", " + this.value + ")";
    };
    return Token;
}());
var Interpreter = (function () {
    function Interpreter(text) {
        this.pos = 0;
        this.currentToken = null;
        this.text = text;
    }
    Interpreter.prototype.error = function () { throw new Error('Error parsing input'); };
    Interpreter.prototype.getNextToken = function () {
        "Lexical analyzer (also known as scanner or tokenizer)\n    This methos is responsible for breaking a sentence apart into tokens.\n    One token at a time.\n    ";
        // is the pos index past the end of the text?
        // if so, then return EOF token because there is no more
        // input left to convert into tokens
        var text = this.text;
        if (this.pos > text.length - 1) {
            return new Token(TokenType.EOF, null);
        }
        // Get a character at the position pos and decide
        // what token to create based on the single character
        var currentChar = text[this.pos];
        // if the character is a digit then convert it to
        // integer, create an Integer token, increment pos
        // index to point to the next character after the digit,
        // and return the Integer token.
        if ('0123456789'.indexOf(currentChar) > -1) {
            var token = new Token(TokenType.Integer, parseInt(currentChar));
            this.pos += 1;
            return token;
        }
        if (currentChar === '+') {
            var token = new Token(TokenType.Plus, currentChar);
            this.pos += 1;
            return token;
        }
        this.error();
    };
    Interpreter.prototype.eat = function (type) {
        // Compare the current token type with the passed token type
        // and if they match then "eat" the current token
        // and assign the next token to the currentToken,
        // otherwise raise an exception.
        if (this.currentToken.type === type) {
            this.currentToken = this.getNextToken();
        }
        else {
            this.error();
        }
    };
    Interpreter.prototype.expr = function () {
        "expr -> Integer Plus Integer";
        // set the current token to the first token taken form the input
        this.currentToken = this.getNextToken();
        // we expect the current token to be a single-digit integer
        var left = this.currentToken;
        this.eat(TokenType.Integer);
        // we expect the current token to be a '+' token
        var op = this.currentToken;
        this.eat(TokenType.Plus);
        // we expect the current token to be a single-digit integer
        var right = this.currentToken;
        this.eat(TokenType.Integer);
        // after the above call the currentToken is set to
        // EOF token
        // at this point Integer Plus Integer of tokens
        // has been successfully found and the method can just
        // return the result of  adding two integers, thus
        // effectively interpreting client input
        var result = left.value + right.value;
        return result;
    };
    Interpreter.main = function () {
        while (true) {
            var text = readline.question('calc> ');
            if (text === 'exit') {
                break;
            }
            var interpreter = new Interpreter(text);
            console.log(interpreter.expr());
        }
    };
    return Interpreter;
}());
Interpreter.main();
//# sourceMappingURL=calc1.js.map