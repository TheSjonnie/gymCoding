const readline = require("readline");
import Parser from "./frontend/parser";
import { evaluate } from "./runtime/interpreter";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function startInterpreter() {
    const parser = new Parser();
    console.log("Interpreter started");
    rl.question("Enter Code for interpreter> ", (input) => {
        if (!input || input.includes("exit")) {
            rl.close();
            process.exit();
        }
        const program = parser.produceAST(input);
        console.dir(program,{depth: null});
        const results = evaluate(program);
        console.log(results)
    });
}

startInterpreter();
