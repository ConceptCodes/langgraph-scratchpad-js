import { START, END, StateGraph } from "@langchain/langgraph";

import {
  AgentStateAnnotation,
  ConfigurationStateAnnotation,
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
import { executePlanNode } from "../nodes/build-all-sections";
import { generateAudioNode } from "../nodes/generate-audio";
import { reviewEpisodeNode } from "../nodes/review-episode";

const subGraph = new StateGraph(
  { stateSchema: AgentStateAnnotation },
  ConfigurationStateAnnotation
)
  .addNode(Nodes.GENERATE_DRAFT, generateDraftNode)
  .addNode(Nodes.REVIEW_DRAFT, reviewDraftNode, {
    ends: [Nodes.GENERATE_DRAFT, END],
  })
  .addEdge(START, Nodes.GENERATE_DRAFT)
  .addEdge(Nodes.GENERATE_DRAFT, Nodes.REVIEW_DRAFT)
  .compile();

const workflow = new StateGraph(
  {
    stateSchema: AgentStateAnnotation,
    input: InputStateAnnotation,
    output: OutputStateAnnotation,
  },
  ConfigurationStateAnnotation
)
  .addNode(Nodes.EXTRACT_KEY_INSIGHTS, extractKeyInsightsNode)
  .addNode(Nodes.COVERAGE_CHECK, coverageCheckNode, {
    ends: [Nodes.GENERATE_OUTLINE, Nodes.EXTRACT_KEY_INSIGHTS],
  })
  .addNode(Nodes.GENERATE_OUTLINE, generateOutlineNode)
  .addNode(Nodes.REVIEW_OUTLINE, reviewOutlineNode, {
    ends: [Nodes.GENERATE_OUTLINE, Nodes.BUILD_SECTION],
  })
  .addNode(Nodes.BUILD_SECTION, subGraph)
  .addNode(Nodes.BUILD_EPISODE, buildEpisodeNode)
  .addNode(Nodes.REVIEW_EPISODE, reviewEpisodeNode, {
    ends: [Nodes.BUILD_EPISODE, Nodes.GENERATE_AUDIO],
  })
  .addNode(Nodes.GENERATE_AUDIO, generateAudioNode);

workflow.addEdge(START, Nodes.EXTRACT_KEY_INSIGHTS);
workflow.addEdge(Nodes.EXTRACT_KEY_INSIGHTS, Nodes.COVERAGE_CHECK);
workflow.addEdge(Nodes.GENERATE_OUTLINE, Nodes.REVIEW_OUTLINE);
workflow.addConditionalEdges(Nodes.REVIEW_OUTLINE, executePlanNode, [
  Nodes.BUILD_SECTION,
]);
workflow.addEdge(Nodes.BUILD_SECTION, Nodes.BUILD_EPISODE);
workflow.addEdge(Nodes.BUILD_EPISODE, Nodes.REVIEW_EPISODE);
workflow.addEdge(Nodes.GENERATE_AUDIO, END);

export const graph = workflow.compile({
  name: "Podcast Agent",
});
