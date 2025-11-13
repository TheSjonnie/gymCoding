export type NodeType =
// statements
    | "Program"
    | "variableDeclaration"
    | "functionDeclaration"

    // expressions
    | 'AssignmentExpression'
    | "MemberExpression"
    | "CallExpression"
    // literals
    | "Property"
    | "ObjectLiteral"
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
export interface functionDeclaration extends Statement {
    kind: "functionDeclaration";
    parameters: string[],
    name: string,
    body: Statement[],
}
export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression"
    left: Expression,
    right: Expression,
    operator: string,
}
export interface CallExpression extends Expression {
    kind: "CallExpression"
    arguments: Expression[];
    caller: Expression,
}
export interface MemberExpression extends Expression {
    kind: "MemberExpression",
    object: Expression;
    property: Expression;
    computed: boolean;
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
export interface Property extends Expression {
    kind: "Property";
    key: string;
    value?: Expression;  
}
export interface ObjectLiteral extends Expression {
    kind: "ObjectLiteral",
    properties: Property[]
}