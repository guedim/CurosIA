import OpenAI from "openai";
const client = new OpenAI();

let messages = [
  { role: "system", content: "Eres un asistente muy útil y amable" },
  { role: "user", content: "¿Cuál es la capital de Colombia?" },
];

const res1 = await client.chat.completions.create({
  model: "gpt-5",
  messages,
});

console.log(res1.choices[0].message.content);

messages = messages.concat([res1.choices[0].message]);
messages.push({ role: "user", content: "¿Y su población?" });

const res2 = await client.chat.completions.create({
  model: "gpt-5",
  messages,
});

console.log(res2.choices[0].message.content);