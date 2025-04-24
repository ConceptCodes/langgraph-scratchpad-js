# Langgraph Scratchpad

This repository serves as a scratchpad for experimenting with LangGraph. It contains various small projects aimed at exploring and understanding the LangGraph API.


## Prerequisites
- [Bun](https://bun.sh) - A fast all-in-one JavaScript runtime.
- [Ollama](https://ollama.com/) - A local LLM server. You can install it by following the instructions on their website.
   - gemma3:4b or gemma3:12b
- [OpenAI Api Key](https://platform.openai.com/docs/api-reference/authentication) - You can get your API key from the OpenAI website. 
- [Tavily Api Key](https://tavily.com/) - You can get your API key from the Tavily website. 

## Installation
To install the dependencies, run the following command in your terminal:
```bash
bun install
```

copy the `.env.example` file to `.env` and set your environment variables:

```bash
cp .env.example .env
```

## Usage
To run all of the agents in [LangGraph Studio](https://studio.langgraph.dev), you can use the following command:
```bash
bun run studio
```
This will start the LangGraph Studio, where you can interact with the agents and explore their capabilities.

To run a specific agent, you can use the following command:
```bash
bun run <agent_name>
```
This will execute the specified agent and display its output in the terminal.

### Agents

[Calendar Agent](src/calendar/README.md) - A simple agent that can manage your calendar. It can add, remove, and update events. It can also check for conflicts and suggest times for meetings.

[Research Agent](src/research/README.md) - A research agent that can help you find information on a specific topic. It can search for articles, summarize them, and provide you with a concise report.

[Podcast Agent](src/podcast/README.md) - A podcast agent that can generate a entire podcast episode based on given source material. 