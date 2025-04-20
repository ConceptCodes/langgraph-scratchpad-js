# Langgraph Scratchpad

This repository serves as a scratchpad for experimenting with LangGraph. It contains various small projects aimed at exploring and understanding the LangGraph API.


## Getting Started
To get started with this project, you need to have [Bun](https://bun.sh) installed. You can install it by following the instructions on their website.

## Prerequisites
- [Bun](https://bun.sh) - A fast all-in-one JavaScript runtime.
- [Ollama](https://ollama.com/) - A local LLM server. You can install it by following the instructions on their website.

## Installation
To install the dependencies, run the following command in your terminal:
```bash
bun install
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

*** [Calendar Agent](src/calendar/readme.md) - A simple agent that can manage your calendar. It can add, remove, and update events. It can also check for conflicts and suggest times for meetings.