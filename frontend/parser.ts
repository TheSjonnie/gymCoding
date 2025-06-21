import {
    Statement,
    Program,
    Expression,
    BinaryExpression,
    NumericLiteral,
    Identifier,
} from "./ast";
import { tokenizer, Token, TokenType } from "./lexer";

export default class Parser {
    private tokens: Token[] = [];
    private notEOF(): boolean {
        return this.tokens[0].type != TokenType.EndOfFile;
    }
    private currentToken() {
        return this.tokens[0] as Token;
    }
    private eat() {
        const tk = this.tokens.shift() as Token;
        return tk;
    }
    public produceAST(srcCode: string): Program {
        this.tokens = tokenizer(srcCode);
        const program: Program = {
            kind: "Program",
            body: [],
        };
        while (this.notEOF()) {
            program.body.push(this.parseStatement());
        }
        return program;
    }
    private parseStatement(): Statement {
        return this.parseExpression();
    }
    private parseExpression(): Expression {
        return this.parsePrimaryExpression();
    }
    private parsePrimaryExpression() {
        const tk = this.currentToken().type;
        switch (tk) {
            case TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: this.eat().value,
                } as Identifier;
            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.eat().value)
                } as NumericLiteral;
            default:
                console.error("unexprected token found during parsing! ", this.currentToken());
                process.exit()
        }
    }
}
