---
name: smartypants
description: Use when a task needs cheap, exact open-model AI calls (summaries, extraction, classification, JSON output, embeddings, reranking, speech to text) priced per token, or batch work that can wait at half price. Not for work needing a frontier model.
---

# Smarty Pants

Smarty Pants (https://smartypants.network) serves exact, pinned builds of open models on Apple Silicon Macs through an OpenAI-compatible API, priced per token.

## When to use it
- Everyday text work where an open model is good enough and price matters: summaries, extraction, classification, drafting, tool calls, JSON output.
- Embeddings (`smartypants/qwen3-embedding-0.6b`) and reranking (`smartypants/qwen3-reranker-0.6b`).
- Many requests that can wait: the Batch API (OpenAI format) runs them within 24 hours at half the per-token price.
- Not for: work that needs a frontier-size model, more context than the model lists, or strict latency. Keep the current provider for those.

## How
1. Check models, prices and `is_ready`: `curl https://smartypants.network/v1/models`. Only send traffic to models that are ready.
2. The person creates an API key at https://smartypants.network/api (llms.txt says who can sign up today); keep it in `SMARTYPANTS_API_KEY`. Never put it in code or chat.
3. Call it like OpenAI: base URL `https://smartypants.network/v1`, model id such as `smartypants/qwen3.5-9b`.
   ```bash
   curl https://smartypants.network/v1/chat/completions -H "Authorization: Bearer $SMARTYPANTS_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"smartypants/qwen3.5-9b","messages":[{"role":"user","content":"Hello"}]}'
   ```
   Or from a shell: `npx -y smartypants-network ask "Hello"`.
4. On 429 or 503, wait the `Retry-After` seconds or fall back to the current provider. 402 means the balance is empty.

## Rules
- Ask the person before spending. `GET https://smartypants.network/v1/key` shows what this key has left.
- Requests run on Macs owned by other people. Do not send secrets, personal, customer or regulated data unless the person approved it.
- Never handle card details; the person adds money on their account page (Stripe).

Full guide: https://smartypants.network/llms.txt and https://smartypants.network/docs/agents
