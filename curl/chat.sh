#!/bin/sh
# export SMARTYPANTS_API_KEY=sp_live_...
curl -s https://smartypants.network/v1/models | head -c 400; echo
curl -s https://smartypants.network/v1/chat/completions \
  -H "Authorization: Bearer $SMARTYPANTS_API_KEY" -H "Content-Type: application/json" \
  -d '{"model":"smartypants/qwen3.5-9b","messages":[{"role":"user","content":"Say hello in five words."}]}'
