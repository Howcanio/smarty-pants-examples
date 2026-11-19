// npm install openai ; export SMARTYPANTS_API_KEY=sp_live_...
import OpenAI from 'openai';

const client = new OpenAI({ baseURL: 'https://smartypants.network/v1', apiKey: process.env.SMARTYPANTS_API_KEY });
const reply = await client.chat.completions.create({
  model: 'smartypants/qwen3.5-9b',
  messages: [{ role: 'user', content: 'Say hello in five words.' }],
});
console.log(reply.choices[0].message.content);
