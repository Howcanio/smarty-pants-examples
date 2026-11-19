# pip install openai ; export SMARTYPANTS_API_KEY=sp_live_...
import os
from openai import OpenAI

client = OpenAI(base_url="https://smartypants.network/v1", api_key=os.environ["SMARTYPANTS_API_KEY"])
# Pick a model from https://smartypants.network/v1/models and check is_ready first.
reply = client.chat.completions.create(model="smartypants/qwen3.5-9b",
                                       messages=[{"role": "user", "content": "Say hello in five words."}])
print(reply.choices[0].message.content)
