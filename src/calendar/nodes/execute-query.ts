import type { AgentStateAnnotation } from "../agent/state";
import { executeQuery } from "../helpers/db";

export const executeQueryNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const results = await executeQuery(state.query);

  return {
    queryResults: results,
  };
};
