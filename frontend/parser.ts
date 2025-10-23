import {
    Statement,
    Program,
    Expression,
    BinaryExpression,
    NumbericLiteral,
    Identifier,
    variableDeclaration,
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
    private expect(type: TokenType, err: any) {
        const previus = this.tokens.shift() as Token;
        if (!previus || previus.type != type) {
            console.error("Parser Error: \n", err, previus, "- expecting: ", type);
            process.exit();
        }
        return previus;
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
        switch (this.currentToken().type) {
            case TokenType.let:
            case TokenType.const:
                return this.parseVariableDeclaration();
            default:
                return this.parseExpression();
        }
    }

    private parseVariableDeclaration(): Statement {
        const isConstant = this.eat().type == TokenType.const;
        const identifier = this.expect(
            TokenType.Identifier,
            "expected indentifier name following let | const keywords."
        ).value;
        if (this.currentToken().type == TokenType.Semicolin) {
            this.eat();
            if (isConstant) {
                throw "must assigne value to constant expression. no value provided";
            }
            return {
                kind: "variableDeclaration",
                identifier,
                constant: false,
            } as variableDeclaration;
        }
        this.expect(
            TokenType.Equals,
            "expected equals toekn following indentifier in var declaration."
        );
        const declaration = {
            kind: "variableDeclaration",
            value: this.parseExpression(),
            identifier,
            constant: isConstant,
        } as variableDeclaration;
        this.expect(TokenType.Semicolin, "valiable declaration statment must end with semicolon.");
        return declaration;
    }
    private parseExpression(): Expression {
        return this.parseAddExpression();
    }
    private parseAddExpression(): Expression {
        // method dat bij 10 -+ 5 de rechter kant pakt en de linkerkant met de operator
        let left = this.parseMultiExpression();
        while (this.currentToken().value == "+" || this.currentToken().value == "-") {
            const operator = this.eat().value;
            const right = this.parseMultiExpression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator,
            } as BinaryExpression;
        }
        return left;
    }
    private parseMultiExpression(): Expression {
        // method dat bij 10 */ 5 de rechter kant pakt en de linkerkant met de operator
        let left = this.parsePrimaryExpression();
        while (
            this.currentToken().value == "/" ||
            this.currentToken().value == "*" ||
            this.currentToken().value == "%"
        ) {
            const operator = this.eat().value;
            const right = this.parsePrimaryExpression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator,
            } as BinaryExpression;
        }
        return left;
    }
    private parsePrimaryExpression(): Expression {
        const tk = this.currentToken().type;
        switch (tk) {
            case TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: this.eat().value,
                } as Identifier;
            case TokenType.Number:
                return {
                    kind: "NumbericLiteral",
                    value: parseFloat(this.eat().value),
                } as NumbericLiteral;
            case TokenType.OpenParen:
                this.eat(); // eat the opening parem
                const value = this.parseExpression();
                this.expect(
                    TokenType.CloseParen,
                    "Unexpected toekn found inside parn expression expected closing paren"
                ); // eat the closing parem
                return value;
            default:
                console.error("unexprected token found during parsing! ", this.currentToken());
                process.exit();
        }
    }
}
