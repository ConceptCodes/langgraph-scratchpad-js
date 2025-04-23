import type { AgentStateAnnotation } from "../agent/state";
import { generateFullAudio } from "../helpers/utils";

export const generateAudioNode = async (
  state: typeof AgentStateAnnotation.State
): Promise<typeof AgentStateAnnotation.Update> => {
  const { script } = state;

  const audioFilePath = await generateFullAudio(script);

  return { audioFilePath };
};
