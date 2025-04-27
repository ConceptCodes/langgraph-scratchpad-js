import path from "path";

import { graph } from "./agent/graph";
import { drawGraph, getRandomThreadId, prettifyOutput } from "../shared/utils";
import { Nodes } from "./helpers/constants";

const drawMafiaGraph = async () => {
  const filepath = path.join(__dirname, "assets", "graph.png");
  await drawGraph(graph, filepath);
  console.log("Graph image saved to:", filepath);
};

const config = { configurable: { thread_id: getRandomThreadId() } };

const run = async () => {
  // await drawMafiaGraph(); // Uncomment to draw graph on run

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
        { mafiaCount: parseInt(input) },
        {
          ...config,
          streamMode: "values", // Or "updates"
        }
      );

      for await (const chunk of await result) {
        console.log("--- Chunk ---");
        console.log(JSON.stringify(chunk, null, 2));
        // Example: Accessing a specific node's output
        // if (chunk.someNodeName) {
        //   prettifyOutput(JSON.stringify(chunk.someNodeName), "blue");
        // }
      }
      console.log("--- Stream End ---");
    } catch (error) {
      console.error("Error during graph execution:", error);
    }
  }
};

run().catch((error) => {
  console.error("Error running the mafia agent:", error);
});
