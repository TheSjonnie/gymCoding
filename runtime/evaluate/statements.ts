import { Program, variableDeclaration } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeVal, make_Null } from "../values";


export function evaluate_program(program: Program, env: Environment): RuntimeVal {
    let lastEvalutad: RuntimeVal = make_Null();
    for (const statement of program.body) {
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