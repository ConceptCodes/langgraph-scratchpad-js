import { START, END, StateGraph, MemorySaver } from "@langchain/langgraph";

import { Nodes } from "../helpers/constants";
import { AgentStateAnnotation, SectionStateAnnotation } from "../agent/state";

import { generateResearchPlanNode } from "../nodes/generate-research-plan";
import { generateQueryNode } from "../nodes/generate-query";
import { webResearchNode } from "../nodes/web-search";

const sectionGraph = new StateGraph(SectionStateAnnotation)
  .addNode(Nodes.GENERATE_QUERY, generateQueryNode)
  .addNode(Nodes.WEB_SEARCH, webResearchNode);

sectionGraph.addEdge(START, Nodes.GENERATE_QUERY);
sectionGraph.addEdge(Nodes.GENERATE_QUERY, Nodes.WEB_SEARCH)

const workflow = new StateGraph(AgentStateAnnotation)
  .addNode(Nodes.GENERATE_RESEARCH_PLAN, generateResearchPlanNode)
  .addNode(Nodes.EXECUTE_PLAN, sectionGraph.compile());

workflow.addEdge(START, Nodes.GENERATE_RESEARCH_PLAN);
workflow.addEdge(Nodes.GENERATE_RESEARCH_PLAN, Nodes.EXECUTE_PLAN);

export const graph = workflow.compile({
  name: "Research Agent",
  // checkpointer: new MemorySaver(),
});
