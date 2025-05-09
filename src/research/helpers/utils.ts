import type { Section } from "./types";

export const formatSections = (sections: Section[]): string => {
  let formatted_str = "";
  sections.forEach((section, index) => {
    const idx = index + 1;
    const separator = "=".repeat(60);
    formatted_str += `
${separator}
Section ${idx}: ${section.title} 
${separator}
Description: ${section.description}

Requires Research: ${section.research}

Content: ${section.content}"}
`;
  });
  return formatted_str.trim();
};
