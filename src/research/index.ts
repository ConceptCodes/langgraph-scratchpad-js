import path from "path";
import fs from "fs";

import { drawGraph } from "../shared/utils";
import { graph } from "./agent/graph";

const drawResearchGraph = async () => {
  const filepath = path.join(__dirname, "assets", "graph.png");
  await drawGraph(graph, filepath);
};

const run = async () => {
  // await drawResearchGraph()

  const topic = prompt("Enter the topic of the research: ");

  if (!topic) {
    console.log("No topic provided. Exiting...");
    return;
  }

  console.log("Starting research on topic:", topic);
  const start = Date.now();
  const results = await graph.invoke({ topic });
  const end = Date.now();
  console.log(`Research completed in ${(end - start) / 1000} seconds`);

  const cleanTitle = topic.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

  console.log("Saving report");
  console.log("Final Report Length:", results.finalReport.length);

  fs.writeFileSync(
    path.join(__dirname, "assets", `${cleanTitle}.md`),
    results.finalReport
  );
  console.log(`Report saved to ./assets/${cleanTitle}.md`);
};

run().catch((error) => {
  console.error("Error running the research agent:", error);
});
