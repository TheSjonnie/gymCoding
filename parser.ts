import { Statement, Program, Expression, BinaryExpression, NumbericLiteral, Identifier } from "./ast";
import { tokenizer, Token, TokenType } from "./lexer";


export default class Parser {

    private tokens: Token[] = [];
    private notEOF() : boolean{
        return this.tokens[0].type != TokenType.EndOfFile
    }
    public produceAST (srcCode: string): Program{
        this.tokens = tokenizer(srcCode);
        const program: Program = {
            kind: "Program",
            body: []
        }
        while (this.notEOF()){
            program.body.push(this.parse_statement())
        }
        return program
    }
    private parse_statement(): Statement {
        return this.parse_expression()
    }
    private parse_expression(): Expression{
        
    }
}