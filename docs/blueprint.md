# **App Name**: SureBet Simulator

## Core Features:

- User Signup & Mock KYC/AML: Create a signup form with fields for personal information and ID upload. Extract ID data using OCR and flag mismatches for review. The extracted personal information from government documents serves as a tool for cross-checking and flagging any mismatches, such as inconsistent or missing data, enhancing the verification process..
- Facial Recognition: Extract photo from uploaded ID and capture live facial images. Compare facial embeddings to flag mismatches. This facial matching algorithm functions as a tool, designed to identify and flag any discrepancies between the photo on the ID and live facial images.
- Age Verification: Estimate age from live facial scan using an AI model. Check if the estimated age aligns with the date of birth from the ID. The AI age estimation serves as a tool for identifying discrepancies, such as instances where the estimated age does not fall within a reasonable range compared to the provided date of birth, ensuring compliance with age verification standards.
- Manual Review Queue: Build a queue for flagged cases (mismatched ID, facial scan, or age issues). Create an interface for human review.
- Geo-Blocking Simulation: Geolocate user IP and block access from sanctioned countries or where gambling is illegal.
- Mock Crypto/Fiat Transactions: Simulate crypto and fiat deposits/withdrawals using a fake wallet and payment gateway, with balances tracked in the database.
- P2P Betting & Casino Games: Simulate a P2P betting marketplace and casino games with fake crypto/fiat balances, focusing on a visually appealing UI.

## Style Guidelines:

- Primary color: Vivid purple (#9400D3), inspired by royalty and high stakes.
- Background color: Dark purple (#1E0036), a desaturated hue of the primary for a dark and luxurious scheme.
- Accent color: Bright pink (#FF69B4), an analogous color that provides high contrast for calls to action and highlights.
- Body and headline font: 'Poppins', a geometric sans-serif offering a precise, contemporary, and fashionable feel.
- Use modern and sleek icons related to gambling and finance.
- Use a dark theme with vibrant accents to create a high-end and engaging user experience.
- Incorporate subtle animations for transitions and game elements (e.g., spinning slots, card shuffling).