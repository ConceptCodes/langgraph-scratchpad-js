import { START, END, StateGraph, MemorySaver } from "@langchain/langgraph";

import { Nodes } from "../helpers/constants";
import { AgentStateAnnotation } from "../agent/state";

import { generateResearchPlanNode } from "../nodes/generate-research-plan";
import { generateQueryNode } from "../nodes/generate-query";
import { webResearchNode } from "../nodes/web-search";
import { executePlanNode } from "../nodes/execute-plan";
import { summarizeSourcesNode } from "../nodes/summarize-sources";

const workflow = new StateGraph(AgentStateAnnotation)
  .addNode(Nodes.GENERATE_RESEARCH_PLAN, generateResearchPlanNode)
  .addNode(Nodes.GENERATE_QUERY, generateQueryNode)
  .addNode(Nodes.WEB_SEARCH, webResearchNode)
  .addNode(Nodes.SUMMARIZE_SOURCES, summarizeSourcesNode);

workflow.addEdge(START, Nodes.GENERATE_RESEARCH_PLAN);
workflow.addConditionalEdges(Nodes.GENERATE_RESEARCH_PLAN, executePlanNode, {
  [Nodes.GENERATE_QUERY]: Nodes.GENERATE_QUERY,
});
workflow.addEdge(Nodes.GENERATE_QUERY, Nodes.WEB_SEARCH);
workflow.addEdge(Nodes.WEB_SEARCH, Nodes.SUMMARIZE_SOURCES);
workflow.addEdge(Nodes.SUMMARIZE_SOURCES, END);

export const graph = workflow.compile({
  name: "Research Agent",
  checkpointer: new MemorySaver(),
});
