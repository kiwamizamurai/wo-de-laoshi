import { useState } from 'hono/jsx/dom';
import { AiStateView } from '../../ai/AiStateView';
import { createLanguageDetector, detectLanguage, isLanguageDetectorApiSupported } from '../../ai/languageDetectorApi';
import { isPromptApiSupported } from '../../ai/promptApi';
import { createSummarizer, isSummarizerApiSupported, summarizeText } from '../../ai/summarizerApi';
import { translateText } from '../../ai/translatorApi';
import { CopyButton } from '../../components/CopyButton';
import { SpeakButton } from '../../components/SpeakButton';
import { useT } from '../../i18n/LocaleContext';
import { LanguagePicker } from './LanguagePicker';
import { PinyinLine } from './PinyinLine';
import { fetchPinyin } from './pinyinAnnotator';
import { SummaryPanel } from './SummaryPanel';
import { useTranslatorSession } from './useTranslatorSession';

const SPEECH_LANG: Record<string, string> = { zh: 'zh-CN', ja: 'ja-JP' };

type TranslationState =
  | { status: 'idle' }
  | { status: 'translating' }
  | { status: 'done'; text: string }
  | { status: 'error' };

type SummaryState =
  | { status: 'idle' }
  | { status: 'summarizing' }
  | { status: 'done'; text: string }
  | { status: 'error' };

type PinyinState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; text: string }
  | { status: 'error' };

const SUMMARY_THRESHOLD = 400;

export function TranslatePage() {
  const t = useT();
  const [inputText, setInputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('ja');
  const [targetLanguage, setTargetLanguage] = useState('zh');
  const [translation, setTranslation] = useState<TranslationState>({ status: 'idle' });
  const [summary, setSummary] = useState<SummaryState>({ status: 'idle' });
  const [pinyin, setPinyin] = useState<PinyinState>({ status: 'idle' });
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);

  const { state, retry } = useTranslatorSession(sourceLanguage, targetLanguage);

  function swapLanguages(): void {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setTranslation({ status: 'idle' });
    setSummary({ status: 'idle' });
    setPinyin({ status: 'idle' });
  }

  async function handleDetect(): Promise<void> {
    if (!isLanguageDetectorApiSupported() || !inputText.trim()) return;
    try {
      const detector = await createLanguageDetector();
      const results = await detectLanguage(detector, inputText);
      const top = results[0];
      if (!top) return;
      setDetectedLabel(`${top.detectedLanguage} (${Math.round(top.confidence * 100)}%)`);
      if (top.detectedLanguage.startsWith('zh')) {
        setSourceLanguage('zh');
        setTargetLanguage('ja');
      } else if (top.detectedLanguage.startsWith('ja')) {
        setSourceLanguage('ja');
        setTargetLanguage('zh');
      }
    } catch {
      setDetectedLabel(null);
    }
  }

  async function handleTranslate(translator: any): Promise<void> {
    if (!inputText.trim()) return;
    setTranslation({ status: 'translating' });
    setSummary({ status: 'idle' });
    setPinyin({ status: 'idle' });
    try {
      const result = await translateText(translator, inputText);
      setTranslation({ status: 'done', text: result });
      if (result.length >= SUMMARY_THRESHOLD && isSummarizerApiSupported()) {
        setSummary({ status: 'summarizing' });
        try {
          const summarizer = await createSummarizer();
          const summarized = await summarizeText(summarizer, result);
          setSummary({ status: 'done', text: summarized });
        } catch {
          setSummary({ status: 'error' });
        }
      }
      if (targetLanguage === 'zh' && isPromptApiSupported() && result.trim()) {
        setPinyin({ status: 'loading' });
        try {
          const pinyinText = await fetchPinyin(result);
          setPinyin({ status: 'done', text: pinyinText });
        } catch {
          setPinyin({ status: 'error' });
        }
      }
    } catch {
      setTranslation({ status: 'error' });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <LanguagePicker
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        onChangeSource={setSourceLanguage}
        onChangeTarget={setTargetLanguage}
        onSwap={swapLanguages}
      />
      <textarea
        value={inputText}
        onInput={(event: any) => setInputText(event.target.value)}
        onBlur={handleDetect}
        placeholder={t.translate.inputPlaceholder}
        rows={5}
        style={{
          padding: '0.7rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
      {detectedLabel ? (
        <span className="muted" style={{ fontSize: '0.8rem' }}>
          {t.translate.detectedLabel(detectedLabel)}
        </span>
      ) : null}

      <AiStateView state={state} onRetry={retry} featureLabel={t.translate.featureLabel}>
        {(translator) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => handleTranslate(translator)}
              disabled={translation.status === 'translating' || !inputText.trim()}
            >
              {translation.status === 'translating' ? t.translate.translating : t.translate.translateAction}
            </button>
            {translation.status === 'done' ? (
              <div
                className="card anim-slide-up-in"
                style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
              >
                {targetLanguage === 'zh' ? (
                  <PinyinLine pinyin={pinyin.status === 'done' ? pinyin.text : null} loading={pinyin.status === 'loading'} />
                ) : null}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', flex: 1 }}>{translation.text}</p>
                  <SpeakButton text={translation.text} lang={SPEECH_LANG[targetLanguage]} />
                  <CopyButton text={translation.text} />
                </div>
              </div>
            ) : null}
            {translation.status === 'error' ? <p className="muted">{t.translate.translateError}</p> : null}
            {summary.status === 'summarizing' || summary.status === 'done' ? (
              <SummaryPanel summary={summary.status === 'done' ? summary.text : null} loading={summary.status === 'summarizing'} />
            ) : null}
          </div>
        )}
      </AiStateView>
    </div>
  );
}
