import type { AgentStateAnnotation } from "../agent/state";
import { DBError, executeQuery } from "../helpers/db";

export const executeQueryNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const results = await executeQuery(state.query);

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
  };
};
