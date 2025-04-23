import { START, END, StateGraph } from "@langchain/langgraph";

import {
  AgentStateAnnotation,
  InputStateAnnotation,
  OutputStateAnnotation,
} from "./state";
import { Nodes } from "../helpers/constants";
import { extractKeyInsightsNode } from "../nodes/extract-key-insights";
import { coverageCheckNode } from "../nodes/coverage-check";
import { generateDraftNode } from "../nodes/generate-draft";
import { reviewDraftNode } from "../nodes/review-draft";
import { reviewOutlineNode } from "../nodes/review-outline";
import { buildEpisodeNode } from "../nodes/build-episode";
import { generateOutlineNode } from "../nodes/generate-outline";

const subGraph = new StateGraph(AgentStateAnnotation)
  .addNode(Nodes.GENERATE_DRAFT, generateDraftNode)
  .addNode(Nodes.REVIEW_DRAFT, reviewDraftNode)

  .addEdge(START, Nodes.GENERATE_DRAFT)
  .addEdge(Nodes.GENERATE_DRAFT, Nodes.REVIEW_DRAFT)
  .addConditionalEdges(
    Nodes.REVIEW_DRAFT,
    (x: typeof AgentStateAnnotation.State) => (x.feedback ? "pass" : "fail"),
    {
      // pass: END,
      fail: Nodes.GENERATE_DRAFT,
    }
  );

const workflow = new StateGraph({
  stateSchema: AgentStateAnnotation,
  input: InputStateAnnotation,
  output: OutputStateAnnotation,
})
  .addNode(Nodes.EXTRACT_KEY_INSIGHTS, extractKeyInsightsNode)
  .addNode(Nodes.COVERAGE_CHECK, coverageCheckNode)
  .addNode(Nodes.GENERATE_OUTLINE, generateOutlineNode)
  .addNode(Nodes.REVIEW_OUTLINE, reviewOutlineNode)
  .addNode(Nodes.BUILD_SECTIONS, subGraph.compile())
  .addNode(Nodes.BUILD_EPISODE, buildEpisodeNode);

workflow.addEdge(START, Nodes.EXTRACT_KEY_INSIGHTS);
workflow.addEdge(Nodes.EXTRACT_KEY_INSIGHTS, Nodes.COVERAGE_CHECK);
workflow.addConditionalEdges(
  Nodes.COVERAGE_CHECK,
  (x: typeof AgentStateAnnotation.State) => (x.feedback ? "pass" : "fail"),
  {
    pass: Nodes.EXTRACT_KEY_INSIGHTS,
    fail: Nodes.GENERATE_OUTLINE,
  }
);
workflow.addEdge(Nodes.GENERATE_OUTLINE, Nodes.REVIEW_OUTLINE);
workflow.addConditionalEdges(
  Nodes.REVIEW_OUTLINE,
  (x: typeof AgentStateAnnotation.State) => (x.feedback ? "pass" : "fail"),
  {
    pass: Nodes.GENERATE_OUTLINE,
    fail: Nodes.BUILD_SECTIONS,
  }
);
workflow.addEdge(Nodes.BUILD_SECTIONS, Nodes.BUILD_EPISODE);
workflow.addEdge(Nodes.BUILD_EPISODE, END);

export const graph = workflow.compile({
  name: "Podcast Agent",
});
