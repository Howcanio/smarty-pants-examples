# pip install openai-agents ; export SMARTYPANTS_API_KEY=sp_live_...
import os
from openai import AsyncOpenAI
from agents import Agent, Runner, OpenAIChatCompletionsModel, set_tracing_disabled

set_tracing_disabled(True)   # tracing would need an OpenAI key
client = AsyncOpenAI(base_url="https://smartypants.network/v1", api_key=os.environ["SMARTYPANTS_API_KEY"])
agent = Agent(name="helper", instructions="Answer in one short paragraph.",
              model=OpenAIChatCompletionsModel(model="smartypants/qwen3.5-9b", openai_client=client))
print(Runner.run_sync(agent, "What is an exact model build?").final_output)
