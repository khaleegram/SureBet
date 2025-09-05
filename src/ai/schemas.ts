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


const DailyActiveUserSchema = z.object({
  date: z.string(),
  users: z.number(),
});

const KycVerificationSchema = z.object({
  result: z.string(),
  count: z.number(),
});

const KpiSchema = z.object({
    kycPassRate: z.string().describe("The overall KYC pass rate percentage."),
    geoBlocksTriggered: z.string().describe("The number of geo-blocks triggered in the last 24 hours."),
    dailyActiveUsers: z.string().describe("The current number of daily active users."),
    grossGamingRevenue: z.string().describe("The gross gaming revenue for the last 30 days."),
});

export const GenerateInvestorReportInputSchema = z.object({
  dailyActiveUsersData: z.array(DailyActiveUserSchema).describe('The daily active users data for the last 7 days.'),
  kycVerificationData: z.array(KycVerificationSchema).describe('The breakdown of KYC verification results.'),
  kpiData: KpiSchema.describe('Key Performance Indicators for the platform.'),
});
export type GenerateInvestorReportInput = z.infer<typeof GenerateInvestorReportInputSchema>;

export const GenerateInvestorReportOutputSchema = z.string().describe("A comprehensive, well-structured, and insightful weekly performance report for investors, formatted as Markdown. It should include sections for Key Metrics, User Engagement, and Compliance.");
export type GenerateInvestorReportOutput = z.infer<typeof GenerateInvestorReportOutputSchema>;