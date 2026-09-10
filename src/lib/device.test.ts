import { describe, expect, it } from 'vitest';
import { isMobileDevice } from './device';

const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const LEGACY_IPAD_UA =
  'Mozilla/5.0 (iPad; CPU OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Mobile/15E148 Safari/604.1';
const IPADOS_13_PLUS_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const MAC_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const WINDOWS_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

describe('isMobileDevice', () => {
  it('AndroidのUser-Agentをモバイルと判定する', () => {
    expect(isMobileDevice({ userAgent: ANDROID_UA })).toBe(true);
  });

  it('iPhoneのUser-Agentをモバイルと判定する', () => {
    expect(isMobileDevice({ userAgent: IPHONE_UA })).toBe(true);
  });

  it('iPadOS 12以前(User-AgentにiPadを含む)をモバイルと判定する', () => {
    expect(isMobileDevice({ userAgent: LEGACY_IPAD_UA })).toBe(true);
  });

  it('iPadOS 13+ (MacIntel偽装+複数タッチポイント)をモバイルと判定する', () => {
    expect(isMobileDevice({ userAgent: IPADOS_13_PLUS_UA, platform: 'MacIntel', maxTouchPoints: 5 })).toBe(true);
  });

  it('通常のMac(MacIntel+タッチポイントなし)はモバイルと判定しない', () => {
    expect(isMobileDevice({ userAgent: MAC_UA, platform: 'MacIntel', maxTouchPoints: 0 })).toBe(false);
  });

  it('maxTouchPointsが未定義のMacはモバイルと判定しない', () => {
    expect(isMobileDevice({ userAgent: MAC_UA, platform: 'MacIntel' })).toBe(false);
  });

  it('WindowsのUser-Agentはモバイルと判定しない', () => {
    expect(isMobileDevice({ userAgent: WINDOWS_UA })).toBe(false);
  });
});
