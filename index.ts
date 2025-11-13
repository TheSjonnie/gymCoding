const readline = require("readline");
import { parse } from "path";
import Parser from "./frontend/parser";
import Environment, { createGlobalEnvironment } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import * as fs from 'fs';
import { make_Null, make_Number,make_Bool, NumberVal } from "./runtime/values";


function startInterpreter() {
    const parser = new Parser();
    const env = createGlobalEnvironment()

    console.log("Interpreter started");
    // readlineFn(parser, env) // to run the command in the commandline 
    readFileFn(parser, env) // to run the test.txt file
}
function readFileFn(parser, env){
    const data = fs.readFileSync( `${__dirname}/test.txt`, 'utf-8')
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
    console.log('results from parser', '\n')
    console.dir(program,{depth: null})
    const results = evaluate(program, env);
    console.log('results from evaluate', '\n' ,results)
} 
startInterpreter();
