import {
  Annotation,
  MessagesAnnotation,
  StateGraph,
  START,
  END,
  Send,
  Command,
} from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { ChatOllama } from "@langchain/ollama";

export type Section = {
  name: string;
  description: string;
  research: boolean;
  content?: string;
};
export type SearchQuery = { search_query: string };

export type Feedback = {
  grade: "pass" | "fail";
  follow_up_queries: SearchQuery[];
};

const FeedbackSchema = z.object({
  grade: z.enum(["pass", "fail"]),
  follow_up_queries: z.array(z.object({ search_query: z.string() })),
});

const MAX_SEARCH_DEPTH = 3;

const llm = new ChatOllama({ model: "llama3.1", temperature: 0 });

const completedSectionsChannel = Annotation<Section[]>({
  default: () => [],
  reducer: (prev, next) => [...prev, ...next],
});

export const InputStateAnnotation = Annotation.Root({
  topic: Annotation<string>(),
});
export const ReportStateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  ...InputStateAnnotation.spec,
  sections: Annotation<Section[]>({
    reducer: (prev, next) => prev.concat(next),
    default: () => [],
  }),
  completed_sections: completedSectionsChannel,
  report_sections_from_research: Annotation<string>(),
  final_report: Annotation<string>(),
});

export const SectionStateAnnotation = Annotation.Root({
  topic: Annotation<string>(),
  section: Annotation<Section>(),
  search_iterations: Annotation<number>({
    reducer: (prev, next) => next ?? prev,
    default: () => 0,
  }),
  search_queries: Annotation<SearchQuery[]>({
    default: () => [],
    reducer: (prev, next) => [
      ...prev,
      ...next.filter(
        (q) => !prev.find((p) => p.search_query === q.search_query)
      ),
    ],
  }),
  source_str: Annotation<string>(),
  report_sections_from_research: Annotation<string>(),
  completed_sections: completedSectionsChannel,
});
export const SectionOutputStateAnnotation = Annotation.Root({}); // nothing extra

async function selectAndExecuteSearch(
  api: string,
  queries: string[],
  params: Record<string, unknown>
) {
  return `Search(${api}): ${queries.join(" | ")}`; // TODO real web search
}
const formatSections = (ss: Section[]) =>
  ss.map((s) => `### ${s.name}\n\n${s.content ?? ""}`).join("\n\n");

export const generateReportPlan = async (state: any) => {
  const number_of_queries = 3;
  const queryLLM = llm.withStructuredOutput(
    z.object({ queries: z.array(z.object({ search_query: z.string() })) })
  );
  const queryRes = await queryLLM.invoke([
    new SystemMessage({
      content: `Generate ${number_of_queries} web search queries to plan a report on "${state.topic}".`,
    }),
    new HumanMessage({ content: "Queries please." }),
  ]);

  const context = await selectAndExecuteSearch(
    "tavily",
    queryRes.queries.map((q) => q.search_query),
    {}
  );

  const planner = llm.withStructuredOutput(
    z.object({
      sections: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          research: z.boolean(),
        })
      ),
    })
  );
  const plan = await planner.invoke([
    new SystemMessage({
      content: `Using this context, outline sections for the report: ${context}`,
    }),
    new HumanMessage({ content: "Return JSON with sections." }),
  ]);
  return { sections: plan.sections };
};

export const generateQueries = async (state: any) => {
  const queryLLM = llm.withStructuredOutput(
    z.object({ queries: z.array(z.object({ search_query: z.string() })) })
  );
  const res = await queryLLM.invoke([
    new SystemMessage({
      content: `Create 3 web queries to research "${state.section.description}".`,
    }),
    new HumanMessage({ content: "Queries please." }),
  ]);
  return { search_queries: res.queries };
};

export const searchWeb = async (state: any) => {
  const context = await selectAndExecuteSearch(
    "tavily",
    state.search_queries.map((q: any) => q.search_query),
    {}
  );
  return {
    source_str: context,
    search_iterations: state.search_iterations + 1,
  };
};

