// npm install ai @ai-sdk/openai-compatible ; export SMARTYPANTS_API_KEY=sp_live_...
import { generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const smartypants = createOpenAICompatible({
  name: 'smartypants',
  baseURL: 'https://smartypants.network/v1',
  apiKey: process.env.SMARTYPANTS_API_KEY,
});
const { text } = await generateText({ model: smartypants('smartypants/qwen3.5-9b'), prompt: 'Name three uses for embeddings.' });
console.log(text);
