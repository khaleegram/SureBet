'use server';
import { config } from 'dotenv';
config();

// The following flow is no longer used individually.
// import '@/ai/flows/extract-id-data-with-ocr.ts';
import '@/ai/flows/compare-facial-embeddings.ts';
// The following flow is no longer used individually.
// import '@/ai/flows/estimate-age-from-facial-scan.ts';
import '@/ai/flows/generate-investor-report.ts';
import '@/ai/flows/generate-p2p-bet-scenarios.ts';
