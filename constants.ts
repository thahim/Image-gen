import { AspectRatio } from './types';

export const APP_TITLE = "Abdul Salam's Image Generator";

export const DEFAULT_PROMPT_PLACEHOLDER = `Enter prompts, one per empty line.
Example:
A majestic dragon flying over a sunset, fantasy art, intricate details
A cozy cabin in a snowy forest, cinematic lighting, hyperrealistic
A cyberpunk city at night, neon lights, busy streets, future tech`;

export const ASPECT_RATIO_OPTIONS = [
  { label: 'Landscape (16:9)', value: AspectRatio.LANDSCAPE },
  { label: 'Portrait (9:16)', value: AspectRatio.PORTRAIT },
];

export const DEVELOPER_NAME = "Saad Thahim";
export const DEVELOPER_PHOTO_URL = "https://picsum.photos/50/50"; // Placeholder image for developer photo
