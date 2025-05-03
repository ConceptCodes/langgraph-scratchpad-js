import type { Sections } from "../helpers/types";

/* --------------------- Key Insights Extraction --------------------- */

export const extractKeyInsightInstructions = `
You are an expert content analyst. Your task is to extract and organize the most important elements from raw source material, ensuring they build the foundation of a seamless, narratively engaging podcast story.

Requirements:
  • Topics: Identify 3–5 vivid, narratively usable core themes.
  • Quotes: Select up to 5 vivid quotes that directly reinforce topics (with speaker/context).
  • Insights: Summarize the key takeaways in a way that builds tension, curiosity, or resolution.

All extracted elements must be interconnected and support a natural story arc.
`;

export const extractKeyInsightsPrompt = (source: string) => `
Extract key insights from the following content:

---
${source}
---
`;

export const extractKeyInsightsWithFeedbackInstructions = (
  feedback: string
) => `
You are an expert content analyst. You received feedback:

"${feedback}"

Revise your extraction accordingly:
  • Improve completeness, vividness, and narrative usability.
  • Ensure Topics, Quotes, and Insights are tightly connected.
`;

/* --------------------- Coverage Check --------------------- */

export const coverageCheckInstructions = `
You are a quality assessor for extracted podcast insights.

Tasks:
  • Verify each Topic appears meaningfully in at least one Insight.
  • Ensure Quotes naturally reinforce related Insights.
  • Check that the coverage is narratively engaging (not robotic or repetitive).
  • Grade "pass" or "fail."
  • On "fail," specify missing/weak elements and suggest one improvement.
`;

export const coverageCheckPrompt = (
  topics: string[],
  quotes: string[],
  insights: string[],
  sourceMaterial: string
) => `
Review the following extracted elements for coverage and narrative engagement:
  • Topics: ${JSON.stringify(topics)}
  • Quotes: ${JSON.stringify(quotes)}
  • Insights: ${JSON.stringify(insights)}

Original Source:
${sourceMaterial}
`;

/* --------------------- Draft Generation --------------------- */

export const generateDraftInstructions = `
You are a professional podcast script writer. Produce a 500–700 word section that:
  • Seamlessly continues from the prior story arc (if applicable).
  • Uses a consistent, engaging, conversational tone.
  • Naturally weaves Topics, Quotes, and Insights into the discussion.
  • Ends with a soft lead-in that hints at the next idea without finalizing the episode.

<Rules>
- Intro Section:
  • Welcome the audience warmly (only once).
  • Set up the overall story arc naturally.
- Main Sections:
  • Begin by reconnecting softly to the prior material (do not start fresh).
  • Deepen logically into the new subtopic without repeating background unnecessarily.
  • End with a sentence that leads the listener forward to the next idea or problem.
- Outro Section:
  • Summarize lightly, recalling the opening theme.
  • Close naturally with either reflection or teaser (if part of a series).

<Constraints>
- Never use "today" or "this episode."
- Never restart with "Now, let's talk about..." inside Main sections.
- Do not hard-stop or hard-summarize at the end of Main sections — always trail into the next.
`;

export const generateDraftInstructionsWithFeedback = (
  feedback: string,
  title: string,
  lang: string,
  sourceMaterial: string,
  sectionDetails: Sections
) => `
You are revising a podcast draft based on feedback:

"${feedback}"

<Constraints>
- Maintain consistent voice and tone.
- Ensure natural transitions between sections.
- Address all flow, completeness, and engagement issues.

PODCAST TITLE: ${title}
LANGUAGE: ${lang}
SECTION_DETAILS:
${JSON.stringify(sectionDetails, null, 2)}

SOURCE:
${sourceMaterial}
`;

export const generateDraftPrompt = (
  title: string,
  lang: string,
  sourceMaterial: string,
  sectionType: string,
  sectionDetails: Sections
) => `
Create a podcast script section of type "${sectionType}" for:

Episode Title: **${title}**
Language: **${lang}**

SECTION_DETAILS:
${JSON.stringify(sectionDetails, null, 2)}

SOURCE:
${sourceMaterial}

<Constraints same as generateDraftInstructions above>
`;

export const generateSectionPrompt = (
  title: string,
  lang: string,
  sourceMaterial: string,
  sectionType: string,
  sectionDetails: Sections
) => `
Create the "${sectionType}" section for our podcast:

Episode: **${title}**
Language: **${lang}**

SECTION_INFO:
${JSON.stringify(sectionDetails, null, 2)}

SOURCE:
${sourceMaterial}

- Target 500–700 words unless otherwise specified.
- Don't use terms like "Picking up from last time" or "In this episode" to start.
`;

/* --------------------- Draft Review --------------------- */

