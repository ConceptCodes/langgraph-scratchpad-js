import fs from "fs";
import path from "path";

import { graph } from "./agent/graph";
import { drawGraph } from "../shared/utils";

const drawPodcastGraph = async () => {
  const filepath = path.join(__dirname, "assets", "graph.png");
  await drawGraph(graph, filepath);
  console.log("Graph image saved to:", filepath);
};

const run = async () => {
  // await drawPodcastGraph(); // Uncomment to draw graph on run

  let isRunning = true;
  while (isRunning) {
    const input = prompt("Input: ");

    if (!input || input.toLowerCase() === "exit") {
      console.log("Exiting...");
      isRunning = false;
      break;
    }

    try {
      const result = graph.invoke({ sourceMaterial: input });

      fs.writeFileSync(
        path.join(__dirname, "assets", "result.json"),
        JSON.stringify(result, null, 2)
      );
      console.log(
        "Result saved to:",
        path.join(__dirname, "assets", "result.json")
      );
    } catch (error) {
      console.error("Error during graph execution:", error);
    }
  }
};

run().catch((error) => {
  console.error("Error running the podcast agent:", error);
});
