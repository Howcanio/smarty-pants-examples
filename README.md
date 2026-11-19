# Smarty Pants examples

Copy-paste examples for [Smarty Pants](https://smartypants.network): exact, pinned builds of open models
served on Apple Silicon Macs through an **OpenAI-compatible API**, priced per token.

- Base URL: `https://smartypants.network/v1`
- Key: `Authorization: Bearer $SMARTYPANTS_API_KEY` (sign up with an email at https://smartypants.network/api)
- Models, prices, context sizes and `is_ready`: `GET https://smartypants.network/v1/models`

## When to use it

- **Use it for** everyday AI calls where an exact open model is good enough and price matters:
  summaries, extraction, classification, drafting, tool calls, JSON output, embeddings and reranking.
  Work that can wait goes through the Batch API at half the per-token price, results within 24 hours.
- **Don't use it for** work that needs a frontier-size model, more context than a model lists, or strict latency.
  Keep your current provider for those, and as a fallback.
- Requests run on Macs owned by other people. Owners agree not to read requests and the app doesn't show them,
  but a serving Mac decrypts each request in memory to answer it. Don't send secrets or personal data unless
  the person you work for has approved it.
- Check `is_ready` before sending traffic. A 429 or 503 means no Mac can take the request right now: wait the
  `Retry-After` seconds or fall back.

## Examples

| Framework | File |
|---|---|
| OpenAI SDK (Python) | [python/openai_sdk.py](python/openai_sdk.py) |
| LangChain | [python/langchain_example.py](python/langchain_example.py) |
| OpenAI Agents SDK | [python/openai_agents_example.py](python/openai_agents_example.py) |
| LlamaIndex | [python/llamaindex_example.py](python/llamaindex_example.py) |
| Batch API (half price) | [python/batch_example.py](python/batch_example.py) |
| OpenAI SDK (JavaScript) | [javascript/openai_sdk.mjs](javascript/openai_sdk.mjs) |
| Vercel AI SDK | [javascript/vercel_ai_sdk.mjs](javascript/vercel_ai_sdk.mjs) |
| curl | [curl/chat.sh](curl/chat.sh) |
| Claude Code skill | [claude-code/skills/smartypants/SKILL.md](claude-code/skills/smartypants/SKILL.md) |

## MCP server

```bash
# Models, prices, cost estimates and model search, no account needed:
claude mcp add --transport http smartypants https://smartypants.network/mcp
# Signed in (email link, then Allow): run prompts, embeddings, balance, add credit (the person pays on Stripe)
claude mcp add --transport http smartypants-account https://smartypants.network/mcp/account
```

Listed in the official MCP Registry as `network.smartypants/smartypants`.

## GitHub Action

Run a prompt in any workflow, for example a review of each pull request's diff
([example workflow](.github/workflows/review-diff.yml)):

```yaml
- uses: actions/checkout@v4
  with: { fetch-depth: 0 }
- uses: Howcanio/smarty-pants-examples@v1
  with:
    api-key: ${{ secrets.SMARTYPANTS_API_KEY }}
    input-command: git diff origin/${{ github.base_ref }}...
    system: Review this diff in 5 bullets
```

[`job/`](job/action.yml) runs a whole job (code, setup, tests, files back) in a sealed Linux workspace on a Mac.
Whole jobs are open to our own account first; other keys get a clear refusal until they open.

## Command line and packages

```bash
npx smartypants-network help          # or: npm install -g smartypants-network
pip install smartypants-network       # Python kit, module smartypants_network
```

More: [docs for agents](https://smartypants.network/docs/agents), [llms.txt](https://smartypants.network/llms.txt),
[OpenAPI](https://smartypants.network/openapi.json). Questions: info@howcan.io

MIT licensed.
