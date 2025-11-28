import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from '../types';

/**
 * Encodes a Uint8Array to a base64 string.
 * This is a custom implementation required by the Gemini API guidelines.
 */
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Generates an image using the Gemini API based on a prompt and aspect ratio.
 *
 * @param prompt The text prompt for image generation.
 * @param aspectRatio The desired aspect ratio for the image ('16:9' or '9:16').
 * @returns A promise that resolves to the base64 encoded image URL.
 */
export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error('API Key is not set. Please ensure process.env.API_KEY is configured.');
  }

  // CRITICAL: Create a new GoogleGenAI instance right before making an API call
  // to ensure it always uses the most up-to-date API key from the environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Changed to gemini-2.5-flash-image
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // imageSize: '1K', // Removed as it's not supported by gemini-2.5-flash-image
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        const mimeType: string = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64EncodeString}`;
      }
    }
    throw new Error('No image data found in the response.');
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    let errorMessage = 'An unknown error occurred during image generation.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Failed to generate image: ${errorMessage}`);
  }
};