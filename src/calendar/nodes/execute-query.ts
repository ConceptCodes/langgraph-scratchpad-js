import { Command } from "@langchain/langgraph";
import type { AgentStateAnnotation } from "../agent/state";
import { DBError, executeQuery } from "../helpers/db";
import { Nodes } from "../helpers/constants";

export const executeQueryNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const results = await executeQuery(state.query);

  if (results instanceof DBError) {
    // return new Command({
    //   update: {
    //     queryError: results.message,
    //     queryResults: [],
    //     isValid: false,
    //   },
    //   goto: Nodes.GENERATE_QUERY
    // });
    return {
      queryError: results.message,
      queryResults: [],
      isValid: false,
    };
  }

  return {
    queryResults: results,
  };
};
