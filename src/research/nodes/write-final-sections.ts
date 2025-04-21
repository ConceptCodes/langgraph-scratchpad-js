import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { finalSectionWriterInstructions } from "../agent/prompts";
import type { SectionStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";

export const writeFinalSectionsNode = async (
  state: typeof SectionStateAnnotation.State
): Promise<typeof SectionStateAnnotation.Update> => {
  const { topic, section, reportSectionsFromResearch } = state;

  const prompt = finalSectionWriterInstructions(
    topic,
    section.title,
    section.description,
    reportSectionsFromResearch
  );

  const result = await llm.invoke([
    new SystemMessage({ content: prompt }),
    new HumanMessage({
      content: "Generate a report section based on the provided sources.",
    }),
  ]);

  section.content = result.content as string;

  return { completedSections: [section] };
};
