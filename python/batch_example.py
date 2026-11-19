# Work that can wait: half the per-token price, results within 24 hours (OpenAI Batch format).
# pip install openai ; export SMARTYPANTS_API_KEY=sp_live_...
import io, json, os, time
from openai import OpenAI

client = OpenAI(base_url="https://smartypants.network/v1", api_key=os.environ["SMARTYPANTS_API_KEY"])
lines = [{"custom_id": f"q{i}", "method": "POST", "url": "/v1/chat/completions",
          "body": {"model": "smartypants/qwen3.5-9b", "messages": [{"role": "user", "content": f"Give one fact about the number {i}."}]}}
         for i in range(3)]
f = client.files.create(file=("batch.jsonl", io.BytesIO("\n".join(map(json.dumps, lines)).encode())), purpose="batch")
batch = client.batches.create(input_file_id=f.id, endpoint="/v1/chat/completions", completion_window="24h")
while (batch := client.batches.retrieve(batch.id)).status not in ("completed", "failed", "expired", "cancelled"):
    time.sleep(60)
print(batch.status)
if batch.output_file_id:
    print(client.files.content(batch.output_file_id).text)
