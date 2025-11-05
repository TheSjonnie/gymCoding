const readline = require("readline");
import { parse } from "path";
import Parser from "./frontend/parser";
import Environment from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import * as fs from 'fs';
import { make_Null, make_Number,make_Bool, NumberVal } from "./runtime/values";


function startInterpreter() {
    const parser = new Parser();
    const env = new Environment();


    console.log("Interpreter started");
    // readlineFn(parser, env)
    readFileFn(parser, env)
}
function readFileFn(parser, env){
    const data = fs.readFileSync("C:\\Users\\jesse\\Documents\\codeing\\ProgrammingLanguages\\gymCoding\\test.txt", 'utf-8')
    console.log(data)
    runProgram(parser, data,env)
}
function readlineFn(parser,env){
    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
    rl.question("Enter Code> ", (input) => {
        if (!input || input.includes("exit")) {
            rl.close();
            process.exit();
            return;
        }
        runProgram(parser, input,env)
        readlineFn(parser, env)
    });
}
function runProgram(parser, input, env){
    const program = parser.produceAST(input);
    console.log(program)
    const results = evaluate(program, env);
    console.log(results, "line 28 index.ts" )
} 
startInterpreter();
