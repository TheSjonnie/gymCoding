import { json } from "stream/consumers";
import { AssignmentExpression, BinaryExpression, Identifier } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { NumberVal, RuntimeVal, make_Null } from "../values";

export function evaluate_numeric_expression(
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

export function evaluate_binary_expression(binop: BinaryExpression, env: Environment): RuntimeVal {
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

export function evaluate_identifier(identifier: Identifier, env: Environment): RuntimeVal{
    const value = env.lookupVarible(identifier.symbol);
    return value;
}
export function evaluate_assignment (node: AssignmentExpression, env: Environment): RuntimeVal {
    if ( node.assigne.kind !== "Identifier"){
        throw `Invalid Lefthandside asined assignment expression ${JSON.stringify(node.assigne)}`;
    }
    const varname = (node.assigne as Identifier).symbol
    return env.assignVarible(varname, evaluate(node.value, env))

}