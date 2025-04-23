import type { Sections } from "../helpers/types";

export const extractKeyInsightInstructions = `
You are a helpful assistant that extracts key insights from source material.
Extract the main topics, quotes, and key insights from source material.

<Instructions>
- Topics: List the main topics discussed in the source material.
- Quotes: Provide notable quotes from the source material.
- Insights: Summarize the key insights derived from the source material.
</Instructions>>
`;

export const extractKeyInsightsPrompts = (source: string) => `
Please extract the main topics, quotes, and key insights from the following source material:

<SOURCE_MATERIAL>
${source}
</SOURCE_MATERIAL>
`;

export const extractKeyInsightsWithFeedbackInstructions = (
  feedback: string
) => `
You are a helpful assistant that extracts key insights from source material.
Extract the main topics, quotes, and key insights from source material.
You have received feedback on the previous extraction attempt. Please consider <Feedback> while extracting the key insights.

<Feedback>
${feedback}
</Feedback>

<Instructions>
- Topics: List the main topics discussed in the source material.
- Quotes: Provide notable quotes from the source material.
- Insights: Summarize the key insights derived from the source material.
- Feedback: ${feedback}
</Instructions>
`;

export const coverageCheckInstructions = `
You are a helpful assistant checking the coverage of the key insights extracted from the source material.
Check if the extracted key insights cover the main topics and quotes from the source material.

<Instructions>
- Grade: Provide a grade of "pass" or "fail" based on the coverage check.
- Feedback: Provide feedback on the coverage check, including any missing topics or quotes.
</Instructions>
`;

export const coverageCheckPrompts = (
  topics: string[],
  quotes: string[],
  insights: string[]
) => `
Please check the coverage of the key insights extracted from the source material based on the following information:

<TOPICS>
${topics.join(", ")}
</TOPICS>

<QUOTES>
${quotes.join(", ")}
</QUOTES>

<INSIGHTS>
${insights.join(", ")}
</INSIGHTS>
`;

export const generateDraftInstructions = `
You are a helpful assistant that generates a draft script for a podcast episode.
Generate a draft script based on the main topics, quotes, and key insights extracted from the source material.

<Instructions>
- Include the main topics, quotes, and key insights in the draft script.
- Ensure the draft script is coherent and follows a logical structure.
- Use a conversational tone suitable for a podcast episode.
</Instructions>
`;

export const generateDraftPrompts = (
  sourceMaterial: string,
  sectionType: string,
  sectionDetails: Sections
) => `
Please generate a draft script for a podcast episode based on the following information:

<SOURCE_MATERIAL>
${sourceMaterial}
</SOURCE_MATERIAL>

<SECTION_TYPE>
${sectionType}
</SECTION_TYPE>

<SECTION_DETAILS>
${JSON.stringify(sectionDetails, null, 2)}
</SECTION_DETAILS>
`;

export const reviewDraftInstructions = `
You are a helpful assistant that reviews a podcast draft script.
Review the draft script based on the provided feedback and make necessary adjustments.
<Instructions>
- Review the draft script based on the provided feedback.
- Make necessary adjustments to the script to improve clarity, coherence, and structure.
- Ensure the script aligns with the desired tone and style for the podcast episode.
- Provide feedback on the script, including any suggestions for improvement.
</Instructions>
`;

export const reviewDraftPrompts = (
  draft: Record<string, any>,
  sectionType: string
) => `
Please review the following podcast draft script based on the provided feedback:

<SECTION_TYPE>
${sectionType}
</SECTION_TYPE>

<DRAFT_SCRIPT>
${JSON.stringify(draft, null, 2)}
</DRAFT_SCRIPT>
`;

export const generateOutlineInstructions = (
  outlineSchema: string,
  topics: string[],
  quotes: string[],
  insights: string[]
) => `
You are a helpful assistant that generates a podcast outline.
Generate a podcast outline based on the following schema and information.

<Outline Schema>
${outlineSchema}
</Outline Schema>

<TOPICS>
${topics.join(", ")}
</TOPICS>

<QUOTES>
${quotes.join(", ")}
</QUOTES>

<INSIGHTS>
${insights.join(", ")}
</INSIGHTS>

<Instructions>
- Generate a podcast outline based on the provided schema and information.
- Ensure the outline is coherent and follows a logical structure.
</Instructions>
`;

export const generateOutlineInstructionsWithFeedback = (
  feedback: string,
  outlineSchema: string,
  topics: string[],
  quotes: string[],
  insights: string[]
) => `
You are a helpful assistant that generates a podcast outline.
Generate a podcast outline based on the following schema and information.
You have received feedback on the previous outline attempt. Please consider <Feedback> while generating the podcast outline.

<Feedback>
${feedback}
</Feedback>

<Outline Schema>
${outlineSchema}
</Outline Schema>

<TOPICS>
${topics.join(", ")}
</TOPICS>

<QUOTES>
${quotes.join(", ")}
</QUOTES>

<INSIGHTS>
${insights.join(", ")}
</INSIGHTS>

<Instructions>
- Generate a podcast outline based on the provided schema and information.
- Ensure the outline is coherent and follows a logical structure.
- Consider the feedback provided to improve the outline.
</Instructions>
`;

export const generateOutlinePrompts = (source: string) => `
Please generate a podcast outline based on the following source material:

<SOURCE_MATERIAL>
${source}
</SOURCE_MATERIAL>
`;

export const reviewOutlineInstructions = `
You are a helpful assistant that reviews a podcast outline.
Review the podcast outline based on the provided feedback and make necessary adjustments.

<Instructions>
- Review the podcast outline based on the provided feedback.
- Make necessary adjustments to the outline to improve clarity, coherence, and structure. 
- Ensure the outline aligns with the desired tone and style for the podcast episode.
- Provide feedback on the outline, including any suggestions for improvement.
</Instructions>
`;

export const reviewOutlinePrompts = (outline: string) => `
Please review the following podcast outline based on the provided feedback:

<OUTLINE>
${outline}
</OUTLINE>
`;
