import { START, END, StateGraph } from "@langchain/langgraph";

import { Nodes } from "../helpers/constants";
import {
  AgentStateAnnotation,
  InputStateAnnotation,
  SectionStateAnnotation,
  SectionOutputStateAnnotation,
  OutputStateAnnotation,
} from "../agent/state";

import { generateResearchPlanNode } from "../nodes/generate-research-plan";
import { generateQueryNode } from "../nodes/generate-query";
import { webResearchNode } from "../nodes/web-search";
import { executePlanNode } from "../nodes/execute-plan";
import { summarizeSourcesNode } from "../nodes/summarize-sources";
import { writeSectionNode } from "../nodes/write-section";
import { gatherCompletedSectionsNode } from "../nodes/gather-completed-sections";
import { writeFinalSectionsNode } from "../nodes/write-final-sections";
import { initiateFinalSectionWritingNode } from "../nodes/initiate-final-section-writing";

const subGraph = new StateGraph({
  stateSchema: SectionStateAnnotation,
  output: SectionOutputStateAnnotation,
})
  .addNode(Nodes.GENERATE_QUERY, generateQueryNode)
  .addNode(Nodes.WEB_SEARCH, webResearchNode)
  .addNode(Nodes.WRITE_SECTION, writeSectionNode)

  .addEdge(START, Nodes.GENERATE_QUERY)
  .addEdge(Nodes.GENERATE_QUERY, Nodes.WEB_SEARCH)
  .addEdge(Nodes.WEB_SEARCH, Nodes.WRITE_SECTION)
  .compile();

const workflow = new StateGraph({
  stateSchema: AgentStateAnnotation,
  input: InputStateAnnotation,
  output: OutputStateAnnotation,
})
  .addNode(Nodes.GENERATE_RESEARCH_PLAN, generateResearchPlanNode)
  .addNode(Nodes.EXECUTE_PLAN, executePlanNode, { ends: [Nodes.BUILD_SECTION]})
  .addNode(Nodes.BUILD_SECTION, subGraph)
  .addNode(Nodes.GATHER_COMPLETED_SECTIONS, gatherCompletedSectionsNode)
  .addNode(Nodes.WRITE_FINAL_SECTIONS, writeFinalSectionsNode)
  .addNode(Nodes.COMPILE_FINAL_REPORT, summarizeSourcesNode);

workflow.addEdge(START, Nodes.GENERATE_RESEARCH_PLAN);
workflow.addEdge(Nodes.GENERATE_RESEARCH_PLAN, Nodes.EXECUTE_PLAN);
workflow.addEdge(Nodes.BUILD_SECTION, Nodes.GATHER_COMPLETED_SECTIONS);
workflow.addConditionalEdges(
  Nodes.GATHER_COMPLETED_SECTIONS,
  initiateFinalSectionWritingNode,
  [Nodes.WRITE_FINAL_SECTIONS]
);
workflow.addEdge(Nodes.WRITE_FINAL_SECTIONS, Nodes.COMPILE_FINAL_REPORT);
workflow.addEdge(Nodes.COMPILE_FINAL_REPORT, END);

export const graph = workflow.compile({
  name: "Research Agent",
});
