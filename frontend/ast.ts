export type NodeType =
// statements
    | "Program"
    | "variableDeclaration"

    // expressions
    | "NumbericLiteral"
    | "Identifier"
    | "BinaryExpression";


export interface Statement {
    kind: NodeType;
}

export interface variableDeclaration extends Statement {
    kind: "variableDeclaration";
    body: Statement[];
}

export interface Program extends Statement {
    kind: "Program";
    constant: boolean;
    identifier: string;
    value?: Expression;
}
export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
    left: Expression,
    right: Expression,
    operator: string,
}

export interface Identifier extends Expression {
    kind: "Identifier",
    symbol: string,
}
export interface NumbericLiteral extends Expression {
    kind: "NumbericLiteral",
    value: number
}