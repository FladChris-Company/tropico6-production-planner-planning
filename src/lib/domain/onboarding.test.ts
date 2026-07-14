import { describe, expect, it } from 'vitest';
import { completeOnboarding, shouldShowOnboarding } from './onboarding';

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() { return values.size; }
  } satisfies Storage;
};

describe('Ersteinstieg', () => {
  it('wird nur bis zum ersten Abschluss angezeigt', () => {
    const storage = memoryStorage();

    expect(shouldShowOnboarding(storage)).toBe(true);
    completeOnboarding(storage);
    expect(shouldShowOnboarding(storage)).toBe(false);
  });
});
