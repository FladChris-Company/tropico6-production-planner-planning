import { describe, expect, it } from 'vitest';
import { removeEntry, restoreEntry } from './entries';
import type { Entry } from './types';

const entry = (id: string): Entry => ({ id, clusterId: 'main', buildingId: 'plantation-sugar', modeId: 'standard', count: 1, efficiency: 100, staffing: 100, distance: '', status: 'existing', note: '', rateOverrides: { inputs: {}, outputs: {} } });

describe('Gebäude entfernen', () => {
  it('stellt ein entferntes Gebäude an seiner ursprünglichen Position wieder her', () => {
    const entries = [entry('one'), entry('two'), entry('three')];
    const removal = removeEntry(entries, 'two');

    expect(removal.entries.map((item) => item.id)).toEqual(['one', 'three']);
    expect(restoreEntry(removal.entries, removal.removed!).map((item) => item.id)).toEqual(['one', 'two', 'three']);
  });
});
