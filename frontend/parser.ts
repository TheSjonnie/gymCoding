import { error } from "console";
import {
    Statement,
    Program,
    Expression,
    BinaryExpression,
    NumbericLiteral,
    Identifier,
    variableDeclaration,
    AssignmentExpression,
    Property,
    ObjectLiteral,
    CallExpression,
    MemberExpression,
    functionDeclaration,
} from "./ast";
import { tokenizer, Token, TokenType } from "./lexer";
import { BlobOptions } from "buffer";
import { exit } from "process";

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
            case TokenType.Function:
                return this.parseFunctionDeclaration()
            default:
                return this.parseExpression();
        }
    }
    parseFunctionDeclaration(): Statement {

        this.eat(); 
        const name: string = this.expect(TokenType.Identifier, "expected function name following fn keyword").value;
        const args = this.parseArguments()
        const parameters: string[] = []
        for(const arg of args){
            if(arg.kind !== "Identifier"){
                console.log(args)
                throw "expected function declaration expected parameters to be of type string.";
            }
            parameters.push((arg as Identifier).symbol)
        }
        this.expect(TokenType.OpenBrace, "expected function body")
        
        const body: Statement[] = []
        while(this.currentToken().type !== TokenType.EndOfFile 
        && this.currentToken().type !== TokenType.CloseBrace){
            body.push(this.parseStatement())
        }
        this.expect(TokenType.CloseBrace, "Closing brace expted inside function declaration");
        const fn = {
             kind: "functionDeclaration", name, parameters: parameters, body
        } as functionDeclaration;
        return fn
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
        // this.expect(TokenType.Semicolin, "valiable declaration statment must end with semicolon.");
        return declaration;
    }
    private parseExpression(): Expression {
        return this.parseAssignmentExpression();
    }
    private parseAssignmentExpression(): Expression {
        const left = this.parseObjectExpression();
        if (this.currentToken().type == TokenType.Equals) {
            this.eat();
            const value = this.parseAssignmentExpression();
            return { value, assigne: left, kind: "AssignmentExpression" } as AssignmentExpression;
        }
        return left;
    }
    private parseObjectExpression(): Expression {
        if (this.currentToken().type !== TokenType.OpenBrace) {
            return this.parseAddExpression();
        }
        this.eat();
        const properties = new Array<Property>();
        while (this.notEOF() && this.currentToken().type != TokenType.CloseBrace) {
            const key = this.expect(TokenType.Identifier, "object lital ekey expressetd").value;

            // { key, }
            if (this.currentToken().type == TokenType.Comma) {
                this.eat();
                properties.push({ key, kind: "Property", value: undefined } as Property);
                continue;
            } // { key }
            else if (this.currentToken().type == TokenType.CloseBrace) {
                properties.push({ key, kind: "Property", value: undefined } as Property);
                continue;
            }
            // { key: value}
            this.expect(TokenType.Colon, "missing colon following exdentifier in objectexpression");
            const value = this.parseExpression();
            properties.push({ kind: "Property", value, key });
            if (this.currentToken().type != TokenType.CloseBrace) {
                this.expect(TokenType.Comma, "exprected comma or closingbrace.");
            }
        }
        this.expect(TokenType.CloseBrace, "Object literal missing closing brace. ");

        return { kind: "ObjectLiteral", properties } as ObjectLiteral;
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
        let left = this.parseCallMemberExpression();
        while (
            this.currentToken().value == "/" ||
            this.currentToken().value == "*" ||
            this.currentToken().value == "%"
        ) {
            const operator = this.eat().value;
            const right = this.parseCallMemberExpression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator,
            } as BinaryExpression;
        }
        return left;
    }
    private parseCallMemberExpression(): Expression {
        const member = this.parseMemberExpression();
        if (this.currentToken().type == TokenType.OpenParen) {
            return this.parseCallExpression(member);
        }
        return member;
    }
    private parseCallExpression(caller: Expression): Expression {
        let CallExpression: Expression = {
            kind: "CallExpression",
            caller,
            arguments: this.parseArguments(),
        } as CallExpression

        if (this.currentToken().type == TokenType.OpenParen){
            CallExpression = this.parseCallExpression(CallExpression)
        }
        return CallExpression;

    }
    private parseArguments(): Expression[] {
        this.expect(TokenType.OpenParen, "expected open paren");
        let args;
        if (this.currentToken().type == TokenType.CloseParen){
            args = []
        } else{
            args = this.parseArgumentsList();
        }
        this.expect(TokenType.CloseParen, "Missing closing paren inside arguments list")
        return args
    }
    private parseArgumentsList(): Expression[] {
        const args = [this.parseAssignmentExpression()]
        while (this.notEOF() && this.currentToken().type == TokenType.Comma && this.eat()){
            args.push(this.parseAssignmentExpression());
        }
        return args;
    }
    private parseMemberExpression(): Expression {
        let object = this.parsePrimaryExpression();
        while(this.currentToken().type == TokenType.Dot || this.currentToken().type == TokenType.Openbraket){
            const operator = this.eat();
            let property: Expression;
            let computed: boolean;
            if (operator.type == TokenType.Dot){
                computed = false;
                property = this.parsePrimaryExpression();
                if (property.kind != "Identifier"){
                    throw 'Cannot not use dot operator without right hand side being a identifier'
                }
                
            }else{
                    computed = true
                    property = this.parseExpression();
                    this.expect(TokenType.CloseBraket, "missing closing bracket in computed value")
                }
            object = { kind: "MemberExpression", object, property, computed} as MemberExpression
        }
        return object;
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
