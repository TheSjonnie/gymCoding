export enum TokenType {
    Number,
    Identifier,
    Equals,
    Semicolin,
    OpenParen, // (
    CloseParen, // )
    OpenBrace, // {
    CloseBrace, // }
    Comma,
    Colon, // :
    BinaryOperator,
    let,
    const,
    EndOfFile,
}
const keywords: Record<string, TokenType> = {
    let: TokenType.let,
    const: TokenType.const,
};
export interface Token {
    value: string;
    type: TokenType;
}
function token(value: string, type: TokenType): Token {
    return { value, type };
}
function checkLetter(src: string) {
    // this function checks if the src is are letters or not
    return src.toUpperCase() != src.toLowerCase();
}
function checkNumber(src: string) {
    // this function checks if the src are numbers
    const charCodeSrc = src.charCodeAt(0);
    const charCodes09 = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return charCodeSrc >= charCodes09[0] && charCodeSrc <= charCodes09[1];
}
function checkSkippable(src: string) {
    return src == " " || src == "\n" || src == "\t" || src == "\r";
}
export function tokenizer(src: string): Token[] {
    const tokens = new Array<Token>();
    const srcArray = src.split("");
    // het maken van token tot er niets neer in de srcarray zit wat beteken end of file
    while (srcArray.length > 0) {
        switch (srcArray[0]) {
            case "(":
                tokens.push(
                    token(srcArray.shift() as string, TokenType.OpenParen)
                );
                break;
            case ")":
                tokens.push(
                    token(srcArray.shift() as string, TokenType.CloseParen)
                );
                break;
            case "{":
                tokens.push(
                    token(srcArray.shift() as string, TokenType.OpenBrace)
                );
                break;
            case "}":
                tokens.push(
                    token(srcArray.shift() as string, TokenType.CloseBrace)
                );
                break;
            case "+":
            case "-":
            case "*":
            case "/":
            case "%":
                tokens.push(
                    token(srcArray.shift() as string, TokenType.BinaryOperator)
                );
                break;
            case "=":
                tokens.push(
                    token(srcArray.shift() as string, TokenType.Equals)
                );
                break;
            case ";":
                tokens.push(
                    token(srcArray.shift() as string, TokenType.Semicolin)
                );
                break;
            case ":":
                tokens.push(token(srcArray.shift() as string, TokenType.Colon));
                break;
            case ",":
                tokens.push(token(srcArray.shift() as string, TokenType.Comma));
                break;
            default:
                // use for multycharchar tokens like <=, let, a varname
                if (checkNumber(srcArray[0])) {
                    let number = "";
                    // this while loop check is it is 1 or 123 trough checking if the next token is also a number with the checknumber if removes the first number and checks if the next one is also a number
                    while (srcArray.length > 0 && checkNumber(srcArray[0])) {
                        number += srcArray.shift();
                    }
                    tokens.push(token(number, TokenType.Number));
                } else if (checkLetter(srcArray[0])) {
                    let word = "";
                    // same as the if above just now with words
                    while (srcArray.length > 0 && checkLetter(srcArray[0])) {
                        word += srcArray.shift();
                    }
                    // check for keywords
                    const reserved = keywords[word];
                    if (typeof reserved == "number") {
                        tokens.push(token(word, reserved));
                    } else {
                        tokens.push(token(word, TokenType.Identifier));
                    }
                } else if (checkSkippable(srcArray[0])) {
                    srcArray.shift(); // removes the skippable tokens
                } else {
        console.error(
          "Unreconized character found in source: ",
          srcArray[0].charCodeAt(0),
            srcArray[0],
        );
                    process.exit();
                }
                break;
        }
    }
    tokens.push({ type: TokenType.EndOfFile, value: "EndOfFile" });
    return tokens;
}
