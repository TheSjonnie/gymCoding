const readline = require("readline");
import Parser from "./frontend/parser";

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
        console.log(program);
    });
}

startInterpreter();
