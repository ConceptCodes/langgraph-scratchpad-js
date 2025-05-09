import path from "path";
import { HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";

import { graph } from "./agent/graph";
import { drawGraph, getRandomThreadId, prettifyOutput } from "../shared/utils";
import { closeDb, initializeDataSource } from "./helpers/db";
import { Nodes } from "./helpers/constants";

const drawCalendarGraph = async () => {
  const filepath = path.join(__dirname, "assets", "graph.png");
  drawGraph(graph, filepath);
};

const config = { configurable: { thread_id: getRandomThreadId() } };

await initializeDataSource();

const run = async () => {
  // drawCalendarGraph();

  let isRunning = true;
  while (isRunning) {
    const input = prompt("Question: ");

    if (!input) {
      console.log("No input provided. Exiting...");
      isRunning = false;
      break;
    }

    let result = graph.stream(
      { messages: [new HumanMessage({ content: input })] },
      {
        ...config,
        streamMode: "updates",
      }
    );

    // NOTE: the output is not always streamed
    for await (const chunk of await result) {
      if (!chunk.__end__) {
        // TODO: investigate why this is not always logged
        if (chunk[Nodes.SUMMARIZE_RESPONSE]) {
          const message = chunk[Nodes.SUMMARIZE_RESPONSE].messages[0].content;
          prettifyOutput(message, "green");
        }
        if (chunk.__interrupt__) {
          const question = chunk.__interrupt__[0].value;
          prettifyOutput(question, "red");
          const input = prompt("Question: ");
          await graph.invoke(new Command({ resume: input }), config);
        }
      }
    }
  }
};

run().catch((error) => {
  console.error("Error running the calendar agent:", error);
  closeDb();
});
