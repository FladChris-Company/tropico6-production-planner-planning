import { describe, expect, it } from 'vitest';
import { PLANNER_NAVIGATION } from './navigation';

describe('Planer-Navigation', () => {
  it('führt Spieler vom Inselstand über das Ziel zu den Gebäuden', () => {
    expect(PLANNER_NAVIGATION).toEqual([
      { id: 'overview', label: 'Inselstand' },
      { id: 'planning', label: 'Produktionsziel' },
      { id: 'buildings', label: 'Gebäude' },
      { id: 'backup', label: 'Sicherung' }
    ]);
  });
});
