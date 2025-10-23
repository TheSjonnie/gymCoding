export type NodeType =
// statements
    | "Program"
    | "variableDeclaration"

    // expressions
    | 'AssignmentExpression'
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

export interface variableDeclaration extends Statement {
    kind: "variableDeclaration";
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
export interface AssignmentExpression extends Expression {
    kind: "AssignmentExpression",
    assigne: Expression,
    value: Expression,
}
export interface Identifier extends Expression {
    kind: "Identifier",
    symbol: string,
}
export interface NumbericLiteral extends Expression {
    kind: "NumbericLiteral",
    value: number
}