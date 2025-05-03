import type { AgentStateAnnotation } from "../agent/state";


export const confirmOrderNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { draft } = state;

  console.log("I should confirm this order, right?");
  console.log(draft);
}