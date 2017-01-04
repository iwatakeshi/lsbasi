const readline = require('readline-sync');

/**
 * Token Types
 * 
 * EOF (end-of-file) token is used to indicate that
 * there is no more input left for Lexical analysis
 */
enum TokenType {
  Integer,
  Plus,
  EOF
}

class Token {
  type: TokenType;
  value;
  constructor(type: TokenType, value) {
    this.type = type;
    this.value = value;
  }
  toString(): string {
    /** String representation of the class instance.
    Examples:
      Token(TokenType.Integer, 3)
      Token(TokenType.Plus, '+')
    */
    return `Token(${TokenType[this.type]}, ${this.value})`;
  }
}

class Interpreter {
  text: string;
  pos: number = 0;
  currentToken: Token = null;
  constructor(text: string) { this.text = text; }
  error() { throw new Error('Error parsing input'); }
  getNextToken(): Token {
    /**
    Lexical analyzer (also known as scanner or tokenizer)
    This methos is responsible for breaking a sentence apart into tokens.
    One token at a time.
    */
    

    // is the pos index past the end of the text?
    // if so, then return EOF token because there is no more
    // input left to convert into tokens
    const text = this.text;

    if (this.pos > text.length - 1) {
      return new Token(TokenType.EOF, null);
    }
    // Get a character at the position pos and decide
    // what token to create based on the single character
    const currentChar = text[this.pos];

    // if the character is a digit then convert it to
    // integer, create an Integer token, increment pos
    // index to point to the next character after the digit,
    // and return the Integer token.
    if ('0123456789'.indexOf(currentChar) > -1) {
      let token = new Token(TokenType.Integer, parseInt(currentChar));
      this.pos += 1;
      return token;
    }

    if (currentChar === '+') {
      let token = new Token(TokenType.Plus, currentChar);
      this.pos += 1;
      return token;
    }

    this.error();
  }

  eat(type: TokenType) {
    // Compare the current token type with the passed token type
    // and if they match then "eat" the current token
    // and assign the next token to the currentToken,
    // otherwise raise an exception.
    if (this.currentToken.type === type) {
      this.currentToken = this.getNextToken();
    } else { this.error(); }
  }
  expr() {
    /** expr -> Integer Plus Integer */
    // set the current token to the first token taken form the input
    this.currentToken = this.getNextToken();

    // we expect the current token to be a single-digit integer
    const left = this.currentToken;
    this.eat(TokenType.Integer);

    // we expect the current token to be a '+' token
    let op = this.currentToken;
    this.eat(TokenType.Plus);

    // we expect the current token to be a single-digit integer
    const right = this.currentToken;
    this.eat(TokenType.Integer);
    // after the above call the currentToken is set to
    // EOF token

    // at this point Integer Plus Integer of tokens
    // has been successfully found and the method can just
    // return the result of  adding two integers, thus
    // effectively interpreting client input
    let result = left.value + right.value;
    return result;
  }

  public static main() {
    while(true) {
      const text = readline.question('calc> ');
      if (text === 'exit') { break; }
      const interpreter = new Interpreter(text);
      console.log(interpreter.expr());
    }
  }
}

Interpreter.main();