# pip install langchain-openai ; export SMARTYPANTS_API_KEY=sp_live_...
import os
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

llm = ChatOpenAI(model="smartypants/qwen3.5-9b", base_url="https://smartypants.network/v1",
                 api_key=os.environ["SMARTYPANTS_API_KEY"], max_retries=3)
print(llm.invoke("Summarize: Macs can serve open models.").content)

emb = OpenAIEmbeddings(model="smartypants/qwen3-embedding-0.6b", base_url="https://smartypants.network/v1",
                       api_key=os.environ["SMARTYPANTS_API_KEY"], check_embedding_ctx_length=False)
print(len(emb.embed_query("hello")))
