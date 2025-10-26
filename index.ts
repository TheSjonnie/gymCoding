const readline = require("readline");
import { parse } from "path";
import Parser from "./frontend/parser";
import Environment from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import { make_Null, make_Number,make_Bool, NumberVal } from "./runtime/values";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function startInterpreter() {
    const parser = new Parser();
    const env = new Environment();


    console.log("Interpreter started");
    readlineFn(parser, env)
}
function readlineFn(parser,env){
    rl.question("Enter Code> ", (input) => {
        if (!input || input.includes("exit")) {
            rl.close();
            process.exit();
            return;
        }
        const program = parser.produceAST(input);
        const results = evaluate(program, env);
        console.log(results, "line 28 index.ts" )
        readlineFn(parser, env)
    });
}
startInterpreter();
