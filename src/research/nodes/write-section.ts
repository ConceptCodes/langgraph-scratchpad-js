import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { SectionStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { Command, END } from "@langchain/langgraph";
import { Nodes, NUMBER_OF_QUERIES } from "../helpers/constants";
import {
  sectionGraderInstructions,
  sectionGraderPrompt,
  sectionWriterInstructions,
  sectionWriterPrompt,
} from "../agent/prompts";

const outputSchema = z.object({
  grade: z
    .enum(["pass", "fail"])
    .describe("whether the section passes or fails"),
  followUpQueries: z
    .string()
    .array()
    .describe("Follow-up queries to gather missing information"),
});

export const writeSectionNode = async (
  state: typeof SectionStateAnnotation.State
) => {
  const { topic, section, source, searchIterations } = state;

  const prompt = sectionWriterPrompt(
    topic,
    section.title,
    section.description,
    source,
    section.content ?? ""
  );

  const newText = await llm.invoke([
    new SystemMessage({
      content: sectionWriterInstructions,
    }),
    new HumanMessage({ content: prompt }),
  ]);

  section.content = newText.content as string;

  const grader = llm.withStructuredOutput(outputSchema);

  const systemMessage = sectionGraderInstructions(
    topic,
    section.description,
    section.content,
    1
  );

  const { grade, followUpQueries } = await grader.invoke([
    new SystemMessage({ content: systemMessage }),
    new HumanMessage({ content: sectionGraderPrompt }),
  ]);

  const hitDepthLimit = searchIterations >= 3;

  if (grade === "pass" || hitDepthLimit) {
    return new Command({
      update: { completedSections: [section] },
      goto: END,
    });
  }

  return new Command({
    update: {
      searchQueries: followUpQueries,
      section,
    },
    goto: Nodes.WEB_SEARCH,
  });
};
