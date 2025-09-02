'use server';
/**
 * @fileOverview Estimates age from a facial scan and compares it to the date of birth on an ID.
 *
 * - estimateAgeFromFacialScan - A function that estimates age from a facial scan.
 * - EstimateAgeFromFacialScanInput - The input type for the estimateAgeFromFacialScan function.
 * - EstimateAgeFromFacialScanOutput - The return type for the estimateAgeFromFacialScan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateAgeFromFacialScanInputSchema = z.object({
  faceDataUri: z
    .string()
    .describe(
      'A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  dateOfBirth: z.string().describe('The date of birth of the user (YYYY-MM-DD).'),
});
export type EstimateAgeFromFacialScanInput = z.infer<typeof EstimateAgeFromFacialScanInputSchema>;

const EstimateAgeFromFacialScanOutputSchema = z.object({
  estimatedAge: z.number().describe('The estimated age of the user.'),
  ageMatchesId: z
    .boolean()
    .describe(
      'Whether the estimated age is within a reasonable range (5-10 years) of the age derived from the date of birth.'
    ),
  reviewRequired: z
    .boolean()
    .describe(
      'Whether a manual review is required due to a significant discrepancy between the estimated age and the age derived from the date of birth.'
    ),
});
export type EstimateAgeFromFacialScanOutput = z.infer<typeof EstimateAgeFromFacialScanOutputSchema>;

export async function estimateAgeFromFacialScan(
  input: EstimateAgeFromFacialScanInput
): Promise<EstimateAgeFromFacialScanOutput> {
  return estimateAgeFromFacialScanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateAgeFromFacialScanPrompt',
  input: {schema: EstimateAgeFromFacialScanInputSchema},
  output: {schema: EstimateAgeFromFacialScanOutputSchema},
  prompt: `You are an expert in age estimation from facial scans. You will estimate the age of a person based on their facial scan and compare it to their date of birth to ensure they meet age requirements for gambling.

  Photo: {{media url=faceDataUri}}
  Date of Birth: {{{dateOfBirth}}}

  Estimate the age of the person in the photo. Then, calculate the age of the person based on their date of birth. Compare the estimated age to the calculated age. If the estimated age is not within 5-10 years of the calculated age, set reviewRequired to true.

  Output the estimated age, whether the age matches the ID (within a reasonable range), and whether a manual review is required.
`,
});

const estimateAgeFromFacialScanFlow = ai.defineFlow(
  {
    name: 'estimateAgeFromFacialScanFlow',
    inputSchema: EstimateAgeFromFacialScanInputSchema,
    outputSchema: EstimateAgeFromFacialScanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
