# Calendar Agent Module

This module implements a LangGraph agent designed to manage calendar events based on natural language requests. It can schedule, update, read, and delete events, interacting with the user to clarify requirements when necessary.

## Architecture

The calendar agent uses LangGraph to orchestrate interactions between an LLM, a user, and a SQLite database storing event information.

![Calendar Agent Architecture](/src/calendar/assets/graph.png)

## Functionality

The agent follows these steps:

1.  **Route Request:** Determines if the user's request is a general query or requires calendar actions (CRUD operations).
    *   Node: [`routerNode`](/src/calendar/nodes/router.ts)
2.  **Handle General Query (If Applicable):** Responds to general, non-calendar-related questions.
    *   Node: [`generalNode`](/src/calendar/nodes/general.ts)
3.  **Gather Requirements (If Calendar Action):** Analyzes the user request and chat history to identify necessary event details (title, time, etc.). If details are missing or ambiguous, it interrupts the flow to ask the user follow-up questions.
    *   Node: [`gatherRequirementsNode`](/src/calendar/nodes/gather-requirements.ts)
    *   Prompts: [`systemMessagePrompt`](/src/calendar/agent/prompts.ts), [`gatherRequirementsPrompt`](/src/calendar/agent/prompts.ts)
4.  **Generate SQL Query:** Translates the user's request and gathered details into a SQL query for the event database.
    *   Node: [`generateQueryNode`](/src/calendar/nodes/generate-query.ts)
    *   Prompt: [`generateQueryPrompt`](/src/calendar/agent/prompts.ts) (Implicitly used within the node)
5.  **Validate SQL Query:** Checks the generated SQL query for potential issues or safety concerns before execution. If invalid, it loops back to regenerate the query.
    *   Node: [`isValidQueryNode`](/src/calendar/nodes/is-valid-query.ts)
    *   Prompt: [`validateQueryPrompt`](/src/calendar/agent/prompts.ts) (Implicitly used within the node)
6.  **Execute SQL Query:** Runs the validated SQL query against the SQLite database. If an error occurs, it loops back to regenerate the query.
    *   Node: [`executeQueryNode`](/src/calendar/nodes/execute-query.ts)
7.  **Summarize Response:** Formulates a natural language response to the user based on the outcome of the database operation (success, data retrieved, etc.).
    *   Node: [`summarizeResultsNode`](/src/calendar/nodes/summarize-results.ts)
    *   Prompt: [`summarizeResponsePrompt`](/src/calendar/agent/prompts.ts) (Implicitly used within the node)

## Core Components

*   **Graph Definition:** [`src/calendar/agent/graph.ts`](/src/calendar/agent/graph.ts) defines the workflow using LangGraph's `StateGraph`.
*   **State Management:** [`src/calendar/agent/state.ts`](/src/calendar/agent/state.ts) defines the data structures passed between nodes.
*   **Nodes:** Individual processing steps located in [`src/calendar/nodes/`](/src/calendar/nodes).
*   **Prompts:** LLM instructions are defined in [`src/calendar/agent/prompts.ts`](/src/calendar/agent/prompts.ts).
*   **Helpers:** Utility functions, constants, database interactions (TypeORM with SQLite), and LLM configuration are in [`src/calendar/helpers/`](/src/calendar/helpers).

## Prerequisites

*   Node.js and Bun installed.
*   Environment variables set for:
    *   `OPENAI_API_KEY`: Your OpenAI API key.
*   A local SQLite database file (`calendar.sqlite`) will be created automatically in the project root if it doesn't exist.

## Usage

You can run the interactive calendar agent using the entry point script:

```bash
bun run calendar
```

This script initializes the database connection, sets up the graph, and enters a loop prompting the user for input. It streams updates from the graph execution and handles interruptions for follow-up questions.


You can also visualize and debug the graph using LangSmith Studio by running the following command:

```bash
bun run studio
```
This will start the LangGraph Studio, where you can interact with the agents and explore their capabilities.

## Roadmap

*   [x] Add a conditional edge for execute query to jump back to generate query on failure.
*   [ ] Implement weather checking functionality.
*   [ ] Implement conflict checking and meeting time suggestions.