import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const bookFlightTool = new DynamicStructuredTool({
  name: "book_flight",
  description: "Books a flight to a destination.",
  schema: z.object({
    destination: z.string().describe("The destination to fly to."),
  }),
  func: async ({ destination }) => {
    return `Booking a flight to ${destination}`;
  },
});

export const tools = [bookFlightTool];
