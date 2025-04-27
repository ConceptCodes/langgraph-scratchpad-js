import { START, END, StateGraph } from "@langchain/langgraph";

import {
  AgentStateAnnotation,
  DayStateAnnotation,
  DiscussionStateAnnotation,
  InputStateAnnotation,
  NightStateAnnotation,
  OutputStateAnnotation,
} from "./state";
import { Nodes } from "../helpers/constants";
import { initPlayersNode } from "../nodes/init-players";
import { createPersonalityNode } from "../nodes/create-personality";
import { narratorNode } from "../nodes/narrator";

import { addToDiscussionNode } from "../nodes/add-to-discussion";
import { respondToDiscussionNode } from "../nodes/respond-to-discussion";
import { checkConsensusNode } from "../nodes/check-consensus";
import { resolveVotesNode } from "../nodes/resolve-vote";
import { startDiscussionNode } from "../nodes/start-discussion";
import { doctorNode } from "../nodes/doctor";
import { detectiveNode } from "../nodes/dectective";
import { checkWinnerNode } from "../nodes/check-winner";
import { resolveNightActionsNode } from "../nodes/resolve-night-actions";

const discussionSubGraph = new StateGraph(DiscussionStateAnnotation)
  .addNode(Nodes.ADD_TO_DISCUSSION, addToDiscussionNode)
  .addNode(Nodes.RESPOND_TO_DISCUSSION, respondToDiscussionNode)
  .addNode(Nodes.CHECK_CONSENSUS, checkConsensusNode, {
    ends: [Nodes.RESOLVE_VOTE, Nodes.ADD_TO_DISCUSSION],
  })
  .addNode(Nodes.RESOLVE_VOTE, resolveVotesNode)

  .addEdge(START, Nodes.ADD_TO_DISCUSSION)
  .addEdge(Nodes.ADD_TO_DISCUSSION, Nodes.RESPOND_TO_DISCUSSION)
  .addEdge(Nodes.RESPOND_TO_DISCUSSION, Nodes.CHECK_CONSENSUS)
  .addEdge(Nodes.RESOLVE_VOTE, END)
  .compile();

const daySubGraph = new StateGraph(DayStateAnnotation)
  .addNode(Nodes.START_DISCUSSION, startDiscussionNode)
  .addNode(Nodes.DISCUSSION, discussionSubGraph)
  .addNode(Nodes.CHECK_WINNER, checkWinnerNode)

  .addEdge(START, Nodes.CHECK_WINNER)
  .addEdge(Nodes.CHECK_WINNER, Nodes.START_DISCUSSION)
  .addEdge(Nodes.START_DISCUSSION, Nodes.DISCUSSION)
  .addEdge(Nodes.DISCUSSION, END)
  .compile();

const nightSubGraph = new StateGraph(NightStateAnnotation)
  .addNode(Nodes.START_DISCUSSION, startDiscussionNode)
  .addNode(Nodes.DISCUSSION, discussionSubGraph)
  .addNode(Nodes.DOCTOR, doctorNode)
  .addNode(Nodes.DETECTIVE, detectiveNode)
  .addNode(Nodes.RESOLVE_NIGHT_ACTIONS, resolveNightActionsNode)

  .addEdge(START, Nodes.START_DISCUSSION)
  .addEdge(Nodes.START_DISCUSSION, Nodes.DISCUSSION)
  .addEdge(Nodes.DISCUSSION, Nodes.DOCTOR)
  .addEdge(Nodes.DOCTOR, Nodes.DETECTIVE)
  .addEdge(Nodes.DETECTIVE, Nodes.RESOLVE_NIGHT_ACTIONS)
  .addEdge(Nodes.RESOLVE_NIGHT_ACTIONS, END)
  .compile();

const workflow = new StateGraph({
  stateSchema: AgentStateAnnotation,
  input: InputStateAnnotation,
  output: OutputStateAnnotation,
})
  .addNode(Nodes.INIT_PLAYERS, createPersonalityNode)
  .addNode(Nodes.NARRATOR, narratorNode, {
    ends: [Nodes.DAY_PHASE, Nodes.NIGHT_PHASE, END],
  })
  .addNode(Nodes.DAY_PHASE, daySubGraph, { ends: [Nodes.NARRATOR] })
  .addNode(Nodes.NIGHT_PHASE, nightSubGraph, { ends: [Nodes.NARRATOR] });

workflow.addConditionalEdges(START, initPlayersNode, [Nodes.INIT_PLAYERS]);
workflow.addEdge(Nodes.INIT_PLAYERS, Nodes.NARRATOR);
workflow.addEdge(Nodes.DAY_PHASE, Nodes.NARRATOR);
workflow.addEdge(Nodes.NIGHT_PHASE, Nodes.NARRATOR);

export const graph = workflow.compile({
  name: "Mafia Agent",
});
