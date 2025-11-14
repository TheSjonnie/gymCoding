import { make_Bool, make_native_function, make_Null, RuntimeVal } from "./values";
import Environment from "./environment";
export function createGlobalEnvironment() {
    const env = new Environment();
    env.declareVarible("true", make_Bool(true), true)
    env.declareVarible("false", make_Bool(false), true)
    env.declareVarible("null", make_Null(), true)

    env.declareVarible("print", make_native_function((args, scope) => {
        console.log(...args);
        return make_Null()
    }) , true);
    return env;
}