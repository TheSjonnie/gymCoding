import { json } from "stream/consumers";
import { AssignmentExpression, BinaryExpression, CallExpression, Identifier, ObjectLiteral } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { FunctionValue, NativeFunctionValue, NumberVal, ObjectVal, RuntimeVal, make_Null } from "../values";

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

export function evaluate_object_expression (obj: ObjectLiteral, env: Environment): RuntimeVal {
    const object = { type: "object", properties: new Map( ) } as ObjectVal
    for (const{ key, value} of obj.properties){
        const runtimeVal =  ( value == undefined) ? env.lookupVarible(key) : evaluate(value, env);
        object.properties.set(key, runtimeVal);

    }
    return object
}

export function evaluate_call_expression (expression: CallExpression, env: Environment): RuntimeVal {
    const args = expression.arguments.map((arg) => evaluate(arg, env))
    const fn = evaluate(expression.caller , env) ;
    if (fn.type == "nativeFunction"){
        const results = (fn as NativeFunctionValue).call(args, env)
        return results
    } 
    if(fn.type == 'function'){
        const func = fn as FunctionValue;
        const scope = new Environment(func.declarationEnv);
        for(let i = 0; i < func.parameters.length; i++){
            scope.declareVarible(func.parameters[i], args[i], false)
        }

        let result: RuntimeVal = make_Null();
        for(const statement of func.body){
            result = evaluate(statement, scope)
        }   
        return result
    }
    throw "cannot call value that is not a function" + JSON.stringify(fn);
}