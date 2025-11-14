import { Expression, functionDeclaration, Program, returnStatement, Statement, variableDeclaration } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeVal, make_Null, FunctionValue } from "../values";


export function evaluate_program(program: Program, env: Environment): RuntimeVal {
    let lastEvalutad: RuntimeVal = make_Null();
    console.log(program.body)
    for (const statement of program.body) {
        console.log(statement);
        lastEvalutad = evaluate(statement, env);
    }
    return lastEvalutad;
}
export function evaluate_variable_declaration(
  declaration: variableDeclaration,
  env: Environment,
): RuntimeVal {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : make_Null();

  return env.declareVarible(declaration.identifier, value, declaration.constant);
}

export function evaluate_function_declaration(
  declaration: functionDeclaration,
  env: Environment,
): RuntimeVal {
  const fn = {
       type: "function",
       name: declaration.name,
       parameters: declaration.parameters,
       declarationEnv: env,
       body:declaration.body
  } as FunctionValue

  return env.declareVarible(declaration.name, fn, true)
}

export function evaluate_return_statement(astNode: returnStatement, env): RuntimeVal{
  return evaluate(astNode.expression, env)
}