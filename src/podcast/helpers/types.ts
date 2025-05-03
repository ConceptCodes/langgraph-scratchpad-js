import z from "zod";
import { SPEAKERS } from "./constants";

export const scriptSchema = z.object({
  script: z.array(
    z
      .object({
        speaker: z.enum(SPEAKERS),
        text: z.string(),
      })
      .describe(
        "The script for the podcast episode, consisting of lines of dialogue between the two speakers (Jack and Jill). Each entry should include the speaker's name and their corresponding text."
      )
  ),
});

export type Script = z.infer<typeof scriptSchema>;

export const outputSchema = z.object({
  grade: z.enum(["pass", "fail"]).describe("Grade of the coverage check"),
  feedback: z
    .string()
    .optional()
    .describe("Feedback on how to improve if the grade is fail"),
});

export const introSectionSchema = z.object({
  hook: z
    .string()
    .describe(
      "A captivating opening statement to immediately grab attention and hint at the episode's deeper theme."
    ),
  tieHookToTopic: z
    .string()
    .describe(
      "A bridge sentence that naturally connects the hook to the episode's main topic, building intrigue."
    ),
  welcomeHostIntro: z
    .string()
    .describe("Warm, brief introduction of the hosts (only once per episode)."),
  episodeIntro: z
    .string()
    .describe(
      "A vivid, emotionally engaging overview of the episode's core topic and relevance."
    ),
  roadmap: z
    .string()
    .describe(
      "Outline of what the listener will learn, with a sense of narrative flow, not just a list."
    ),
  setupTone: z
    .string()
    .describe(
      "A subtle phrase or sentence that sets the emotional tone (e.g., reflective, energetic, investigative) for the episode."
    ),
  transition: z
    .string()
    .describe(
      "A natural lead-in phrase or story teaser that hands the listener off into the first main segment with curiosity."
    ),
});

export const mainSegmentSchema = z.object({
  title: z
    .string()
    .describe(
      "Title of the segment, written to spark curiosity or frame a problem/question."
    ),
  timeEstimate: z
    .string()
    .describe("Estimated duration for delivering this segment (in minutes)."),
  openingBridge: z
    .string()
    .describe(
      "A natural lead-in sentence connecting from the previous segment or intro."
    ),
  points: z
    .array(z.string())
    .describe(
      "Key discussion points or topics, ordered logically to build understanding or emotional momentum."
    ),
  logicalFlowNote: z
    .string()
    .optional()
    .describe(
      "Notes about the ideal order or transitions between points (e.g., escalate complexity, contrast ideas)."
    ),
  guestInput: z
    .string()
    .optional()
    .describe(
      "Specific questions/prompts for a guest if included, tied naturally into the points."
    ),
  closingBridge: z
    .string()
    .describe(
      "A soft handoff that wraps the segment and hints at the next topic, without hard-ending."
    ),
});

export const summarySectionSchema = z.object({
  timeEstimate: z
    .string()
    .describe(
      "Estimated duration for delivering this summary segment (in minutes)."
    ),
  recapPoints: z
    .array(z.string())
    .describe(
      "Brief but vivid recap of the main points discussed, maintaining narrative flow, not just listing."
    ),
  keyTakeaway: z
    .string()
    .describe(
      "The single most important idea, lesson, or emotional realization the listener should walk away with."
    ),
  emotionalSummary: z
    .string()
    .describe(
      "A final reflective sentence that leaves the listener with an emotional impression (e.g., hope, urgency, wonder)."
    ),
  transitionToOutro: z
    .string()
    .optional()
    .describe(
      "A soft transition into the outro or next steps (if outro follows)."
    ),
});

export const outroSectionSchema = z.object({
  timeEstimate: z
    .string()
    .describe("Estimated duration for the outro (in minutes)."),
  callbackToIntroTheme: z
    .string()
    .describe(
      "A brief call-back to the emotional or thematic idea introduced at the beginning."
    ),
  callsToAction: z
    .array(z.string())
    .describe(
      "Specific listener actions (e.g., subscribe, share, visit) woven naturally into the narrative, not a hard sales pitch."
    ),
  acknowledgements: z
    .string()
    .describe("Warm thank-you notes to guests, listeners, or supporters."),
  emotionalClosure: z
    .string()
    .describe(
      "A final resonant thought or emotional impression to leave the audience thinking or feeling after the episode ends."
    ),
  signOff: z
    .string()
    .describe(
      "Final closing phrase, in the tone of the episode (e.g., reflective, excited, heartfelt)."
    ),
});

export const podcastOutlineSchema = z
  .object({
    title: z.string().describe("The title of the podcast episode."),
    description: z
      .string()
      .describe("A brief description of the episode's content."),
    desiredTone: z
      .string()
      .describe(
        "The intended mood or style of the episode (e.g., informative, conversational, humorous)."
      ),
    intro: introSectionSchema.describe(
      "The introductory section of the podcast."
    ),
    mainSegments: z
      .array(mainSegmentSchema)
      .describe(
        "An array of the main discussion segments. Do not add a conclusion. Just add the main body segments."
      ),
    summary: summarySectionSchema.describe(
      "The summary section, recapping key points."
    ),
    outro: outroSectionSchema.describe(
      "The concluding section of the podcast."
    ),
  })
  .describe(
    "Defines the overall structure and content plan for a podcast episode."
  );

export type IntroSection = z.infer<typeof introSectionSchema>;
export type MainSegment = z.infer<typeof mainSegmentSchema>;
export type SummarySection = z.infer<typeof summarySectionSchema>;
export type OutroSection = z.infer<typeof outroSectionSchema>;
export type PodcastOutline = z.infer<typeof podcastOutlineSchema>;

export type Sections =
  | IntroSection
  | MainSegment
  | SummarySection
  | OutroSection;
export type SectionType = "intro" | "main" | "summary" | "outro";
