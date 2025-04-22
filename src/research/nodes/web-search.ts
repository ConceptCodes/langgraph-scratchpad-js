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

  const source = deduplicateAndFormatSources(context, MAX_TOKENS_PER_SOURCE);

  return {
    searchIterations: 1,
    source,
  };
};
