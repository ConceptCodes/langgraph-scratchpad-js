import { START, StateGraph, MemorySaver } from "@langchain/langgraph";

import {
  AgentStateAnnotation,
  ConfigurationAnnotation,
  OutputStateAnnotation,
} from "./state";
import { Nodes } from "../helpers/constants";
import { welcomeMessageNode } from "../nodes/welcome-message";
import { audioInputNode } from "../nodes/audio-input";
import { audioOutputNode } from "../nodes/audio-output";
import { parseIntentNode } from "../nodes/parse-intent";
import { itemSelectionNode } from "../nodes/item-selection";
import { modifyOrderNode } from "../nodes/modify-order";
import { reviewOrderNode } from "../nodes/review-order";
import { initializeDatabase } from "../helpers/db";

await initializeDatabase();

const workflow = new StateGraph(
  {
    stateSchema: AgentStateAnnotation,
    output: OutputStateAnnotation,
  },
  ConfigurationAnnotation
)
  .addNode(Nodes.AUDIO_INPUT, audioInputNode)
  .addNode(Nodes.AUDIO_OUTPUT, audioOutputNode)
  .addNode(Nodes.WELCOME_MESSAGE, welcomeMessageNode)
  .addNode(Nodes.PARSE_INTENT, parseIntentNode, {
    ends: [Nodes.ITEM_SELECTION, Nodes.MODIFY_ORDER, Nodes.REVIEW_ORDER],
  })
  .addNode(Nodes.ITEM_SELECTION, itemSelectionNode)
  .addNode(Nodes.REVIEW_ORDER, reviewOrderNode)
  .addNode(Nodes.MODIFY_ORDER, modifyOrderNode);

workflow.addEdge(START, Nodes.WELCOME_MESSAGE);
workflow.addEdge(Nodes.WELCOME_MESSAGE, Nodes.AUDIO_OUTPUT);
workflow.addEdge(Nodes.AUDIO_OUTPUT, Nodes.AUDIO_INPUT);
workflow.addEdge(Nodes.AUDIO_INPUT, Nodes.PARSE_INTENT);

export const graph = workflow.compile({
  name: "Order Entry Agent",
  checkpointer: new MemorySaver(),
});
