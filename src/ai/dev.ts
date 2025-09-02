import { config } from 'dotenv';
config();

import '@/ai/flows/extract-id-data-with-ocr.ts';
import '@/ai/flows/compare-facial-embeddings.ts';
import '@/ai/flows/estimate-age-from-facial-scan.ts';
