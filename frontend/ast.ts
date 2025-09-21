export type NodeType =
    | "Program"
    | "NullLiteral"
    | "NumbericLiteral"
    | "Identifier"
    | "BinaryExpression";


export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
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
export interface NullLiteral extends Expression {
    kind: "NullLiteral",
    value: "null"
}