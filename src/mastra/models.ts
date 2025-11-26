import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

export const geminiModel = google("gemini-1.5-pro");
export const openaiModel = openai("gpt-4o");

// DeepSeek compatible model using OpenAI SDK
const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const deepseekModel = deepseek("deepseek-chat");
