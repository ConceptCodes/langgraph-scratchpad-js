export enum Nodes {
  EXTRACT_KEY_INSIGHTS = "EXTRACT_KEY_INSIGHTS",
  COVERAGE_CHECK = "COVERAGE_CHECK",
  GENERATE_OUTLINE = "GENERATE_OUTLINE",
  REVIEW_OUTLINE = "REVIEW_OUTLINE",
  BUILD_SECTIONS = "BUILD_SECTIONS",
  BUILD_EPISODE = "BUILD_EPISODE",

  GENERATE_DRAFT = "GENERATE_DRAFT",
  REVIEW_DRAFT = "REVIEW_DRAFT",
}

export const PODCAST_OUTLINE = `
**Podcast Episode Outline Template**

**Episode Title:** [Insert Episode Title Here]
**Key Topic/Theme:** [Summarize the main topic]
**Desired Tone:** [e.g., Informative, Conversational, Humorous, Serious]

---

**1. Intro (Approx. [Time] minutes)**
  *   **Hook:** (e.g., Intriguing question, surprising statistic, short anecdote, sound effect/clip related to the topic)
  *   **Music:** Intro music starts and fades slightly.
  *   **Welcome & Host Introduction:** Briefly introduce host(s).
  *   **Episode Introduction:** State the episode title and number. Briefly introduce the main topic and why it's relevant/interesting to the audience. Mention any special guests.
  *   **Roadmap:** Briefly outline what will be covered in the episode.
  *   **Transition:** Smooth transition into the first main segment.

**2. Main Segment 1: [Sub-topic 1 Title] (Approx. [Time] minutes)**
  *   Introduce the first key point or aspect of the main topic.
  *   Provide details, explanations, examples, data, or stories related to this sub-topic.
  *   (If applicable) Guest input/discussion on this point.
  *   **Transition:** Link this segment to the next one.

**3. Main Segment 2: [Sub-topic 2 Title] (Approx. [Time] minutes)**
  *   Introduce the second key point or aspect.
  *   Provide details, explanations, examples, data, or stories.
  *   (If applicable) Guest input/discussion.
  *   **Transition:** Link this segment to the next one or the summary.

**4. (Optional) Main Segment 3+: [Sub-topic 3+ Title] (Approx. [Time] minutes)**
  *   Introduce further key points as needed.
  *   Provide details, explanations, examples, data, or stories.
  *   (If applicable) Guest input/discussion.
  *   **Transition:** Link segments smoothly.

**6. Summary & Key Takeaways (Approx. [Time] minutes)**
  *   Briefly recap the main points discussed ([Sub-topic 1], [Sub-topic 2], etc.).
  *   Reiterate the most important message or takeaway for the listener.
  *   Offer a concluding thought or perspective.

**7. Outro (Approx. [Time] minutes)**
  *   **Call to Action (CTA):**
    *   Encourage listeners to subscribe, rate, or review the podcast.
    *   Direct listeners to a website, social media, or related resources (mention specific URLs/handles).
    *   Ask a question for listener feedback or engagement.
  *   **Acknowledgements:** Thank guests (if any), production team, and listeners.
  *   **Teaser (Optional):** Briefly mention the topic of the next episode.
  *   **Sign-off:** Standard closing phrase.
  *   **Music:** Outro music fades in and plays out.

---
`;
