import type { AgentStateAnnotation } from "../agent/state";

import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tools } from "../helpers/tools";

export const toolNode = new ToolNode<typeof AgentStateAnnotation.State>(tools);
