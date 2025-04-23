import type { Sections } from "../helpers/types";

// 1. Extract Key Insights Instructions
export const extractKeyInsightInstructions = `
You are an expert content analyst. Your task is to extract and organize the most important elements from raw source material.

Requirements:
  • Identify the main themes or subjects discussed (Topics).
  • Select up to 5 memorable or impactful quotes, citing speaker or context if available (Quotes).
  • Summarize the core ideas, takeaways, or lessons derived from the material (Insights).
`;

export const extractKeyInsightsPrompts = (source: string) => `
Extract key insights from the following content:

---
${source}
---
`;

// 2. Extract with Feedback Instructions
export const extractKeyInsightsWithFeedbackInstructions = (
  feedback: string
) => `
You are an expert content analyst. You received feedback:

"${feedback}"

Revise your extraction accordingly, ensuring you address the feedback and improve completeness and clarity.
`;

// 3. Coverage Check Instructions
export const coverageCheckInstructions = `
You are a quality assessor for extracted insights. Compare the provided topics, quotes, and insights against the original source.

Tasks:
  • Evaluate whether each topic and quote is adequately represented in the insights.
  • Assign a grade of "pass" or "fail".
  • If the grade is "fail", provide feedback on any missing or incomplete elements; if "pass", no feedback is needed.
`;

export const coverageCheckPrompts = (
  topics: string[],
  quotes: string[],
  insights: string[]
) => `
Assess coverage based on:
  Topics: ${JSON.stringify(topics)}
  Quotes: ${JSON.stringify(quotes)}
  Insights: ${JSON.stringify(insights)}
`;

// 4. Generate Draft Instructions
export const generateDraftInstructions = `
You are a professional podcast script writer. Using the extracted data, draft a 500–700 word script that:
  • Incorporates topics, quotes, and insights naturally.
  • Maintains a conversational, engaging tone.
  • Follows a clear structure: hook, body with sections, conclusion with a call-to-action.
`;

export const generateDraftPrompts = (
  title: string,
  lang: string,
  sourceMaterial: string,
  sectionType: string,
  sectionDetails: Sections
) => `
Create a podcast script section of type "${sectionType}" based on:

PODCAST TITLE: ${title}
PODCAST LANGUAGE: ${lang}

SOURCE:
${sourceMaterial}

DETAILS:
${JSON.stringify(sectionDetails, null, 2)}
`;

// 5. Review Draft Instructions
export const reviewDraftInstructions = `
You are an editorial coach. Review the provided draft script and apply the given feedback:

Assign a grade of "pass" or "fail".
  • If the grade is "fail", provide feedback on any missing or incomplete elements; if "pass", no feedback is needed.
`;

export const reviewDraftPrompts = (
  draft: Record<string, any>,
  sectionType: string
) => `
Review the draft section ("${sectionType}"):

${JSON.stringify(draft, null, 2)}
`;

// 6. Generate Outline Instructions
export const generateOutlineInstructions = (
  outlineSchema: string,
  topics: string[],
  quotes: string[],
  insights: string[]
) => `
You are a podcast content planner. Build an episode outline that:
  • Follows this schema: ${outlineSchema}
  • Integrates topics, quotes, and insights.

Topics: ${topics.join(", ")}
Quotes: ${quotes.join(", ")}
Insights: ${insights.join(", ")}
`;

export const generateOutlineInstructionsWithFeedback = (
  feedback: string,
  outlineSchema: string,
  topics: string[],
  quotes: string[],
  insights: string[]
) => `
You are a podcast content planner. You received feedback:

"${feedback}"

Topics: ${topics.join(", ")}
Quotes: ${quotes.join(", ")}
Insights: ${insights.join(", ")}

Revise the outline to follow the schema (${outlineSchema}), integrating all topics, quotes, and insights.
`;

export const generateOutlinePrompts = (source: string) => `
Draft a podcast episode outline from this source material:

> ${source}
`;

export const reviewOutlineInstructions = `
You are an editorial reviewer for podcast outlines. Given the outline and feedback:
 
Assign a grade of "pass" or "fail".
  • If the grade is "fail", provide feedback on any missing or incomplete elements; if "pass", no feedback is needed.
`;

export const reviewOutlinePrompts = (outline: string) => `
Review this podcast outline:

${outline}
`;
