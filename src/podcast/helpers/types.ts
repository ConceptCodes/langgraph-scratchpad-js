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
      "A captivating opening statement to grab the listener's attention."
    ),
  welcomeHostIntro: z.string().describe("Introduction of the hosts."),
  episodeIntro: z.string().describe("Brief overview of the episode's topic."),
  roadmap: z
    .string()
    .describe("Outline of what will be covered in the episode."),
  transition: z
    .string()
    .describe("Transition phrase into the first main segment."),
});

export const mainSegmentSchema = z.object({
  title: z.string().describe("Title of the main segment."),
  timeEstimate: z.string().describe("Estimated duration for this segment."),
  points: z
    .array(z.string())
    .describe("Key points or discussion topics within the segment."),
  guestInput: z
    .string()
    .optional()
    .describe("Specific questions or prompts for a guest, if applicable."),
  transition: z
    .string()
    .describe("Transition phrase into the next segment or summary."),
});

export const summarySectionSchema = z.object({
  timeEstimate: z.string().describe("Estimated duration for the summary."),
  recapPoints: z
    .array(z.string())
    .describe("Brief recap of the main points discussed."),
  keyTakeaway: z
    .string()
    .describe(
      "The single most important message or takeaway for the listener."
    ),
  concludingThought: z
    .string()
    .optional()
    .describe("A final thought or reflection to leave with the audience."),
});

export const outroSectionSchema = z.object({
  timeEstimate: z.string().describe("Estimated duration for the outro."),
  callsToAction: z
    .array(z.string())
    .describe(
      "Specific actions the listener should take (e.g., subscribe, visit website)."
    ),
  acknowledgements: z
    .string()
    .describe("Thanking guests, listeners, or sponsors."),
  signOff: z.string().describe("The final closing remarks and sign-off."),
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
