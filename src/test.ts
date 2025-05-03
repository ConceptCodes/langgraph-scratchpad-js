import "reflect-metadata";
import { Annotation, START, END, StateGraph } from "@langchain/langgraph";

const AgentStateAnnotation = Annotation.Root({
  foo: Annotation<string>,
});

export const graph = new StateGraph(AgentStateAnnotation)
  .addNode("node_a", (_: typeof AgentStateAnnotation.State) => {
    return { foo: "bar" };
  })
  .addNode("node_b", async (state: typeof AgentStateAnnotation.State) => {
    console.log("foo", state.foo);
  })

  .addEdge(START, "node_a")
  .addEdge("node_a", "node_b")
  .addEdge("node_b", END)
  .compile();
