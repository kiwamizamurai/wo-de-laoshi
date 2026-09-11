# wo-de-laoshi (我的老师)

A Chinese learning app that runs entirely in the browser using Chrome's Built-in AI (Gemini Nano). No backend — it's a static single-page app deployed to GitHub Pages.

## Features

- **Flashcards**: ~220 words + 237 phrases at HSK1–3 level, covering everyday situations like the workplace, meals, and casual small talk, reviewed with an SM-2 spaced-repetition algorithm. Works in any browser since it does not depend on Chrome Built-in AI. Bookmark cards for quick review later.
- **Full-text search**: Search across flashcards, phrases, and conversation scenarios by Japanese meaning, Chinese text, or pinyin (diacritics optional) — find the expressions you need for a specific situation (e.g. "taxi", "how much").
- **Translate & reading assist**: Uses Chrome's Translator API / Language Detector API / Summarizer API for Japanese⇄Chinese translation (defaults to Japanese→Chinese), automatic input-language detection, and long-text summarization. Chinese translation results are annotated with pinyin (via the Prompt API) and can be read aloud.
- **AI conversation practice**: Uses Chrome's Prompt API for roleplay-style Chinese conversation practice across 11 scenarios (ordering at a cafe, taking a taxi, checking into a hotel, immigration at the airport, chatting with a coworker, lunch with a colleague, catching up with a friend, etc.), with per-turn AI feedback (structured output).
- **Pronunciation**: Flashcards, search results, and Chinese translation results include a speaker button using the standard Web Speech API (`speechSynthesis`) to read text aloud — independent of Chrome Built-in AI, so it works on any browser/OS with the appropriate voice installed.
- **Offline support / installable**: Flashcard and search data are precached by a service worker, so the app (including flashcards, search, and bookmarks) keeps working with no network after the first visit. Installable to the home screen/desktop as a PWA.

## Requirements

The translate and conversation-practice features depend on Chrome's Built-in AI APIs, which are effectively desktop-Chrome-only today — iOS can't support it at all (Apple requires WebKit), and only a handful of high-end Android phones meet the hardware bar. Flashcards and search don't depend on it, so they stay fully usable on any device, online or offline; the app shows a fallback message on the translate/chat tabs when it detects an unsupported device.

> [!NOTE]
> Falling back to an in-browser LLM (e.g. [WebLLM](https://github.com/mlc-ai/web-llm)) so translation also works on mobile isn't planned for now — model download reliability and WebGPU support are still too inconsistent across phones. Worth revisiting once the tooling matures.

- Chrome 138+ (Edge has a developer-preview version of some APIs)
- Hardware requirements: 22GB+ free disk space, 4GB+ VRAM GPU, or 16GB+ RAM with 4+ CPU cores

If the hardware requirements are met but the feature still isn't available, try:

1. Set `chrome://flags/#optimization-guide-on-device-model` to `Enabled BypassPerfRequirement`
2. If needed, set `chrome://flags/#prompt-api-for-gemini-nano` to `Enabled`
3. Restart Chrome
4. Check `chrome://components` for the "Optimization Guide On Device Model" status (this is where the model itself is downloaded)
5. For detailed status, check `chrome://on-device-internals`

On first use, each API downloads its model/language pack (the Prompt API model is several GB and can take a few minutes).
