import { START, StateGraph, MemorySaver } from "@langchain/langgraph";

import { AgentStateAnnotation, InputStateAnnotation } from "./state";
import { Nodes } from "../helpers/constants";
import { callModelNode } from "../nodes/agent";
import { toolNode } from "../nodes/tools";
import { shouldContinue } from "../nodes/should-continue";

const workflow = new StateGraph({
  stateSchema: AgentStateAnnotation,
  input: InputStateAnnotation,
})
  .addNode(Nodes.AGENT, callModelNode)
  .addNode(Nodes.TOOL, toolNode);

workflow.addEdge(START, Nodes.AGENT);
workflow.addConditionalEdges(Nodes.AGENT, shouldContinue);
workflow.addEdge(Nodes.TOOL, Nodes.AGENT);

export const graph = workflow.compile({
  name: "React Agent",
  checkpointer: new MemorySaver(),
});
