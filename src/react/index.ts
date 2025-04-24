import path from "path";
import { HumanMessage } from "@langchain/core/messages";

import { graph } from "./agent/graph";
import { drawGraph, getRandomThreadId, prettifyOutput } from "../shared/utils";

const drawReactGraph = async () => {
  const filepath = path.join(__dirname, "assets", "graph.png");
  await drawGraph(graph, filepath);
  console.log("Graph image saved to:", filepath);
};

const config = { configurable: { thread_id: getRandomThreadId() } };

const run = async () => {
  // await drawReactGraph(); // Uncomment to draw graph on run

  let isRunning = true;
  while (isRunning) {
    const input = prompt("Input: ");

    if (!input || input.toLowerCase() === "exit") {
      console.log("Exiting...");
      isRunning = false;
      break;
    }

    try {
      const result = graph.stream(
        { messages: [new HumanMessage({ content: input })] },
        {
          ...config,
          streamMode: "values",
        }
      );

      for await (const chunk of await result) {
        console.log("--- Chunk ---");
        console.log(JSON.stringify(chunk, null, 2));
      }
      console.log("--- Stream End ---");
    } catch (error) {
      console.error("Error during graph execution:", error);
    }
  }
};

run().catch((error) => {
  console.error("Error running the react agent:", error);
});
