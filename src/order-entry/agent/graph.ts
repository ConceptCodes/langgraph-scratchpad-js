import { START, StateGraph, MemorySaver, END } from "@langchain/langgraph";

import {
  AgentStateAnnotation,
  ConfigurationAnnotation,
  OutputStateAnnotation,
} from "./state";
import { Nodes } from "../helpers/constants";
import { initializeDatabase } from "../helpers/db";
import { welcomeMessageNode } from "../nodes/welcome-message";
import { audioInputNode } from "../nodes/audio-input";
import { audioOutputNode } from "../nodes/audio-output";
import { parseIntentNode } from "../nodes/parse-intent";
import { itemSelectionNode } from "../nodes/item-selection";
import { modifyOrderNode } from "../nodes/modify-order";
import { reviewOrderNode } from "../nodes/review-order";
import { confirmOrderNode } from "../nodes/confirm-order";
import { checkInventoryNode } from "../nodes/check-inventory";

await initializeDatabase();

const workflow = new StateGraph(
  {
    stateSchema: AgentStateAnnotation,
    output: OutputStateAnnotation,
  },
  ConfigurationAnnotation
)
  .addNode(Nodes.AUDIO_INPUT, audioInputNode)
  .addNode(Nodes.AUDIO_OUTPUT, audioOutputNode, {
    ends: [Nodes.AUDIO_INPUT, END],
  })
  .addNode(Nodes.WELCOME_MESSAGE, welcomeMessageNode)
  .addNode(Nodes.PARSE_INTENT, parseIntentNode, {
    ends: [Nodes.ITEM_SELECTION, Nodes.MODIFY_ORDER, Nodes.CONFIRM_ORDER],
  })
  .addNode(Nodes.ITEM_SELECTION, itemSelectionNode, {
    ends: [Nodes.CHECK_INVENTORY, Nodes.REVIEW_ORDER],
  })
  .addNode(Nodes.CHECK_INVENTORY, checkInventoryNode, {
    ends: [Nodes.ITEM_SELECTION, Nodes.MODIFY_ORDER],
  })
  .addNode(Nodes.REVIEW_ORDER, reviewOrderNode)
  .addNode(Nodes.MODIFY_ORDER, modifyOrderNode, {
    ends: [Nodes.CHECK_INVENTORY, Nodes.REVIEW_ORDER],
  })
  .addNode(Nodes.CONFIRM_ORDER, confirmOrderNode);

workflow.addEdge(START, Nodes.WELCOME_MESSAGE);
workflow.addEdge(Nodes.WELCOME_MESSAGE, Nodes.AUDIO_OUTPUT);
workflow.addEdge(Nodes.AUDIO_INPUT, Nodes.PARSE_INTENT);
workflow.addEdge(Nodes.CONFIRM_ORDER, Nodes.AUDIO_OUTPUT);

export const graph = workflow.compile({
  name: "Order Entry Agent",
  checkpointer: new MemorySaver(),
});
