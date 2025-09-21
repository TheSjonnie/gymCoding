export type ValueType = 'null' | 'number'|'boolean';

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