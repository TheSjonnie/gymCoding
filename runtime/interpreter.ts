import { Statement, NumbericLiteral, Identifier, BinaryExpression, Program, variableDeclaration } from "../frontend/ast";
import Environment from "./environment";
import { evaluate_identifier, evaluate_binary_expression } from "./evaluate/expressions";
import { eval_variable_declaration, evaluate_program } from "./evaluate/statements";
import { RuntimeVal, NumberVal } from "./values";


export function evaluate(astNode: Statement, env: Environment): RuntimeVal {
    console.dir(astNode,{depth: null})
    console.log( "astnode", env, "env")
    switch (astNode.kind) {
        case "NumbericLiteral":
            return {
                value: (astNode as NumbericLiteral).value,
                type: "number",
            } as NumberVal;
        case "Identifier":
            return evaluate_identifier(astNode as Identifier, env)
        case "BinaryExpression":
            return evaluate_binary_expression(astNode as BinaryExpression, env);
        case "Program":
            return evaluate_program(astNode as Program, env);
        case "variableDeclaration":
            return eval_variable_declaration(astNode as variableDeclaration, env);
        default:
            console.error(
                "This AST node has not yet been setup for interpretation.",
                astNode
            );
            process.exit();
    }
}
