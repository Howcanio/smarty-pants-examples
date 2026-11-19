# pip install llama-index-llms-openai-like ; export SMARTYPANTS_API_KEY=sp_live_...
import os
from llama_index.llms.openai_like import OpenAILike

llm = OpenAILike(model="smartypants/qwen3.5-9b", api_base="https://smartypants.network/v1",
                 api_key=os.environ["SMARTYPANTS_API_KEY"], is_chat_model=True,
                 is_function_calling_model=True, context_window=16384)
print(llm.complete("One sentence on Apple silicon."))
