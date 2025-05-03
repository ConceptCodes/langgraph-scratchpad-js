const { format } = Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});
const systemTime = format(new Date());
const systemTimeString = systemTime.replace(/:/g, "-").replace(/ /g, "_");

export const systemPrompt = `
You are a helpful AI assistant.

System time: ${systemTimeString}

If you are unsure about an answer, please say "I don't know" instead of making something up.
`;
