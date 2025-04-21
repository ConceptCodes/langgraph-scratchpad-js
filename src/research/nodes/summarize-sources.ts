import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import { summarizerInstructions } from "../agent/prompts";
import type { SectionStateAnnotation } from "../agent/state";

const outputSchema = z.object({
  runningSummary: z.string(),
});

export const summarizeSourcesNode = async (
  state: typeof SectionStateAnnotation.State
): Promise<typeof SectionStateAnnotation.Update> => {
  const { section } = state;
  const existingSummary = state.section.content;
  const mostRecentWebResearch =
    state.webResearchResults[state.webResearchResults.length - 1];
  let humanMessageContent;

  if (existingSummary) {
    humanMessageContent = `<User Input> \n ${state.topic} \n <User Input>\n\n
<Existing Summary> \n ${existingSummary} \n <Existing Summary>\n\n
<New Search Results> \n ${mostRecentWebResearch} \n <New Search Results>`;
  } else {
    humanMessageContent = `<User Input> \n ${state.topic} \n <User Input>\n\n 
<Search Results> \n ${mostRecentWebResearch} \n <Search Results>`;
  }

  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const { runningSummary } = await structuredLLM.invoke([
    new SystemMessage(summarizerInstructions),
    new HumanMessage(humanMessageContent),
  ]);

  section.content = runningSummary;

  return { section };
};
