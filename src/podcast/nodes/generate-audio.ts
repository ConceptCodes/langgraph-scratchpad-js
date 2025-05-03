import { Command, END, interrupt } from "@langchain/langgraph";

import type { AgentStateAnnotation } from "../agent/state";
import { generateFullAudio } from "../helpers/utils";

export const generateAudioNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { script } = state;

  const shouldContinue = await interrupt(
    "Do you want to generate audio for the script?"
  );

  if (!shouldContinue) {
    return new Command({
      goto: END,
    });
  }

  const audioFilePath = await generateFullAudio(script!);

  return { audioFilePath };
};
