import path from "path";
import { HumanMessage } from "@langchain/core/messages";

import { graph } from "./agent/graph";
import { drawGraph, getRandomThreadId, prettifyOutput } from "../shared/utils";
import { Nodes } from "./helpers/constants"; // Uncomment when constants are defined

const drawOrderEntryGraph = async () => {
  const filepath = path.join(__dirname, "assets", "graph.png");
  await drawGraph(graph, filepath);
  console.log("Graph image saved to:", filepath);
};

const config = { configurable: { thread_id: getRandomThreadId() } };

const run = async () => {
  // await drawOrderEntryGraph(); // Uncomment to draw graph on run

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
  console.error("Error running the order-entry agent:", error);
  // Add any cleanup logic here (e.g., closeDb())
});
