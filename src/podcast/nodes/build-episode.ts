import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { AgentStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { scriptSchema, type Script } from "../helpers/types";
import { formatDraft } from "../helpers/utils";

export const buildEpisodeNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const {
    completedSections,
    outline: { title, description },
  } = state;

  let finalScript: Script = {
    script: [],
  };

  const prompt = `
Given consecutive sections of a podcast script, rewrite them so that the transition between them flows naturally and the overall script is coherent. 
Output the improved combined script. Ensure we only great the audience/introduce the show in the beginning of the podcast.
`;
  const structuredLLM = llm.withStructuredOutput(scriptSchema);

  const { script: combinedScript } = await structuredLLM.invoke([
    new SystemMessage({ content: prompt }),
    new HumanMessage({
      content: `
Here are the sections of the podcast script:
${completedSections.map((section) => formatDraft(section)).join("\n")}
        `,
    }),
  ]);

  finalScript.script.push(...combinedScript);

  const formattedScript = formatDraft(finalScript);
  console.log(formattedScript);

  return {
    script: finalScript,
    title,
    description,
  };
};
