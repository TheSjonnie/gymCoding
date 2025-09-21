import { NumberVal, ValueType, RuntimeVal, NullVal, make_Null } from "./values";
import {
    BinaryExpression,
    Identifier,
    NodeType,
    NumbericLiteral,
    Program,
    Statement,
} from "../frontend/ast.js";
import { env } from "process";
import Environment from "./environment";

function evaluate_numeric_expression(
    leftHandSide: NumberVal,
    rightHandSide: NumberVal,
    operator: string
): NumberVal {
    let results = 0;
    console.log({
        operator: operator,
        leftHandSide: leftHandSide,
        rightHandSide: rightHandSide

    })
    switch (operator) {
        case "+":
            results = leftHandSide.value + rightHandSide.value;
            break;
        case "-":
            results = leftHandSide.value - rightHandSide.value;
            break;
        case "*":
            results = leftHandSide.value * rightHandSide.value;
            break;

            case "/":
            results = leftHandSide.value / rightHandSide.value;
            break;

            case "%":
            results = leftHandSide.value % rightHandSide.value;
            break;
        default:
            console.error('not working')
        }
        return { type: "number", value: results } as NumberVal
}

function evaluate_binary_expression(binop: BinaryExpression, env: Environment): RuntimeVal {
    const leftHandSide = evaluate(binop.left, env);
    const rightHandSide = evaluate(binop.right, env);

    if (leftHandSide.type == "number" && rightHandSide.type == "number") {
        return evaluate_numeric_expression(
            leftHandSide as NumberVal,
            rightHandSide as NumberVal,
            binop.operator
        );
    }
    return make_Null();
}
function evaluate_program(program: Program, env: Environment): RuntimeVal {
    let lastEvalutad: RuntimeVal = make_Null();
    for (const statement of program.body) {
        lastEvalutad = evaluate(statement, env);
    }
    return lastEvalutad;
}
function evaluate_identifier(identifier: Identifier, env: Environment): RuntimeVal{
    const value = env.lookupVarible(identifier.symbol);
    return value;
}
export function evaluate(astNode: Statement, env: Environment): RuntimeVal {
    console.log(astNode);
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
        default:
            console.error(
                "This AST node has not yet been setup for interpretation.",
                astNode
            );
            process.exit();
    }
}
