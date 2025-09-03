'use server';

/**
 * @fileOverview Compares facial embeddings, ID data, and form data to make a holistic verification decision.
 *
 * - comprehensiveVerificationCheck - A function that handles the complete verification process.
 * - ComprehensiveVerificationInput - The input type for the comprehensiveVerificationCheck function.
 * - ComprehensiveVerificationOutput - The return type for the comprehensiveVerificationCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComprehensiveVerificationInputSchema = z.object({
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
  formFullName: z.string().describe("The full name entered by the user in the form."),
  formDateOfBirth: z.string().describe("The date of birth (YYYY-MM-DD) entered by the user in the form."),
});

export type ComprehensiveVerificationInput = z.infer<typeof ComprehensiveVerificationInputSchema>;

const ComprehensiveVerificationOutputSchema = z.object({
  verificationStatus: z
    .enum(['success', 'failure', 'review'])
    .describe(
      'The final verification status. "success" if all checks pass. "failure" if there is a definitive mismatch. "review" if there are discrepancies that require manual checking.'
    ),
  reasoning: z
    .array(z.string())
    .describe(
      'An array of user-friendly, non-technical strings explaining the reasons for a "failure" or "review" status. Example: ["The name on your ID does not match the name you entered."]'
    ),
});

export type ComprehensiveVerificationOutput = z.infer<typeof ComprehensiveVerificationOutputSchema>;

export async function comprehensiveVerificationCheck(
  input: ComprehensiveVerificationInput
): Promise<ComprehensiveVerificationOutput> {
  return comprehensiveVerificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'comprehensiveVerificationPrompt',
  input: {schema: ComprehensiveVerificationInputSchema},
  output: {schema: ComprehensiveVerificationOutputSchema},
  prompt: `You are an AI agent responsible for KYC (Know Your Customer) identity verification for a secure online platform. Your task is to analyze user-submitted data and make a final determination.

You will be given:
1.  A photo extracted from a government-issued ID.
2.  A series of live photos taken by the user.
3.  The full name as entered by the user in a form.
4.  The date of birth (YYYY-MM-DD) as entered by the user in a form.

Your process is as follows:
1.  **OCR Data Extraction:** Analyze the ID photo to extract the full name and date of birth.
2.  **Data Comparison:** Compare the extracted name and DOB with the name and DOB provided in the form.
3.  **Facial Recognition:** Compare the face in the ID photo against the live photos. Determine if they are a match.
4.  **Age Estimation:** Estimate the age from the live photos and check for major discrepancies with the provided date of birth.

Based on all checks, you will determine a final 'verificationStatus':
- **success:** All checks pass flawlessly. The name, DOB, and face match perfectly.
- **failure:** There is a clear and undeniable mismatch. For example, the face in the ID is clearly a different person from the live photos.
- **review:** There are minor discrepancies or low-confidence results. For example, a slight name misspelling, a low similarity score in the facial recognition, or an age estimation that is off by a few years.

**IMPORTANT:** If the status is 'failure' or 'review', you MUST provide your reasoning in the 'reasoning' array. The reasons MUST be user-friendly, concise, and non-technical. Do NOT include confidence scores or internal data.

**Good examples for reasoning:**
- "The name on your ID does not appear to match the name you entered."
- "The date of birth on your ID does not match the one provided."
- "We could not confirm a clear match between your ID photo and your live photos."

**Bad examples for reasoning:**
- "Facial recognition confidence score was 65%."
- "OCR extracted 'John Doe' but form input was 'Jon Doe'."

**User-submitted data:**
- Form Full Name: {{{formFullName}}}
- Form Date of Birth: {{{formDateOfBirth}}}
- ID Photo: {{media url=idPhotoDataUri}}
- Live Photos: {{#each livePhotoDataUris}}{{media url=this}}{{#unless @last}}, {{/unless}}{{/each}}

Perform your analysis and return the final verdict and user-friendly reasoning.`,
});

const comprehensiveVerificationFlow = ai.defineFlow(
  {
    name: 'comprehensiveVerificationFlow',
    inputSchema: ComprehensiveVerificationInputSchema,
    outputSchema: ComprehensiveVerificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
