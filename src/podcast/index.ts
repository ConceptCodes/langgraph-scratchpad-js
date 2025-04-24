import fs from "fs";
import path from "path";

import { graph } from "./agent/graph";
import { drawGraph } from "../shared/utils";
import { formatDraft } from "./helpers/utils";

const drawPodcastGraph = async () => {
  const filepath = path.join(__dirname, "assets", "graph.png");
  await drawGraph(graph, filepath);
  console.log("Graph image saved to:", filepath);
};

const run = async () => {
  // await drawPodcastGraph(); // Uncomment to draw graph on run

  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Please provide the path to the source material file.");
    process.exit(1);
  }
  const sourceMaterial = fs.readFileSync(filePath, "utf-8");
  console.log("Source material content length", sourceMaterial.length);

  try {
    const result = await graph.invoke({ sourceMaterial });
    const formattedScript = formatDraft(result.script!);
    const outputPath = path.join(__dirname, "assets", "script.txt");

    fs.writeFileSync(outputPath, formattedScript);
    console.log("Result saved to:", outputPath);
  } catch (error) {
    console.error("Error during graph execution:", error);
  }
};

run().catch((error) => {
  console.error("Error running the podcast agent:", error);
});
