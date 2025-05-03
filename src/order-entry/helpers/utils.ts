import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import Player from "play-sound";
import record from "node-record-lpcm16";

const openai = new OpenAI();
const audioPlayer = Player({});

export const generateSpeech = async (text: string): Promise<Buffer> => {
  console.log(`Generating speech for text: "${text.substring(0, 50)}..."`);
  try {
    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
      response_format: "mp3",
    });

    console.log("Speech generation successful.");
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error("Error generating speech with OpenAI:", error);
    throw new Error("Failed to generate speech.");
  }
};

export const playAudio = async (audioBuffer: Buffer): Promise<void> => {
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `speech_${uuidv4()}.mp3`);

  try {
    console.log(`Saving audio to temporary file: ${tempFilePath}`);
    fs.writeFileSync(tempFilePath, audioBuffer);

    console.log(`Playing audio file: ${tempFilePath}`);
    await new Promise<void>((resolve, reject) => {
      audioPlayer.play(tempFilePath, (err) => {
        if (err) {
          console.error(`Error playing audio file ${tempFilePath}:`, err);
          fs.unlinkSync(tempFilePath);
          reject(new Error(`Failed to play audio: ${err.message}`));
        } else {
          console.log(
            "Audio playback finished (or started, depending on player)."
          );
          fs.unlinkSync(tempFilePath);
          resolve();
        }
      });
    });
  } catch (error) {
    console.error(
      "An error occurred during the audio playback process:",
      error
    );
    try {
      fs.accessSync(tempFilePath);
      fs.unlinkSync(tempFilePath);
    } catch (cleanupErr) {}
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred during audio playback.");
    }
  }
};

export const listenAndTranscribe = async (
  language: string = "en",
  sampleRate: number = 16000
): Promise<string> => {
  console.log(`Starting recording...`);

  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `recording_${uuidv4()}.wav`);
  const fileStream = fs.createWriteStream(tempFilePath, { encoding: "binary" });

  const recording = record.record({
    sampleRate: sampleRate,
    channels: 1, // Mono audio
    audioType: "wav",
    threshold: 0.5, // Silence threshold (adjust as needed)
    endOnSilence: true, // Stop recording on silence
    // device: null, // Use default recording device
    recorder: "rec", // Specify recorder program (rec for SoX on macOS/Linux)
    verbose: false,
  });

  let transcription = "";
  let hasError = false;

  const recordingPromise = new Promise<void>((resolve, reject) => {
    recording
      .stream()
      .on("error", (err) => {
        console.error("Recording error:", err);
        hasError = true;
        fileStream.end();
        reject(new Error(`Recording failed: ${err.message}`));
      })
      .pipe(fileStream)
      .on("finish", () => {
        console.log("File stream finished.");
        if (!hasError) {
          resolve();
        }
      })
      .on("error", (err) => {
        console.error("File stream error:", err);
        hasError = true;
        reject(new Error(`Failed to write audio file: ${err.message}`));
      });
  });

  try {
    await recordingPromise;

    console.log(`Recording saved to temporary file: ${tempFilePath}`);
    console.log("Sending audio for transcription...");

    await new Promise((resolve) => fileStream.on("close", resolve));

    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "gpt-4o-mini-transcribe",
      language,
    });

    console.log("Transcription successful.");
    transcription = response.text;
  } catch (error) {
    console.error("Error during transcription process:", error);
    throw new Error(
      `Transcription failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  } finally {
    try {
      await fs.promises.unlink(tempFilePath);
      console.log(`Temporary recording file deleted: ${tempFilePath}`);
    } catch (cleanupErr) {
      console.error(
        `Error deleting temporary recording file ${tempFilePath}:`,
        cleanupErr
      );
    }
  }

  return transcription;
};
