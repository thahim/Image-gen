import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { AspectRatio, GeneratedImage } from '../types';
import { APP_TITLE, DEFAULT_PROMPT_PLACEHOLDER, ASPECT_RATIO_OPTIONS } from '../constants';
import ImageCard from './ImageCard';

const ImageGenerator: React.FC = () => {
  const [currentPromptInput, setCurrentPromptInput] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImages = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    // Clear previous images if we're generating new ones
    setGeneratedImages([]);

    const parsedPrompts = currentPromptInput
      .split(/\n\s*\n/) // Split by one or more empty lines
      .map((p) => p.trim())
      .filter((p) => p !== '');

    if (parsedPrompts.length === 0) {
      setError('Please enter at least one prompt.');
      setIsLoading(false);
      return;
    }

    const newGeneratedImages: GeneratedImage[] = [];
    let generationFailed = false;

    for (const prompt of parsedPrompts) {
      try {
        const imageUrl = await generateImage(prompt, aspectRatio);
        newGeneratedImages.push({ url: imageUrl, prompt });
        setGeneratedImages([...newGeneratedImages]); // Update state for each image as it's generated
      } catch (err: unknown) {
        generationFailed = true;
        console.error(`Error generating image for prompt "${prompt}":`, err);
        let errorMsg = 'An unknown error occurred.';
        if (err instanceof Error) {
          errorMsg = err.message;
        }
        setError(`Failed to generate image for prompt "${prompt}": ${errorMsg}.`);
        break; // Stop further generation if an error occurs
      }
    }

    if (generationFailed && newGeneratedImages.length > 0) {
      setError('Some images failed to generate. See individual errors above or console for details.');
    } else if (generationFailed && newGeneratedImages.length === 0) {
      setError('Failed to generate any images. Please check your prompts and ensure API_KEY is configured.');
    }

    setIsLoading(false);
  }, [currentPromptInput, aspectRatio]);

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100 pb-20">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-8 mt-4 animate-fadeIn">
        {APP_TITLE}
      </h1>

      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg mb-8 animate-slideInUp">
        <div className="mb-6">
          <label htmlFor="promptInput" className="block text-lg font-semibold text-gray-800 mb-2">
            Enter Your Prompts
          </label>
          <textarea
            id="promptInput"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-700 resize-y min-h-[150px]"
            rows={6}
            value={currentPromptInput}
            onChange={(e) => setCurrentPromptInput(e.target.value)}
            placeholder={DEFAULT_PROMPT_PLACEHOLDER}
            aria-label="Enter your image generation prompts, separated by an empty line"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            Image Aspect Ratio
          </label>
          <div className="flex flex-wrap gap-4">
            {ASPECT_RATIO_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition duration-200
                  ${aspectRatio === option.value
                    ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-md'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <input
                  type="radio"
                  name="aspectRatio"
                  value={option.value}
                  checked={aspectRatio === option.value}
                  onChange={() => setAspectRatio(option.value)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  aria-label={`Select ${option.label} aspect ratio`}
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateImages}
          className={`w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform duration-200 active:scale-95
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
          aria-label="Generate Images"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Images'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}
      </div>

      {generatedImages.length > 0 && (
        <div className="w-full max-w-5xl mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center animate-fadeIn">
            Your Generated Images
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-slideInUp">
            {generatedImages.map((image, index) => (
              <ImageCard
                key={index}
                imageUrl={image.url}
                prompt={image.prompt}
                imageNumber={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;