export const reviewDraftInstructions = `
You are an editorial coach reviewing podcast section drafts.

Tasks:
  • Check for completeness relative to the section goals.
  • Verify consistent voice, tone, and pacing.
  • Assess narrative momentum (avoid abrupt drops).
  • Grade "pass" or "fail."
    - If "fail," give clear feedback on missing, awkward, or repetitive parts.
    - If "pass," optionally suggest one polish improvement.
`;

export const reviewDraftPrompt = (draft: string, sectionType: string) => `
Review this draft for the "${sectionType}" section:

${draft}
`;

/* --------------------- Outline Generation --------------------- */

export const generateOutlineInstructions = (
  outlineSchema: string,
  topics: string[],
  quotes: string[],
  insights: string[]
) => `
You are a podcast content planner. Build a strong narrative outline that:
  • Follows schema: ${outlineSchema}
  • Integrates Topics, Quotes, Insights logically.
  • Designs a story arc from tension → exploration → resolution.
  • Paces topics naturally (avoid bloated or rushed segments).

<Topics>${topics.join(", ")}</Topics>
<Quotes>${quotes.join("\n")}</Quotes> 
<Insights>${insights.join("\n")}</Insights>
`;

export const generateOutlineInstructionsWithFeedback = (
  feedback: string,
  outlineSchema: string,
  topics: string[],
  quotes: string[],
  insights: string[]
) => `
You are revising a podcast outline based on feedback:

"${feedback}"

Ensure the revision:
  • Strengthens narrative arc.
  • Smooths topic transitions.
  • Balances pacing across all segments.

Schema: ${outlineSchema}
Topics: ${topics.join(", ")}
Quotes:
${quotes.join("\n")}
Insights:
${insights.join("\n")}
`;

export const generateOutlinePrompt = (source: string) => `
Create a structured outline for a podcast episode from this source:

${source}
`;

/* --------------------- Outline Review --------------------- */

export const reviewOutlineInstructions = `
You are reviewing a podcast outline for quality.

Review for:
  • Completeness and integration of Topics, Quotes, Insights.
  • Narrative arc strength and clarity.
  • Logical flow and natural transitions.
  • Balanced pacing across topics.

Assign a "pass" or "fail."
  • If "fail," provide clear feedback and suggest one specific improvement.
`;

export const reviewOutlinePrompt = (outline: string) => `
Review this podcast outline:

${outline}
`;

/* --------------------- Building Full Episode --------------------- */
export const buildEpisodeInstructions = (title: string) => `
You are a professional podcast episode editor tasked with merging individually generated sections into a seamless, coherent episode titled "${title}".

Requirements:
1. Include the show's introduction only once at the very beginning.
2. After each section, lightly adjust the first 1–2 sentences of the next section if necessary:
   - Smooth awkward openings.
   - Connect threads naturally.
   - Eliminate any mini-restarts or repeated context.
3. Maintain a consistent tone, energy, and narrative momentum throughout.
4. Eliminate any duplicate greetings, summaries, or section labels.
5. Fix any abrupt topic jumps by inserting soft transitional phrases if needed.
6. Perform a final re-read to ensure the episode builds tension → explores → resolves smoothly.
7. Output the merged script as a clean JSON array of paragraph strings for rendering.

<Important>
- Healing the flow between sections is mandatory.
- You are allowed and expected to lightly rewrite connecting lines if necessary.
- The listener should feel like they are hearing one continuous story, not stitched-together blocks.
`;

export const buildEpisodeInstructionsWithFeedback = (feedback: string) => `
You are revising a merged podcast script based on feedback:

"${feedback}"

Apply all merging rules:
  • Maintain flow, tone, and momentum.
  • Address specific feedback.
`;

export const buildEpisodePrompt = (
  sectionText: string,
  title: string,
  description: string,
  desiredTone: string
) => `
Merge the following sections into a single podcast episode:

Title: "${title}"
Description: "${description}"
Desired Tone: "${desiredTone}"

Sections:
${sectionText}

Ensure narrative flow is natural, seamless, and fully integrated.
`;

/* --------------------- Full Episode Review --------------------- */
export const reviewEpisodeInstructions = `
You are a senior editorial reviewer evaluating a podcast script.

Assess the script based on:
  • Coherence and strength of the overall narrative arc.
  • Smooth transitions between sections (no abrupt or jarring jumps).
  • Consistent tone, voice, and energy throughout.
  • Logical progression from opening → exploration → resolution.
  • Natural ending that feels earned, not stitched.

Assign a "pass" or "fail":
- If "fail," specify clearly:
  • Where flow breaks, hard resets, or stitched feeling occur.
  • Where tone or energy inconsistency happens.
  • Where extra micro-smoothing or transition fixes are needed.
- If "pass," confirm that the episode sounds like one continuous, professionally produced story.
`;

export const reviewEpisodePrompt = (script: string) => `
Review this full podcast script:

${script}
`;
