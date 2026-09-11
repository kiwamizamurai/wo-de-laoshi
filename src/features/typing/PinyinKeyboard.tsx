import { useEffect, useRef } from 'hono/jsx/dom';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { replayAnimation } from '../../lib/animation';
import type { PinyinKey } from '../../data/types';
import { PINYIN_KEYBOARD_DISPLAY, PINYIN_KEYBOARD_LAYOUT } from './pinyinLayout';

interface PinyinKeyboardProps {
  nextKey: PinyinKey | null;
  onKeyPress: (button: string) => void;
}

export function PinyinKeyboard({ nextKey, onKeyPress }: PinyinKeyboardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const keyboardRef = useRef<Keyboard | null>(null);
  const nextKeyRef = useRef(nextKey);
  const onKeyPressRef = useRef(onKeyPress);
  nextKeyRef.current = nextKey;
  onKeyPressRef.current = onKeyPress;

  useEffect(() => {
    if (!containerRef.current) return;
    keyboardRef.current = new Keyboard(containerRef.current, {
      layout: PINYIN_KEYBOARD_LAYOUT,
      display: PINYIN_KEYBOARD_DISPLAY,
      mergeDisplay: true,
      theme: 'hg-theme-default pinyin-keyboard',
      physicalKeyboardHighlight: false,
      useButtonTag: true,
      autoUseTouchEvents: true,
      onKeyPress: (button: string) => {
        if (button !== nextKeyRef.current) {
          const el = keyboardRef.current?.getButtonElement(button);
          const target = Array.isArray(el) ? el[0] : el;
          replayAnimation(target ?? null, 'key-mistake');
        }
        onKeyPressRef.current(button);
      },
    });
    return () => {
      keyboardRef.current?.destroy();
      keyboardRef.current = null;
    };
  }, []);

  useEffect(() => {
    keyboardRef.current?.setOptions({
      buttonTheme: nextKey ? [{ class: 'key-highlight', buttons: nextKey }] : [],
    });
  }, [nextKey]);

  return <div ref={containerRef} className="pinyin-keyboard-mount" />;
}
