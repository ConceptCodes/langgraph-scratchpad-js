#!/bin/bash

# Check if module name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <module_name>"
  exit 1
fi

MODULE_NAME=$1
MODULE_PATH="src/$MODULE_NAME"
LANGGRAPH_JSON="langgraph.json"
PACKAGE_JSON="package.json"

# --- Create capitalized version ---
# Get the first character, uppercase it
FIRST_CHAR=$(echo "${MODULE_NAME:0:1}" | tr '[:lower:]' '[:upper:]')
# Get the rest of the string
REST_OF_NAME="${MODULE_NAME:1}"
# Combine them
CAPITALIZED_MODULE_NAME="${FIRST_CHAR}${REST_OF_NAME}"
# --- End capitalized version ---


# Check if module directory already exists
if [ -d "$MODULE_PATH" ]; then
  echo "Error: Module directory '$MODULE_PATH' already exists."
  exit 1
fi

echo "Scaffolding module: $MODULE_NAME in $MODULE_PATH..."

# Create directory structure
mkdir -p "$MODULE_PATH/agent"
mkdir -p "$MODULE_PATH/nodes"
mkdir -p "$MODULE_PATH/helpers"
mkdir -p "$MODULE_PATH/assets"

# Create placeholder files with minimal content

# --- index.ts ---
cat <<EOF > "$MODULE_PATH/index.ts"
// filepath: ${MODULE_PATH}/index.ts
import path from "path";
import { HumanMessage } from "@langchain/core/messages";

import { graph } from "./agent/graph";
import { drawGraph, getRandomThreadId, prettifyOutput } from "../shared/utils";
// import { Nodes } from "./helpers/constants"; // Uncomment when constants are defined

const draw${CAPITALIZED_MODULE_NAME}Graph = async () => {
  const filepath = path.join(__dirname, "assets", "graph.png");
  await drawGraph(graph, filepath);
  console.log("Graph image saved to:", filepath);
};

const config = { configurable: { thread_id: getRandomThreadId() } };

const run = async () => {
  // await draw${CAPITALIZED_MODULE_NAME}Graph(); // Uncomment to draw graph on run

  let isRunning = true;
  while (isRunning) {
    const input = prompt("Input: ");

    if (!input || input.toLowerCase() === 'exit') {
      console.log("Exiting...");
      isRunning = false;
      break;
    }

    try {
      const result = graph.stream(
        { messages: [new HumanMessage({ content: input })] },
        {
          ...config,
          streamMode: "values", // Or "updates"
        }
      );

      for await (const chunk of await result) {
        // Process streamed chunks - adjust based on your state/output
        console.log("--- Chunk ---");
        console.log(JSON.stringify(chunk, null, 2));
        // Example: Accessing a specific node's output
        // if (chunk.someNodeName) {
        //   prettifyOutput(JSON.stringify(chunk.someNodeName), "blue");
        // }
      }
      console.log("--- Stream End ---");

      // Or invoke directly for final result
      // const finalResult = await graph.invoke(
      //   { messages: [new HumanMessage({ content: input })] },
      //   config
      // );
      // console.log("--- Final Result ---");
      // console.log(JSON.stringify(finalResult, null, 2));

    } catch (error) {
      console.error("Error during graph execution:", error);
    }
  }
};

run().catch((error) => {
  console.error("Error running the ${MODULE_NAME} agent:", error);
  // Add any cleanup logic here (e.g., closeDb())
});
EOF

# --- README.md ---
cat <<EOF > "$MODULE_PATH/README.md"
# ${CAPITALIZED_MODULE_NAME} Agent Module

Description of the ${MODULE_NAME} agent.

## Architecture

(Add architecture details and diagram later)
<!-- ![${CAPITALIZED_MODULE_NAME} Agent Architecture](/src/${MODULE_NAME}/assets/graph.png) -->

## Functionality

(Describe the steps the agent takes)

## Core Components

