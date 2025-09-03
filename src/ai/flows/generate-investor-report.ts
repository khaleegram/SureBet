'use server';
/**
 * @fileOverview Generates an investor-facing performance report using AI.
 *
 * - generateInvestorReport - A function that analyzes platform data and creates a summary report.
 * - GenerateInvestorReportInput - The input type for the generateInvestorReport function.
 * - GenerateInvestorReportOutput - The return type for the generateInvestorReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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


export async function generateInvestorReport(
  input: GenerateInvestorReportInput
): Promise<GenerateInvestorReportOutput> {
  return generateInvestorReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvestorReportPrompt',
  input: {schema: GenerateInvestorReportInputSchema},
  output: {schema: GenerateInvestorReportOutputSchema},
  prompt: `You are a sharp and insightful business analyst for a cutting-edge online betting platform called SureBet. Your task is to generate a concise weekly performance report for investors based on the data provided. The report should be well-structured, easy to read, and highlight key trends and insights. Use Markdown for formatting (headings, bold text, lists).

**Data Provided:**
- **Key Performance Indicators (KPIs):** {{{JSON.stringify kpiData}}}
- **Daily Active Users (DAU) last 7 days:** {{{JSON.stringify dailyActiveUsersData}}}
- **KYC Verification Funnel:** {{{JSON.stringify kycVerificationData}}}

**Instructions:**
1.  **Title:** Start with the title: "Weekly Performance Report".
2.  **Executive Summary:** Write a brief, high-level summary of the week's performance.
3.  **Key Metrics Analysis:** Analyze the main KPIs. Comment on the Gross Gaming Revenue, User Growth (based on DAU), and KYC Pass Rate.
4.  **User Engagement Trends:** Analyze the DAU data. Identify the trend over the week (e.g., "strong weekend growth", "stable user base"). Point out the peak DAU for the week.
5.  **Compliance & Security:** Analyze the KYC and Geo-blocking data. Frame the KYC pass rate and the number of geo-blocks as positive indicators of a robust and secure platform that's effectively filtering users and complying with regulations.
6.  **Tone:** Maintain a professional, confident, and optimistic tone suitable for investors.

Generate the report now based on the data.`,
});

const generateInvestorReportFlow = ai.defineFlow(
  {
    name: 'generateInvestorReportFlow',
    inputSchema: GenerateInvestorReportInputSchema,
    outputSchema: GenerateInvestorReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
