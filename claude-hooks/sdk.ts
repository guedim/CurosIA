// Note: the "@anthropic-ai/claude-code" package has been renamed
// to "@anthropic-ai/claude-agent-sdk"
import { query } from "@anthropic-ai/claude-agent-sdk";

//const prompt = "Add a description to the package.json file";
const prompt = "Look for duplicates querys in the ./src/queries dir"

for await (const message of query({
  prompt,
  options: {
    allowedTools: ["Edit"],
  },
})) {
  console.log(JSON.stringify(message, null, 2));
}