*   **Graph Definition:** [\`src/${MODULE_NAME}/agent/graph.ts\`](/src/${MODULE_NAME}/agent/graph.ts)
*   **State Management:** [\`src/${MODULE_NAME}/agent/state.ts\`](/src/${MODULE_NAME}/agent/state.ts)
*   **Nodes:** [\`src/${MODULE_NAME}/nodes/\`](/src/${MODULE_NAME}/nodes)
*   **Prompts:** [\`src/${MODULE_NAME}/agent/prompts.ts\`](/src/${MODULE_NAME}/agent/prompts.ts)
*   **Helpers:** [\`src/${MODULE_NAME}/helpers/\`](/src/${MODULE_NAME}/helpers)

## Prerequisites

*   Node.js and Bun installed.
*   Environment variables set (if needed).

## Usage

\`\`\`bash
bun run ${MODULE_NAME}
\`\`\`
EOF

# --- agent/graph.ts ---
cat <<EOF > "$MODULE_PATH/agent/graph.ts"
// filepath: ${MODULE_PATH}/agent/graph.ts
import { START, END, StateGraph, MemorySaver } from "@langchain/langgraph";

import { AgentStateAnnotation, InputStateAnnotation, OutputStateAnnotation } from "./state";
// import { Nodes } from "../helpers/constants"; // Uncomment when constants are defined
// import { placeholderNode } from "../nodes/placeholder"; // Import your nodes

const workflow = new StateGraph({
  stateSchema: AgentStateAnnotation,
  input: InputStateAnnotation,
  output: OutputStateAnnotation, // Define if you have a specific output shape
});

// Add nodes
// workflow.addNode(Nodes.PLACEHOLDER, placeholderNode);

// Define edges
// workflow.addEdge(START, Nodes.PLACEHOLDER);
// workflow.addEdge(Nodes.PLACEHOLDER, END);
workflow.addEdge(START, END); // Minimal graph: START -> END

export const graph = workflow.compile({
  name: "${CAPITALIZED_MODULE_NAME} Agent",
  checkpointer: new MemorySaver(), // Or configure persistence
});
EOF

# --- agent/state.ts ---
cat <<EOF > "$MODULE_PATH/agent/state.ts"
// filepath: ${MODULE_PATH}/agent/state.ts
import { BaseMessage } from "@langchain/core/messages";
import { Annotation, END } from "@langchain/langgraph";

// Define the input shape for the graph
export const InputStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  // Add other input fields as needed
});

// Define the output shape for the graph (optional)
export const OutputStateAnnotation = Annotation.Root({
  output: Annotation<any>({ // Replace 'any' with a specific type
     reducer: (a, b) => b ?? a,
     default: () => null,
  }),
  // Add other output fields as needed
});

// Define the full state that flows through the graph
export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,
  ...OutputStateAnnotation.spec, // Include if defined
  // Add intermediate state fields
  next: Annotation<string>({ // Example for conditional edges
    reducer: (a, b) => b ?? a ?? END,
    default: () => "",
  }),
});
EOF

# --- agent/prompts.ts ---
cat <<EOF > "$MODULE_PATH/agent/prompts.ts"
// filepath: ${MODULE_PATH}/agent/prompts.ts

// Define your LLM prompts here
// export const examplePrompt = (input: string) => \`Your prompt text with \${input}\`;
EOF

# --- nodes/placeholder.ts ---
cat <<EOF > "$MODULE_PATH/nodes/placeholder.ts"
// filepath: ${MODULE_PATH}/nodes/placeholder.ts
import type { AgentStateAnnotation } from "../agent/state";

// Example node function
export const placeholderNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<Partial<typeof AgentStateAnnotation.State>> => {
  console.log("Executing placeholder node");
  const lastMessage = state.messages.at(-1)?.content;
  console.log("Last message:", lastMessage);

  // Return updates to the state
  return {
    output: \`Processed: \${lastMessage}\`,
    // next: "some_other_node" // Example for conditional edges
  };
};
EOF

# --- helpers/constants.ts ---
cat <<EOF > "$MODULE_PATH/helpers/constants.ts"
// filepath: ${MODULE_PATH}/helpers/constants.ts

// Define constants like node names
// export enum Nodes {
//   PLACEHOLDER = "PLACEHOLDER",
//   // Add other node names
// }
EOF

# --- helpers/llm.ts ---
cat <<EOF > "$MODULE_PATH/helpers/llm.ts"
// filepath: ${MODULE_PATH}/helpers/llm.ts
// Configure your language model connection
import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// Choose and configure your LLM
// Option 1: Ollama (Local)
// export const llm = new ChatOllama({
//   model: "gemma3:12b", // Or your preferred local model
//   temperature: 0,
// });

// Option 2: OpenAI (Requires API Key in .env)
export const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini", // Or your preferred OpenAI model
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Add other LLM configurations or clients if needed
EOF

# --- helpers/types.ts ---
cat <<EOF > "$MODULE_PATH/helpers/types.ts"
// filepath: ${MODULE_PATH}/helpers/types.ts

// Define any custom types needed for your module state or nodes
// export type ExampleType = {
//   id: string;
//   value: number;
// };
EOF

echo "Module structure created."

# Update langgraph.json using jq
if command -v jq &> /dev/null; then
  jq --arg name "$MODULE_NAME" --arg path "./src/$MODULE_NAME/agent/graph.ts:graph" \
     '.graphs[$name] = $path' "$LANGGRAPH_JSON" > tmp.$$.json && mv tmp.$$.json "$LANGGRAPH_JSON"
  echo "Updated $LANGGRAPH_JSON"
else
  echo "Warning: jq is not installed. Could not automatically update $LANGGRAPH_JSON."
  echo "Please add the following entry manually to the 'graphs' object in $LANGGRAPH_JSON:"
  echo "  \"$MODULE_NAME\": \"./src/$MODULE_NAME/agent/graph.ts:graph\""
fi

# Update package.json using jq
if command -v jq &> /dev/null; then
    jq --arg name "$MODULE_NAME" --arg cmd "bun run src/$MODULE_NAME/index.ts" \
       '.scripts[$name] = $cmd' "$PACKAGE_JSON" > tmp.$$.json && mv tmp.$$.json "$PACKAGE_JSON"
    echo "Updated $PACKAGE_JSON with script '$MODULE_NAME'"
else
    echo "Warning: jq is not installed. Could not automatically update $PACKAGE_JSON."
    echo "Please add the following script manually to the 'scripts' object in $PACKAGE_JSON:"
    echo "  \"$MODULE_NAME\": \"bun run src/$MODULE_NAME/index.ts\""
fi


echo "Scaffolding complete for module: $MODULE_NAME"
echo "Next steps:"
echo "1. Implement your agent logic in the created files."
echo "2. Define state, nodes, prompts, and constants."
echo "3. Run 'bun install' if you added new dependencies."
echo "4. Run your agent using: bun run $MODULE_NAME"
echo "5. Test with LangGraph Studio: bun run studio"
