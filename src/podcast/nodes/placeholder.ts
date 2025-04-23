import type { AgentStateAnnotation } from "../agent/state";

// Example node function
export const placeholderNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<Partial<typeof AgentStateAnnotation.State>> => {
  console.log("Executing placeholder node");
  const lastMessage = state.messages.at(-1)?.content;
  console.log("Last message:", lastMessage);

  // Return updates to the state
  return {
    output: `Processed: ${lastMessage}`,
    // next: "some_other_node" // Example for conditional edges
  };
};
