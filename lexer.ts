export enum TokenType {
    Number,
    Identifier,
    Equals,
    OpenParen,
    CloseParen,
    BinartOperator,
    let,
}

export interface Token {
    value: string;
    type: TokenType;
}
function token(value: string, type: TokenType): Token {
    return { value, type };
}
export function tokenizer(src: string): Token[] {
    const tokens = new Array<Token>();
    const srcArray = src.split("");
    // het maken van token tot er niets neer in de srcarray zit wat beteken end of file
    while (srcArray.length > 0) {
        switch (srcArray[0]) {
            case "(":
                tokens.push(token(srcArray.shift() as string, TokenType.OpenParen));
                break;
            case ")":
                tokens.push(token(srcArray.shift() as string, TokenType.CloseParen));
                break;
            case "+":
            case "-":
            case "*":
            case "/":
                tokens.push(token(srcArray.shift() as string, TokenType.BinartOperator))
                break
            default:
                break;
        }
    }
    return tokens;
}
// console.log(tokenizer("let x = 4"))