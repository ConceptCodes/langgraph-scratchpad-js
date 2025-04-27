import { MAX_NUM_STEPS } from "../helpers/constants";

export const generatePlanPrompt = (goal: string) => `
You are tasked with generating a set of steps that are needed to accomplish a specific goal.
Ensure you think through the problem thoroughly and provide a comprehensive list of steps.

<Constraint>
- Choose no more than ${MAX_NUM_STEPS} steps.
</Constraint>

The goal is: ${goal}
`;

export const generatePlanWithFeedbackPrompt = (
  goal: string,
  feedback: string
) =>
  generatePlanPrompt(goal) +
  `
Please use the following feedback to impsrove your plan:

<Feedback>
${feedback}
</Feedback>
`;

export const reviewStepsPrompt = (goal: string, steps: string[]) => `
You are tasked with critically reviewing a set of steps designed to accomplish a specific goal.
Carefully analyze each step for clarity, completeness, logical order, and relevance to the goal.

<Instructions>
- Assess whether the steps are sufficient and necessary to achieve the goal.
- Identify any missing, redundant, or unclear steps.
- Consider if the steps can be improved or reordered for better efficiency or effectiveness.
</Instructions>

The goal is: ${goal}
The steps are:
${steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

<Review>
- Grade the steps as "pass" or "fail".
- If the grade is "fail", provide detailed feedback and suggest specific improvements or additional steps.
- If the grade is "pass", no feedback is needed.
</Review>
`;