export const writeSection = async (state: any) => {
  const { topic, section, source_str, search_iterations } = state;

  const newText = await llm.invoke([
    new SystemMessage({
      content: `Write the "${section.name}" section for "${topic}". Use:\n${source_str}`,
    }),
    new HumanMessage({ content: "Section text only." }),
  ]);
  section.content = newText.content;

  const grader = llm.withStructuredOutput(FeedbackSchema);
  const feedback = await grader.invoke([
    new SystemMessage({
      content:
        "Grade the section. If it misses info return grade='fail' and 3 follow‑up queries. If it's good return grade='pass' and an empty list.",
    }),
    new HumanMessage({ content: section.content }),
  ]);

  const hitDepthLimit = search_iterations >= MAX_SEARCH_DEPTH;

  if (feedback.grade === "pass" || hitDepthLimit) {
    return new Command({
      update: { completed_sections: [section] },
      goto: END,
    });
  }

  return new Command({
    update: {
      search_queries: feedback.follow_up_queries,
      search_iterations: search_iterations,
      section,
    },
    goto: "search_web",
  });
};

export const gatherCompletedSections = (s: any) => ({
  report_sections_from_research: formatSections(s.completed_sections),
});

export const writeFinalSections = async (s: any) => {
  const text = await llm.invoke([
    new SystemMessage({
      content: `Write the "${s.section.name}" section for "${s.topic}" using:\n${s.report_sections_from_research}`,
    }),
    new HumanMessage({ content: "Section only." }),
  ]);
  s.section.content = text.content;
  return { completed_sections: [s.section] };
};

export const compileFinalReport = (s: any) => {
  const ordered = s.sections.map(
    (sec: Section) =>
      s.completed_sections.find((c: Section) => c.name === sec.name)?.content ??
      ""
  );
  return { final_report: ordered.join("\n\n") };
};

const launchResearch = (state: any) =>
  state.sections
    .filter((s: Section) => s.research)
    .map(
      (s: Section) =>
        new Send("build_section_with_web_research", {
          topic: state.topic,
          section: s,
          search_iterations: 0,
        })
    );

const launchNonResearch = (state: any) =>
  state.sections
    .filter((s: Section) => !s.research)
    .map(
      (s: Section) =>
        new Send("write_final_sections", {
          topic: state.topic,
          section: s,
          report_sections_from_research: state.report_sections_from_research,
        })
    );

const sectionSubgraph = new StateGraph({
  stateSchema: SectionStateAnnotation,
  output: SectionOutputStateAnnotation,
})
  .addNode("generate_queries", generateQueries)
  .addNode("search_web", searchWeb)
  .addNode("write_section", writeSection)

  .addEdge(START, "generate_queries")
  .addEdge("generate_queries", "search_web")
  .addEdge("search_web", "write_section")
  .compile();

const graph = new StateGraph({
  input: InputStateAnnotation,
  output: ReportStateAnnotation,
})
  .addNode("generate_report_plan", generateReportPlan)
  .addNode("build_section_with_web_research", sectionSubgraph)
  .addNode("gather_completed_sections", gatherCompletedSections)
  .addNode("write_final_sections", writeFinalSections)
  .addNode("compile_final_report", compileFinalReport)

  .addEdge(START, "generate_report_plan")
  .addConditionalEdges("generate_report_plan", launchResearch, [
    "build_section_with_web_research",
  ])
  .addEdge("build_section_with_web_research", "gather_completed_sections")
  .addConditionalEdges("gather_completed_sections", launchNonResearch, [
    "write_final_sections",
  ])
  .addEdge("write_final_sections", "compile_final_report")
  .addEdge("compile_final_report", END)
  .compile();

export { graph };

/* -------------------------------------------------------------------------- */
/*  7.  Demo run (uncomment to test)                                          */
/* -------------------------------------------------------------------------- */
// (async () => {
//   const result = await graph.invoke({ topic: "Cryptographic Tokenomics" });
//   console.log(result.final_report);
// })();
