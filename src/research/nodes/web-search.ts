import { deduplicateAndFormatSources, tavilySearch } from "../../shared/utils";
import type { SectionStateAnnotation } from "../agent/state";
import {
  MAX_SEARCH_RESULTS,
  MAX_TOKENS_PER_SOURCE,
} from "../helpers/constants";

export const webResearchNode = async (
  state: typeof SectionStateAnnotation.State
): Promise<typeof SectionStateAnnotation.Update> => {
  const { searchQueries } = state;

  const context = await Promise.all(
    searchQueries.map((query) => tavilySearch(query, MAX_SEARCH_RESULTS))
  );

  const webResearchResults = deduplicateAndFormatSources(
    context,
    MAX_TOKENS_PER_SOURCE
  );

  console.log("webResearchResults", webResearchResults);

  const sources = context.map((data) => {
    return data.results.map((item) => ({
      title: item.title,
      url: item.url,
    }));
  });

  const sourcesGathered = sources.flat();
  console.log("sourcesGathered", sourcesGathered);

  return {
    // sourcesGathered: sources.flat(),
    researchLoopCount: state.researchLoopCount
      ? state.researchLoopCount + 1
      : 1,
    // webResearchResults: [webResearchResults],
  };
};
