# Social Support Application Portal

Multi-step application form with English/Arabic (RTL), local progress saving, and optional AI writing assistance on the Situation step.

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+

## How to run the project

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables (optional)

Copy the example env file if you want AI-assisted writing:

```bash
cp .env.example .env
```

See [OpenAI API key setup](#openai-api-key-setup) below. The app runs without a key; only **Help Me Write** is disabled or shows an error when used.

### 3. Development server

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### 4. Production build

```bash
npm run build
npm start
```

`npm start` serves the static client build from `build/client`.

## Tests

```bash
npm test
```

---

## OpenAI API key setup

The **Help Me Write** dialog (Situation step) calls OpenAI's Chat Completions API from the browser.

### Steps

1. Create an API key at [OpenAI API keys](https://platform.openai.com/api-keys).
2. Copy `.env.example` to `.env` in the project root (if you have not already).
3. Set your key:

```env
VITE_OPENAI_API_KEY=sk-your-key-here
```

4. Restart the dev server (`npm run dev`) so Vite picks up the new variable.
