# wo-de-laoshi (我的老师)

A Chinese learning app that runs entirely in the browser using Chrome's Built-in AI (Gemini Nano). No backend — it's a static single-page app deployed to GitHub Pages.

## Features

- **Flashcards**: ~175 words + 177 phrases at HSK1–3 level, reviewed with an SM-2 spaced-repetition algorithm. Works in any browser since it does not depend on Chrome Built-in AI.
- **Translate & reading assist**: Uses Chrome's Translator API / Language Detector API / Summarizer API for Chinese⇄Japanese translation, automatic input-language detection, and long-text summarization.
- **AI conversation practice**: Uses Chrome's Prompt API for roleplay-style Chinese conversation practice across 8 scenarios (ordering at a cafe, taking a taxi, checking into a hotel, immigration at the airport, etc.), with per-turn AI feedback (structured output).
- **Pronunciation**: Flashcards include a speaker button using the standard Web Speech API (`speechSynthesis`) to read Chinese text aloud — independent of Chrome Built-in AI, so it works on any browser/OS with a Chinese voice installed.

## Requirements

The translate and conversation-practice features depend on Chrome's Built-in AI APIs.

- Chrome 138+ (Edge has a developer-preview version of some APIs)
- Hardware requirements: 22GB+ free disk space, 4GB+ VRAM GPU, or 16GB+ RAM with 4+ CPU cores

If the hardware requirements are met but the feature still isn't available, try:

1. Set `chrome://flags/#optimization-guide-on-device-model` to `Enabled BypassPerfRequirement`
2. If needed, set `chrome://flags/#prompt-api-for-gemini-nano` to `Enabled`
3. Restart Chrome
4. Check `chrome://components` for the "Optimization Guide On Device Model" status (this is where the model itself is downloaded)
5. For detailed status, check `chrome://on-device-internals`

On first use, each API downloads its model/language pack (the Prompt API model is several GB and can take a few minutes).

The flashcards feature does not depend on Chrome Built-in AI, so it works in any browser without any of the above setup.

Mobile note: Chrome Built-in AI is effectively a desktop-Chrome-only feature today. iOS browsers (including Chrome, which is required by Apple to use WebKit) can't support it at all, and only a handful of high-end Android devices meet the hardware requirements. The app detects this and shows a fallback message for the translate/chat tabs, while flashcards remain fully usable on any device.

## Development

```bash
npm install
npm run dev       # http://localhost:5173/wo-de-laoshi/
npm run test      # unit tests for the SRS algorithm
npm run typecheck
npm run build      # outputs static files to dist/
npm run preview    # preview the production build locally
```

## Deployment

Pushing to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`) to deploy to GitHub Pages automatically. Before the first deploy, set the repository's Settings → Pages → Source to "GitHub Actions". Note that GitHub Pages requires a public repository unless you're on a paid plan.

`vite.config.ts`'s `base` is set to `/wo-de-laoshi/` to match the repository name — update it if you rename the repo.

## Tech stack

- Vite + TypeScript
- [Hono](https://hono.dev/)'s `hono/jsx/dom` (client-side JSX runtime with React-compatible hooks)
- No external state-management library — just a small hash-based router (`src/router/useHashRoute.ts`) and local hooks
- Persistence via `localStorage` (flashcard progress only)

## Directory structure

```
src/
  ai/              Wrappers around Chrome Built-in AI (all AI-specific dependencies live here)
  data/            Static word/phrase/scenario data (JSON)
  features/
    flashcards/    Flashcard feature (SRS algorithm, UI)
    translate/     Translate & reading-assist feature
    chat/          AI conversation-practice feature
  lib/             Browser APIs independent of Chrome Built-in AI (e.g. speech synthesis)
  components/      Shared layout & navigation
  router/          Custom hash-based router
```
