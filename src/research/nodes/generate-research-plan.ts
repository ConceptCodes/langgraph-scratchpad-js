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
        title: z.string().describe("Title of the section."),
        description: z.string().describe("Description of the section."),
        research: z
          .boolean()
          .describe(
            "Whether to perform web research for this section of the report."
          ),
      })
    )
    .describe("List of sections generated for the report."),
});

type Output = Partial<typeof AgentStateAnnotation.State>;

export const generateResearchPlanNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<Output> => {
  const { topic } = state;
  const structuredWriterLLM = llm.withStructuredOutput(writerOutputSchema);
  const structuredPlannerLLM = llm.withStructuredOutput(plannerOutputSchema);

  const prompt = reportPlannerQueryWriterInstructions(
    topic,
    DEFAULT_REPORT_STRUCTURE,
    NUMBER_OF_QUERIES
  );

  const { queries } = await structuredWriterLLM.invoke([
    new SystemMessage({ content: prompt }),
    new HumanMessage({
      content:
        "Generate search queries that will help with planning the sections of the report.",
    }),
  ]);

  const webResults = await Promise.all(
    queries.map((query: string) => tavilySearch(query, MAX_SEARCH_RESULTS))
  );

  const combinedSources = deduplicateAndFormatSources(
    webResults,
    MAX_TOKENS_PER_SOURCE
  );

  const systemInstructionsSections = reportPlannerInstructions(
    topic,
    DEFAULT_REPORT_STRUCTURE,
    combinedSources
  );

  const { sections } = await structuredPlannerLLM.invoke([
    new SystemMessage({ content: systemInstructionsSections }),
    new HumanMessage({ content: "Generate the sections of the report." }),
  ]);

  return { sections };
};
