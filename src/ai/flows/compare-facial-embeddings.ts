'use server';

/**
 * @fileOverview Compares facial embeddings from an uploaded ID with live facial images.
 *
 * - compareFacialEmbeddings - A function that handles the comparison of facial embeddings.
 * - CompareFacialEmbeddingsInput - The input type for the compareFacialEmbeddings function.
 * - CompareFacialEmbeddingsOutput - The return type for the compareFacialEmbeddings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareFacialEmbeddingsInputSchema = z.object({
  idPhotoDataUri: z
    .string()
    .describe(
      "A photo from the user's ID, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  livePhotoDataUris: z.array(
    z.string().describe(
      'A list of live photos taken from the user, as data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    )
  ).describe('A list of live photos of the user.'),
});

export type CompareFacialEmbeddingsInput = z.infer<typeof CompareFacialEmbeddingsInputSchema>;

const CompareFacialEmbeddingsOutputSchema = z.object({
  matchConfidence: z
    .number()
    .describe(
      'A score between 0 and 1 representing the confidence that the faces match.'
    ),
  isMatch: z
    .boolean()
    .describe(
      'Whether the лица images are determined to be a match based on the confidence score.'
    ),
  reviewRequired: z
    .boolean()
    .describe(
      'Whether a manual review is required due to low confidence or other issues.'
    ),
});

export type CompareFacialEmbeddingsOutput = z.infer<typeof CompareFacialEmbeddingsOutputSchema>;

export async function compareFacialEmbeddings(
  input: CompareFacialEmbeddingsInput
): Promise<CompareFacialEmbeddingsOutput> {
  return compareFacialEmbeddingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareFacialEmbeddingsPrompt',
  input: {schema: CompareFacialEmbeddingsInputSchema},
  output: {schema: CompareFacialEmbeddingsOutputSchema},
  prompt: `You are an expert in facial recognition and identity verification.

You will receive a photo extracted from a user's ID and a set of live photos taken from the user.

Your task is to determine if the faces in the ID photo and the live photos match.

You should provide a matchConfidence score (between 0 and 1) indicating the likelihood of a match.

You should set isMatch to true if the confidence score is above a certain threshold (e.g., 0.8) and false otherwise.

You should set reviewRequired to true if the confidence score is low or if there are any issues detected (e.g., poor image quality, inconsistent lighting, unusual facial expressions), and false otherwise.

ID Photo: {{media url=idPhotoDataUri}}
Live Photos: {{#each livePhotoDataUris}}{{media url=this}}{{#unless @last}}, {{/unless}}{{/each}}
`,
});

const compareFacialEmbeddingsFlow = ai.defineFlow(
  {
    name: 'compareFacialEmbeddingsFlow',
    inputSchema: CompareFacialEmbeddingsInputSchema,
    outputSchema: CompareFacialEmbeddingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
