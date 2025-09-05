
'use server';
/**
 * @fileOverview Generates an investor-facing performance report using AI.
 *
 * - generateInvestorReport - A function that analyzes platform data and creates a summary report.
 * - GenerateInvestorReportInput - The input type for the generateInvestorReport function.
 * - GenerateInvestorReportOutput - The return type for the generateInvestorReport function.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateInvestorReportInputSchema,
  GenerateInvestorReportOutputSchema,
  type GenerateInvestorReportInput,
  type GenerateInvestorReportOutput,
} from '@/ai/schemas';
import {z} from 'genkit';


export async function generateInvestorReport(
  input: GenerateInvestorReportInput
): Promise<GenerateInvestorReportOutput> {
  return generateInvestorReportFlow(input);
}

const InvestorReportPromptInputSchema = z.object({
  stringifiedKpiData: z.string(),
  stringifiedDailyActiveUsersData: z.string(),
  stringifiedKycVerificationData: z.string(),
});

const prompt = ai.definePrompt({
  name: 'generateInvestorReportPrompt',
  input: {schema: InvestorReportPromptInputSchema},
  output: {schema: GenerateInvestorReportOutputSchema},
  prompt: `You are a sharp and insightful business analyst for a cutting-edge online betting platform called SureBet. Your task is to generate a concise weekly performance report for investors based on the data provided. The report should be well-structured, easy to read, and highlight key trends and insights. Use Markdown for formatting (headings, bold text, lists).

**Data Provided:**
- **Key Performance Indicators (KPIs):** {{{stringifiedKpiData}}}
- **Daily Active Users (DAU) last 7 days:** {{{stringifiedDailyActiveUsersData}}}
- **KYC Verification Funnel:** {{{stringifiedKycVerificationData}}}

**Instructions:**
1.  **Title:** Start with the title: "# Weekly Performance Report".
2.  **Executive Summary:** Write a brief, high-level summary (2-3 sentences) of the week's performance, touching on user growth and revenue.
3.  **Key Metrics Analysis:** Under a "## Key Metrics" heading, analyze the main KPIs. Comment on the Gross Gaming Revenue, User Growth (based on DAU), and KYC Pass Rate. Provide specific numbers from the data.
4.  **User Engagement Trends:** Under a "## User Engagement" heading, analyze the DAU data. Identify the trend over the week (e.g., "strong weekend growth", "stable user base"). Point out the peak DAU for the week.
5.  **Compliance & Security:** Under a "## Compliance & Security" heading, analyze the KYC and Geo-blocking data. Frame the KYC pass rate and the number of geo-blocks as positive indicators of a robust and secure platform that's effectively filtering users and complying with regulations.
6.  **Tone:** Maintain a professional, confident, and optimistic tone suitable for investors.

Generate the report now based on the data. Ensure your entire response is a single Markdown string.`,
});

const generateInvestorReportFlow = ai.defineFlow(
  {
    name: 'generateInvestorReportFlow',
    inputSchema: GenerateInvestorReportInputSchema,
    outputSchema: GenerateInvestorReportOutputSchema,
  },
  async input => {
    const promptInput = {
        stringifiedKpiData: JSON.stringify(input.kpiData),
        stringifiedDailyActiveUsersData: JSON.stringify(input.dailyActiveUsersData),
        stringifiedKycVerificationData: JSON.stringify(input.kycVerificationData),
    };
    const {output} = await prompt(promptInput);
    if (!output) {
      throw new Error("The AI model failed to generate a report. Please try again.");
    }
    return output;
  }
);
