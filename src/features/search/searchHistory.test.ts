import { beforeEach, describe, expect, it } from 'vitest';
import { addSearchHistory, clearSearchHistory, loadSearchHistory, removeSearchHistory } from './searchHistory';

beforeEach(() => {
  clearSearchHistory();
});

describe('addSearchHistory', () => {
  it('検索語を先頭に追加する', () => {
    addSearchHistory('タクシー');
    const history = addSearchHistory('値段');
    expect(history).toEqual(['値段', 'タクシー']);
  });

  it('既存の同じ検索語は重複させず先頭に移動する', () => {
    addSearchHistory('タクシー');
    addSearchHistory('値段');
    const history = addSearchHistory('タクシー');
    expect(history).toEqual(['タクシー', '値段']);
  });

  it('前後の空白を除去して保存する', () => {
    const history = addSearchHistory('  タクシー  ');
    expect(history).toEqual(['タクシー']);
  });

  it('空文字は追加しない', () => {
    const history = addSearchHistory('   ');
    expect(history).toEqual([]);
  });

  it('上限(10件)を超えたら古いものから削除する', () => {
    for (let i = 0; i < 12; i++) addSearchHistory(`query-${i}`);
    const history = loadSearchHistory();
    expect(history).toHaveLength(10);
    expect(history[0]).toBe('query-11');
    expect(history).not.toContain('query-0');
    expect(history).not.toContain('query-1');
  });
});

describe('removeSearchHistory', () => {
  it('指定した検索語のみ削除する', () => {
    addSearchHistory('タクシー');
    addSearchHistory('値段');
    const history = removeSearchHistory('タクシー');
    expect(history).toEqual(['値段']);
  });
});

describe('clearSearchHistory', () => {
  it('全履歴を削除する', () => {
    addSearchHistory('タクシー');
    addSearchHistory('値段');
    const history = clearSearchHistory();
    expect(history).toEqual([]);
    expect(loadSearchHistory()).toEqual([]);
  });
});
