import { OpenAI } from "openai";
const client = new OpenAI();

const stream = await client.responses.create({
    model: "gpt-5.2",
    input: "Escribe una pequeña historia de 100 palabras, en español sobre un niño que encuentra un dragón en el bosque.",
    stream: true,
});

for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
    }
}
console.log();