'use server';
/**
 * @fileOverview Generates creative and engaging P2P bet scenarios using AI.
 *
 * - generateP2pBetScenarios - A function that creates a list of potential bets.
 * - GenerateP2pBetScenariosInput - The input type for the function.
 * - GenerateP2pBetScenariosOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BetScenarioSchema = z.object({
    event: z.string().describe("The name of the event (e.g., 'MMA Fight Night: Titan vs. Goliath')."),
    market: z.string().describe("The specific outcome the user is betting on (e.g., 'Titan to Win by Knockout')."),
    odds: z.number().describe("The suggested decimal odds for this outcome (e.g., 1.85, 2.5)."),
});

export const GenerateP2pBetScenariosInputSchema = z.object({
  category: z.enum(['MMA', 'E-Sports', 'Crypto', 'Politics', 'Any']).describe('The category of bets to generate.'),
  count: z.number().min(1).max(5).describe('The number of bet scenarios to generate.'),
});
export type GenerateP2pBetScenariosInput = z.infer<typeof GenerateP2pBetScenariosInputSchema>;

export const GenerateP2pBetScenariosOutputSchema = z.object({
    scenarios: z.array(BetScenarioSchema)
});
export type GenerateP2pBetScenariosOutput = z.infer<typeof GenerateP2pBetScenariosOutputSchema>;


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
