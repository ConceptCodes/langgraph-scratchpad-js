import fs from "fs";
import path from "path";
import OpenAI from "openai";
import type { Script } from "./types";
import type { SPEAKERS } from "./constants";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI();

type Speaker = (typeof SPEAKERS)[number];
const voiceMap: Record<Speaker, string> = {
  Jack: "echo",
  Jill: "coral",
};

const getAudio = async (text: string, speaker: Speaker) => {
  const voice = voiceMap[speaker] ?? "alloy";

  const mp3 = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice,
    input: text,
  });

  return Buffer.from(await mp3.arrayBuffer());
};

export const generateFullAudio = async (data: Script) => {
  const outputDir = path.resolve(__dirname, "..", "assets");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputFile = path.join(outputDir, "output.mp3");

  const audioBuffers = await Promise.all(
    data.script.map((item) => getAudio(item.text, item.speaker))
  );

  const mergedAudio = Buffer.concat(await Promise.all(audioBuffers));

  fs.writeFileSync(outputFile, mergedAudio);
  console.log(`Audio saved to ${outputDir}`);

  return outputFile;
};
