import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import {
  reportPlannerInstructions,
  reportPlannerQueryWriterInstructions,
} from "../agent/prompts";
import {
  DEFAULT_REPORT_STRUCTURE,
  MAX_SEARCH_RESULTS,
  MAX_TOKENS_PER_SOURCE,
  NUMBER_OF_QUERIES,
} from "../helpers/constants";
import { deduplicateAndFormatSources, tavilySearch } from "../../shared/utils";

const writerOutputSchema = z.object({
  queries: z
    .string()
    .array()
    .describe("List of search queries generated for report planning."),
});

const plannerOutputSchema = z.object({
  sections: z
    .array(
      z.object({
        name: z.string().describe("Name of the section."),
        description: z.string().describe("Description of the section."),
        research: z
          .string()
          .max(100)
          .describe("Research needed for the section. MAX 100 WORDS"),
      })
    )
    .describe("List of sections generated for the report."),
});

export const generateResearchPlanNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const structuredWriterLLM = llm.withStructuredOutput(writerOutputSchema);
  const structuredPlannerLLM = llm.withStructuredOutput(plannerOutputSchema);

  let prompt = reportPlannerQueryWriterInstructions(
    state.topic,
    DEFAULT_REPORT_STRUCTURE,
    NUMBER_OF_QUERIES
  );

  const results = await structuredWriterLLM.invoke([
    new SystemMessage({ content: prompt }),
    new HumanMessage({
      content:
        "Generate search queries that will help with planning the sections of the report.",
    }),
  ]);

  const webResults = await Promise.all(
    results.queries.map((query: string) =>
      tavilySearch(query, MAX_SEARCH_RESULTS)
    )
  );

  const combinedSources = deduplicateAndFormatSources(
    webResults,
    MAX_TOKENS_PER_SOURCE
  );

  const systemInstructionsSections = reportPlannerInstructions(
    state.topic,
    DEFAULT_REPORT_STRUCTURE,
    combinedSources
  );

  prompt = `Generate the sections of the report. 
Your response must include a 'sections' field containing a list of sections. 
Each section must have: name, description, plan, research, and content fields.`;

  const { sections } = await structuredPlannerLLM.invoke([
    new SystemMessage({ content: systemInstructionsSections }),
    new HumanMessage({ content: prompt }),
  ]);

  return {
    sections,
  };
};
