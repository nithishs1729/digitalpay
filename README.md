# DigitalFuelPay

Responsive 7-Eleven Fuel & Pay web experience built with Expo, React, TypeScript, and `react-native-web`. The site can be opened from a laptop or mobile browser and guides a customer through station verification, safety confirmation, pump selection, payment authorization, terminal-driven fueling, and receipt review.

## Features

- Responsive desktop and mobile browser layout
- 7-Eleven-inspired Fuel & Pay visual system
- Station and pump verification flow
- Safety confirmation before pump unlock
- Pump selection and payment method selection
- 7Rewards member pricing with a 20¢/gal discount
- Terminal-driven fueling state with no manual gallon or dollar controls
- Mock terminal completion event that returns gallons, price, total, and completion time
- Digital receipt with rewards points and Slurpee offer
- Confetti celebration that completely clears after 3 seconds
- Mobile bottom navigation and desktop navigation

## Tech stack

- React 19
- TypeScript
- Expo web
- React Native Web
- Lucide React icons
- CSS media queries for responsive behavior

## Getting started

### Requirements

- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run web
```

Then open the local URL shown by Expo, usually:

```text
http://localhost:8081
```

The page is responsive and can be tested by resizing the browser or opening the local URL from another device on the same network when Expo provides a reachable network URL.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run web` | Start the Expo web development server |
| `npm start` | Start the Expo development server |
| `npm run android` | Start the Android Expo target |
| `npm run ios` | Start the iOS Expo target |
| `npx expo export --platform web` | Create a production web export in `dist/` |

## Fueling behavior

The application intentionally does not control the fuel quantity, dollar limit, or stop action. After payment authorization, it waits for the physical terminal to finish and then displays the terminal reading.

The current implementation uses a five-second local timeout as a mock terminal callback. Replace that timeout in `App.tsx` with the production terminal integration, such as a backend event, polling service, WebSocket, or payment provider callback.

## Project structure

```text
.
├── App.tsx             # Main journey and UI state
├── styles.css          # Responsive web styles and branding
├── index.ts            # Expo entry point
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
├── assets/             # App icons and splash assets
└── tsconfig.json       # TypeScript configuration
```

## Validation

Build the web export with:

```bash
npx expo export --platform web
```

The generated `dist/` directory is intentionally ignored by Git because it is a build artifact. Dependencies and Expo runtime folders are also ignored.

## Production integration notes

- Connect the terminal completion state to the real fuel dispenser service.
- Replace the mocked station, pump, price, payment, and rewards data with authenticated API responses.
- Add server-side payment authorization and receipt persistence.
- Add authentication and secure handling for payment and rewards account information.
