import { deduplicateAndFormatSources, tavilySearch } from "../../shared/utils";
import type { SectionStateAnnotation } from "../agent/state";
import {
  MAX_SEARCH_RESULTS,
  MAX_TOKENS_PER_SOURCE,
} from "../helpers/constants";

export const webResearchNode = async (
  state: typeof SectionStateAnnotation.State
): Promise<typeof SectionStateAnnotation.Update> => {
  const { searchQuery } = state;
  console.log("Web search query:", searchQuery);
  const context = await tavilySearch(searchQuery, MAX_SEARCH_RESULTS);

  const webResearchResults = deduplicateAndFormatSources(
    [context],
    MAX_TOKENS_PER_SOURCE
  );
  const sources = context.results.map((source) => ({
    title: source.title,
    url: source.url,
  }));

  return {
    sourcesGathered: sources,
    researchLoopCount: state.researchLoopCount
      ? state.researchLoopCount + 1
      : 1,
    webResearchResults: [webResearchResults],
  };
};
