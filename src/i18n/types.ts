import type { GrammarCategory, VocabCategory } from '../data/types';

export type Locale = 'ja' | 'en';

export interface Dictionary {
  nav: {
    home: string;
    flashcards: string;
    grammar: string;
    search: string;
    translate: string;
    chat: string;
  };
  header: {
    githubAriaLabel: string;
  };
  categories: {
    all: string;
    vocab: Record<VocabCategory, string>;
    grammar: Record<GrammarCategory, string>;
  };
  common: {
    copy: string;
    speak: string;
    petMascot: string;
  };
  ai: {
    checking: (featureLabel: string) => string;
    unsupportedTitle: (featureLabel: string) => string;
    unsupportedBodyMobile: string;
    unsupportedBodyDesktop: string;
    unavailableTitle: (featureLabel: string) => string;
    unavailableBody: string;
    needsDownloadTitle: (featureLabel: string) => string;
    needsDownloadBody: string;
    downloadStart: string;
    downloadingTitle: (featureLabel: string) => string;
    downloadingBody: string;
    errorTitle: (featureLabel: string) => string;
    retry: string;
  };
  home: {
    greeting: { morning: string; noon: string; evening: string };
    subtitleIdle: string;
    subtitleWithCount: (count: number) => string;
    activityTitle: string;
    activitySummary: (rangeDays: number, activeDays: number) => string;
    activityTooltip: (label: string, count: number) => string;
  };
  flashcards: {
    modeSrs: string;
    modeBookmarks: string;
    modeTyping: string;
    tapToReveal: string;
    bookmarkAdd: string;
    bookmarkRemove: string;
    noBookmarks: string;
    noCardsToday: string;
    stats: { new: string; due: string; completed: string };
    grade: { again: string; hard: string; good: string; easy: string };
  };
  grammar: {
    pointCount: (count: number) => string;
  };
  search: {
    placeholder: string;
    recentSearches: string;
    clearAll: string;
    removeFromHistory: (term: string) => string;
    noResults: (query: string) => string;
    scenariosHeading: string;
    vocabHeadingTruncated: (total: number, shown: number) => string;
    vocabHeadingFull: (total: number) => string;
  };
  chat: {
    featureLabel: string;
    backToScenarios: string;
    scenarioNotFound: string;
    scenarioSelectIntro: string;
    inputPlaceholder: string;
    send: string;
    turnLimitReached: (maxTurns: number) => string;
    turnCounter: (turnCount: number, maxTurns: number) => string;
    grading: string;
    viewFeedback: (score: number) => string;
    correctedTextLabel: string;
  };
  translate: {
    featureLabel: string;
    languageZh: string;
    languageJa: string;
    swapAriaLabel: string;
    inputPlaceholder: string;
    detectedLabel: (label: string) => string;
    translateAction: string;
    translating: string;
    translateError: string;
    summaryTitle: string;
    summarizing: string;
    pinyinLoading: string;
  };
  typing: {
    noItems: string;
    resultSummary: (correct: number, total: number) => string;
    restart: string;
  };
}
