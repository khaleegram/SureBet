'use server';
/**
 * @fileOverview Generates creative and engaging P2P bet scenarios using AI.
 *
 * - generateP2pBetScenarios - A function that creates a list of potential bets.
 * - GenerateP2pBetScenariosInput - The input type for the function.
 * - GenerateP2pBetScenariosOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateP2pBetScenariosInputSchema,
    GenerateP2pBetScenariosOutputSchema,
    type GenerateP2pBetScenariosInput,
    type GenerateP2pBetScenariosOutput,
} from '@/ai/schemas';


export async function generateP2pBetScenarios(
  input: GenerateP2pBetScenariosInput
): Promise<GenerateP2pBetScenariosOutput> {
  return generateP2pBetScenariosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateP2pBetScenariosPrompt',
  input: {schema: GenerateP2pBetScenariosInputSchema},
  output: {schema: GenerateP2pBetScenariosOutputSchema},
  prompt: `You are a creative oddsmaker for a peer-to-peer betting platform. Your task is to generate interesting and plausible betting scenarios to populate the marketplace. The events should sound exciting and current.

Generate {{{count}}} unique bet scenarios for the category: '{{{category}}}'.

For each scenario, provide a compelling event name, a specific market to bet on, and realistic decimal odds.

- **MMA:** Fights should have dramatic-sounding names. Markets can be winner, method of victory (KO, submission), or round of victory.
- **E-Sports:** Use fictional but plausible team names and popular games (e.g., CS:GO, Valorant, League of Legends). Markets can be map winner, overall winner, or specific in-game achievements.
- **Crypto:** Bets should be about price predictions (e.g., 'BTC > $75k by EOM').
- **Politics:** Use generic but realistic political scenarios (e.g., 'Candidate Z Wins Election').

Ensure the odds are numeric and reflect a reasonable probability for the event. Return the scenarios in the requested JSON format.`,
});

const generateP2pBetScenariosFlow = ai.defineFlow(
  {
    name: 'generateP2pBetScenariosFlow',
    inputSchema: GenerateP2pBetScenariosInputSchema,
    outputSchema: GenerateP2pBetScenariosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
