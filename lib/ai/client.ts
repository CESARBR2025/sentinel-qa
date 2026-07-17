import OpenAI from "openai";

const apiKey = process.env.LLM_API_KEY;
const baseURL = process.env.LLM_BASE_URL || "https://api.deepseek.com";

export const iaDisponible = Boolean(apiKey);

export const llmModel = process.env.LLM_MODEL || "deepseek-chat";

export const llmClient = apiKey
  ? new OpenAI({ apiKey, baseURL })
  : null;
