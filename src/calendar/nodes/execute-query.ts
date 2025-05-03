import type { AgentStateAnnotation } from "../agent/state";
import { DBError, executeQuery } from "../helpers/db";

export const executeQueryNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const { query, params } = state;
  const results = await executeQuery(query, params);

  if (results instanceof DBError) {
    return {
      queryError: { message: results.message, isError: true },
      queryResults: [],
      isValid: false,
    };
  }

  return {
    queryResults: results,
    queryError: { message: "", isError: false },
    isValid: true,
    confirmation: false,
  };
};
