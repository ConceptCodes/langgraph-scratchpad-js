import { START, StateGraph } from "@langchain/langgraph";

import {
  AgentStateAnnotation,
  InputStateAnnotation,
  OutputStateAnnotation,
} from "./state";
import { Nodes } from "../helpers/constants";

import { generatePlanNode } from "../nodes/generate-plan";
import { reviewPlanNode } from "../nodes/review-plan";
import { assignTaskNode } from "../nodes/assign-task";

// TODO: Web Search Subgraph
// TODO: SQL Subgraph

const workflow = new StateGraph({
  stateSchema: AgentStateAnnotation,
  input: InputStateAnnotation,
  output: OutputStateAnnotation,
})
  .addNode(Nodes.GENERATE_PLAN, generatePlanNode)
  .addNode(Nodes.REVIEW_PLAN, reviewPlanNode, {
    ends: [Nodes.GENERATE_PLAN, Nodes.ASSIGN_TASK],
  })
  .addNode(Nodes.ASSIGN_TASK, assignTaskNode);

workflow.addEdge(START, Nodes.GENERATE_PLAN);
workflow.addEdge(Nodes.GENERATE_PLAN, Nodes.REVIEW_PLAN);

export const graph = workflow.compile({
  name: "Planner Agent",
});
