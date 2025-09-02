'use server';
/**
 * @fileOverview Extracts data from an uploaded ID using OCR.
 *
 * - extractIdData - A function that handles the ID data extraction process.
 * - ExtractIdDataInput - The input type for the extractIdData function.
 * - ExtractIdDataOutput - The return type for the extractIdData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractIdDataInputSchema = z.object({
  idDataUri: z
    .string()
    .describe(
      "A photo of an ID, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractIdDataInput = z.infer<typeof ExtractIdDataInputSchema>;

const ExtractIdDataOutputSchema = z.object({
  fullName: z.string().describe('The full name extracted from the ID.'),
  dateOfBirth: z.string().describe('The date of birth extracted from the ID.'),
  address: z.string().describe('The address extracted from the ID.'),
  gender: z.string().describe('The gender extracted from the ID.'),
});
export type ExtractIdDataOutput = z.infer<typeof ExtractIdDataOutputSchema>;

export async function extractIdData(input: ExtractIdDataInput): Promise<ExtractIdDataOutput> {
  return extractIdDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractIdDataPrompt',
  input: {schema: ExtractIdDataInputSchema},
  output: {schema: ExtractIdDataOutputSchema},
  prompt: `You are an expert OCR reader specializing in extracting data from government IDs.

You will use this information to extract the following fields: full name, date of birth, address, and gender.

Use the following as the primary source of information about the ID.

Photo: {{media url=idDataUri}}

Output a JSON object that contains the extracted information.`,
});

const extractIdDataFlow = ai.defineFlow(
  {
    name: 'extractIdDataFlow',
    inputSchema: ExtractIdDataInputSchema,
    outputSchema: ExtractIdDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
