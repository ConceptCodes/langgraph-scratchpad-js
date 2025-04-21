import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { SectionStateAnnotation } from "../agent/state";
import { llm } from "../helpers/llm";
import { Command, END } from "@langchain/langgraph";
import { Nodes } from "../helpers/constants";

const outputSchema = z.object({
  grade: z.enum(["pass", "fail"]),
  followUpQueries: z.array(z.object({ search_query: z.string() })),
});

export const writeSectionNode = async (
  state: typeof SectionStateAnnotation.State
) => {
  const { topic, section, source, researchLoopCount, searchIterations } = state;

  const newText = await llm.invoke([
    new SystemMessage({
      content: `Write the "${section.title}" section for "${topic}". Use:\n${source}`,
    }),
    new HumanMessage({ content: "Section text only." }),
  ]);

  section.content = newText.content as string;

  const grader = llm.withStructuredOutput(outputSchema);
  const { grade, followUpQueries } = await grader.invoke([
    new SystemMessage({
      content:
        "Grade the section. If it misses info return grade='fail' and 3 follow‑up queries. If it's good return grade='pass' and an empty list.",
    }),
    new HumanMessage({ content: section.content }),
  ]);

  const hitDepthLimit = searchIterations >= researchLoopCount;

  if (grade === "pass" || hitDepthLimit) {
    return new Command({
      update: { completedSections: [section] },
      goto: END,
    });
  }

  return new Command({
    update: {
      searchQueries: followUpQueries,
      searchIterations,
      section,
    },
    goto: Nodes.WEB_SEARCH,
  });
};
