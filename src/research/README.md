# Research Agent Module

This module implements a LangGraph agent designed to automate the process of researching a given topic and generating a structured report.
Heavily inspired by the [LangSmith Research Agent](https://github.com/langchain-ai/open_deep_research)

Examples are provided in the `assets` directory.

## Architecture

![Research Agent Architecture](/src/research/assets/graph.png)

## Functionality

The agent performs the following steps:

1.  **Generate Research Plan:** Takes a user-provided topic and outlines a report structure. It generates initial web search queries, fetches context using Tavily search, and then uses an LLM to define the report sections, marking which ones require web research.
    *   Node: [`generateResearchPlanNode`](/src/research/nodes/generate-research-plan.ts)
    *   Prompts: [`reportPlannerQueryWriterInstructions`](/src/research/agent/prompts.ts), [`reportPlannerInstructions`](/src/research/agent/prompts.ts)
2.  **Build Sections with Web Research (Subgraph):** For each section identified as needing research:
    *   **Generate Queries:** Creates specific web search queries based on the section's title and description.
        *   Node: [`generateQueryNode`](/src/research/nodes/generate-query.ts)
        *   Prompt: [`queryWriterInstructions`](/src/research/agent/prompts.ts)
    *   **Web Search:** Executes the queries using Tavily search to gather source material.
        *   Node: [`webResearchNode`](/src/research/nodes/web-search.ts)
    *   **Write Section:** Drafts the section content using the gathered source material and LLM. It includes citations.
        *   Node: [`writeSectionNode`](/src/research/nodes/write-section.ts)
        *   Prompt: [`sectionWriterInstructions`](/src/research/agent/prompts.ts)
    *   **Grade Section:** Evaluates the written section. If inadequate, it generates follow-up queries and loops back to the Web Search step (up to a defined limit).
        *   Node: [`writeSectionNode`](/src/research/nodes/write-section.ts) (includes grading logic)
        *   Prompts: [`sectionGraderInstructions`](/src/research/agent/prompts.ts), [`sectionGraderPrompt`](/src/research/agent/prompts.ts)
3.  **Gather Completed Sections:** Collects the content from all successfully researched sections.
    *   Node: [`gatherCompletedSectionsNode`](/src/research/nodes/gather-completed-sections.ts)
4.  **Write Final Sections:** Writes sections that do not require web research (e.g., Introduction, Conclusion), using the previously researched content as context.
    *   Nodes: [`initiateFinalSectionWritingNode`](/src/research/nodes/initiate-final-section-writing.ts), [`writeFinalSectionsNode`](/src/research/nodes/write-final-sections.ts)
    *   Prompt: [`finalSectionWriterInstructions`](/src/research/agent/prompts.ts)
5.  **Compile Final Report:** Assembles all written sections into the final report document.
    *   Node: [`compileFinalSectionsNode`](/src/research/nodes/compile-final-report.ts)

## Core Components

*   **Graph Definition:** [`src/research/agent/graph.ts`](/src/research/agent/graph.ts) defines the main workflow and the research subgraph using LangGraph's `StateGraph`.
*   **State Management:** [`src/research/agent/state.ts`](/src/research/agent/state.ts) defines the data structures passed between nodes.
*   **Nodes:** Individual processing steps located in [`src/research/nodes/`](/src/research/nodes).
*   **Prompts:** LLM instructions are defined in [`src/research/agent/prompts.ts`](/src/research/agent/prompts.ts).
*   **Helpers:** Utility functions, constants, and type definitions are in [`src/research/helpers/`](/src/research/helpers).
*   **LLM Configuration:** The language model (currently OpenAI GPT-4o Mini) is configured in [`src/research/helpers/llm.ts`](/src/research/helpers/llm.ts).

## Prerequisites

*   Node.js and Bun installed.
*   Environment variables set for:
    *   `OPENAI_API_KEY`: Your OpenAI API key.
    *   `TAVILY_API_KEY`: Your Tavily Search API key.


You can also visualize and debug the graph using LangSmith Studio by running the following command:

```bash
bun run studio
```
This will start the LangGraph Studio, where you can interact with the agents and explore their capabilities.