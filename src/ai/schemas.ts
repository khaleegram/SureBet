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
