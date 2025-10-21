const readline = require("readline");
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

    env.declareVarible("x", make_Number(100));
    env.declareVarible("true", make_Bool(true))
env.declareVarible("false", make_Bool(false))
env.declareVarible("null", make_Null())
    console.log("Interpreter started");
    rl.question("Enter Code for interpreter> ", (input) => {
        if (!input || input.includes("exit")) {
            rl.close();
            process.exit();
        }
        const program = parser.produceAST(input);
        // console.dir(program,{depth: null});
        const results = evaluate(program, env);
        console.log(results, "line 28 index.ts" )
    });
}

startInterpreter();
