import { START, END, StateGraph, MemorySaver } from "@langchain/langgraph";

import { gatherRequirementsNode } from "../nodes/gather-requirements";
import { generateQueryNode } from "../nodes/generate-query";
import { isValidQueryNode } from "../nodes/is-valid-query";
import { executeQueryNode } from "../nodes/execute-query";
import { summarizeResultsNode } from "../nodes/summarize-results";

import { Nodes } from "../helpers/constants";
import { AgentStateAnnotation } from "../agent/state";

const workflow = new StateGraph(AgentStateAnnotation)
  .addNode(Nodes.GATHER_REQUIREMENTS, gatherRequirementsNode)
  .addNode(Nodes.GENERATE_QUERY, generateQueryNode)
  .addNode(Nodes.IS_VALID_QUERY, isValidQueryNode)
  .addNode(Nodes.EXECUTE_QUERY, executeQueryNode)
  .addNode(Nodes.SUMMARIZE_RESPONSE, summarizeResultsNode);

workflow.addEdge(START, Nodes.GATHER_REQUIREMENTS);
workflow.addEdge(Nodes.GATHER_REQUIREMENTS, Nodes.GENERATE_QUERY);
workflow.addEdge(Nodes.GENERATE_QUERY, Nodes.IS_VALID_QUERY);
workflow.addConditionalEdges(
  Nodes.IS_VALID_QUERY,
  (x: typeof AgentStateAnnotation.State) =>
    x.isValid ? "approved" : "rejected",
  {
    approved: Nodes.EXECUTE_QUERY,
    rejected: Nodes.GENERATE_QUERY,
  }
);
workflow.addEdge(Nodes.EXECUTE_QUERY, Nodes.SUMMARIZE_RESPONSE);
workflow.addEdge(Nodes.SUMMARIZE_RESPONSE, END);

export const graph = workflow.compile({
  name: "Calendar Agent",
  checkpointer: new MemorySaver(),
});
