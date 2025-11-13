import { Statement } from "../frontend/ast";
import Environment from "./environment";

export type ValueType = 'null' | 'number'|'boolean' | "object"  | "nativeFunction" | "function";

export interface RuntimeVal {
    type: ValueType;
}

export interface NullVal extends RuntimeVal {
    type: 'null';
    value: null;
}
export function make_Null() {
    return { type: "null", value: null} as NullVal;
}
export interface BooleanVal extends RuntimeVal {
    type: 'boolean';
    value: boolean;
}
export function make_Bool(b = true) {
    return { type: "boolean", value: b} as BooleanVal;
}
export interface NumberVal extends RuntimeVal {
    type: 'number';
    value: number;
}

export function make_Number(n = 0) {
    return { type: 'number', value: n} as NumberVal;
}
export interface ObjectVal extends RuntimeVal {
    type: 'object';
    properties: Map<string, RuntimeVal>;
}
export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;
export interface NativeFunctionValue extends RuntimeVal {
   type: "nativeFunction";
   call: FunctionCall;
}

export function make_native_function(call: FunctionCall){
    return {type: "nativeFunction", call} as NativeFunctionValue
}
export interface FunctionValue extends RuntimeVal {
   type: "function";
   name: string,
   parameters: string[],
   declarationEnv: Environment;
   body: Statement[];
}