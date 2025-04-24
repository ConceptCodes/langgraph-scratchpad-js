# Podcast Agent Module

This module implements a LangGraph agent designed to automatically generate a complete podcast episode, including script and audio, from provided source material.

## Architecture

The agent utilizes LangGraph to define and execute a multi-step workflow. It involves several nodes for specific tasks like insight extraction, outlining, drafting, reviewing, and audio generation. Parallel execution is employed for building individual podcast sections concurrently.

<!-- ![Podcast Agent Architecture](/src/podcast/assets/graph.png) -->
*(Diagram to be added)*

## Functionality

The agent performs the following steps:

1.  **Extract Key Insights:** Analyzes the input `sourceMaterial` to identify key `topics`, `quotes`, and `insights` ([`src/podcast/nodes/extract-key-insights.ts`](/src/podcast/nodes/extract-key-insights.ts)).
2.  **Coverage Check:** Reviews the extracted insights against the source material to ensure completeness ([`src/podcast/nodes/coverage-check.ts`](/src/podcast/nodes/coverage-check.ts)). Loops back to extraction if coverage is insufficient.
3.  **Generate Outline:** Creates a structured `PodcastOutline` based on the verified insights ([`src/podcast/nodes/generate-outline.ts`](/src/podcast/nodes/generate-outline.ts)).
4.  **Review Outline:** Assesses the generated outline for quality and coherence ([`src/podcast/nodes/review-outline.ts`](/src/podcast/nodes/review-outline.ts)). Loops back to outline generation if revisions are needed.
5.  **Build All Sections (Dispatch):** Prepares and dispatches tasks to build each section (intro, main segments, summary, outro) in parallel ([`src/podcast/nodes/build-all-sections.ts`](/src/podcast/nodes/build-all-sections.ts)).
6.  **Build Section (Subgraph):** Each parallel task runs a subgraph:
    *   **Generate Draft:** Writes the script for a specific section ([`src/podcast/nodes/generate-draft.ts`](/src/podcast/nodes/generate-draft.ts)).
    *   **Review Draft:** Reviews the section draft ([`src/podcast/nodes/review-draft.ts`](/src/podcast/nodes/review-draft.ts)). Loops back to drafting if revisions are needed. Completed sections are added to the `completedSections` state.
7.  **Build Episode:** Once all sections are complete, compiles the final `script` from `completedSections` ([`src/podcast/nodes/build-episode.ts`](/src/podcast/nodes/build-episode.ts)).
8.  **Generate Audio:** Creates an MP3 audio file from the final script using a text-to-speech service ([`src/podcast/nodes/generate-audio.ts`](/src/podcast/nodes/generate-audio.ts)).

## Core Components

*   **Graph Definition:** [`src/podcast/agent/graph.ts`](/src/podcast/agent/graph.ts) - Defines the main workflow and subgraph connections.
*   **State Management:** [`src/podcast/agent/state.ts`](/src/podcast/agent/state.ts) - Defines the structure of the data passed between nodes.
*   **Nodes:** [`src/podcast/nodes/`](/src/podcast/nodes/) - Contains the functions executed at each step of the graph.
*   **Prompts:** [`src/podcast/agent/prompts.ts`](/src/podcast/agent/prompts.ts) - Stores the LLM prompts used by various nodes.
*   **Helpers:** [`src/podcast/helpers/`](/src/podcast/helpers/) - Includes utility functions, type definitions ([`types.ts`](/src/podcast/helpers/types.ts)), and constants ([`constants.ts`](/src/podcast/helpers/constants.ts)).

## Prerequisites

*   Node.js and Bun installed.
*   OpenAI API Key: Ensure the `OPENAI_API_KEY` environment variable is set for LLM calls and audio generation.

## Usage

1.  Install dependencies:
    ```bash
    bun install
    ```
2.  Run the agent:
    ```bash
    bun run podcast <path-to-source-material>
    ```
3.  Enter the source material when prompted. The final script (`script.txt`) and audio (`output.mp3`) will be saved in the `src/podcast/assets/` directory.

## To Do

*   Add architecture diagram.
*   Implement error handling more robustly within nodes.
*   Add unit/integration tests.
