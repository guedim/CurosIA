import { OpenAI } from "openai";
import readline from "node:readline";
 
const client = new OpenAI();
 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
 
const messages = [];
 
function ask(prompt) {
    return new Promise((resolve) => rl.question(prompt, resolve));
}
 
while (true) {
    const userMessage = await ask("\nTú: ");
 
    if (userMessage.toLowerCase() === "salir") {
        rl.close();
        break;
    }
 
    messages.push({ role: "user", content: userMessage });
 
    const completion = await client.chat.completions.create({
        model: "gpt-5.2",
        messages,
    });
 
    const reply = completion.choices[0].message.content;
    console.log(`\nAsistente: ${reply}`);
 
    messages.push({ role: "assistant", content: reply });
}