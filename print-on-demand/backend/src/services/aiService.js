import OpenAI from 'openai';
import { env } from '../config/env.js';

const client = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

export async function generateImageFromPrompt(prompt) {
  if (!client) {
    return {
      imageBase64: '',
      warning: 'OPENAI_API_KEY not configured. Returning placeholder response.'
    };
  }

  const response = await client.images.generate({
    model: 'gpt-image-1',
    prompt,
    size: '1024x1024'
  });

  return { imageBase64: response.data?.[0]?.b64_json || '' };
}
