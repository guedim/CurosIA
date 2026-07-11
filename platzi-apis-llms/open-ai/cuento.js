import OpenAI from "openai";

const  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    logLevel: "info",
});


const response = await client.chat.completions.create({
    model: "gpt-4o",
    input: "Escribe un cuento corto sobre un gato y un perro que se hacen amigos.",
});

console.log("Respuesta del modelo:");
console.log(response.choices[0].message.content);   