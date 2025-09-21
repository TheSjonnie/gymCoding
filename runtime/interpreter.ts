import { NumberVal, ValueType, RuntimeVal, NullVal } from "./values";
import {
    BinaryExpression,
    NodeType,
    NumbericLiteral,
    Program,
    Statement,
} from "../frontend/ast.js";

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

function evaluate_binary_expression(binop: BinaryExpression): RuntimeVal {
    const leftHandSide = evaluate(binop.left);
    const rightHandSide = evaluate(binop.right);

    if (leftHandSide.type == "number" && rightHandSide.type == "number") {
        return evaluate_numeric_expression(
            leftHandSide as NumberVal,
            rightHandSide as NumberVal,
            binop.operator
        );
    }
    return { type: "null", value: "null" } as NullVal;
}
function evaluate_program(program: Program): RuntimeVal {
    let lastEvalutad: RuntimeVal = { type: "null", value: "null" } as NullVal;
    for (const statement of program.body) {
        lastEvalutad = evaluate(statement);
    }
    return lastEvalutad;
}
export function evaluate(astNode: Statement): RuntimeVal {
    console.log(astNode);
    switch (astNode.kind) {
        case "NumbericLiteral":
            return {
                value: (astNode as NumbericLiteral).value,
                type: "number",
            } as NumberVal;
        case "NullLiteral":
            return { value: "null", type: "null" } as NullVal;
        case "BinaryExpression":
            return evaluate_binary_expression(astNode as BinaryExpression);
        case "Program":
            return evaluate_program(astNode as Program);
        default:
            console.error(
                "This AST node has not yet been setup for interpretation.",
                astNode
            );
            process.exit();
    }
}
