import { describe, expect, it } from 'vitest';
import generated from './generated/colonial-data.json';
import { BUILDINGS, GOODS } from './data';
import * as dataModule from './data';

describe('generierte Kolonialdaten', () => {
  it('verwendet alle generierten Gebäudeauswahlen als koloniale Laufzeitdaten', () => {
    const runtimeById = new Map(BUILDINGS.map((building) => [building.id, building]));

    expect(generated.source.runtimeBuildings).toBe(69);
    expect(generated.buildings.every((building) => runtimeById.has(building.id))).toBe(true);
    expect(new Set(BUILDINGS.map((building) => building.id)).size).toBe(BUILDINGS.length);
  });

  it('verwendet normierte Produktionsraten und spielernahe Namen aus manual', () => {
    const sugar = BUILDINGS.find((building) => building.id === 'plantation-sugar');
    const teamster = BUILDINGS.find((building) => building.id === 'teamster-office');
    const toys = BUILDINGS.find((building) => building.id === 'toy-workshop');

    expect(sugar?.modes[0].outputs.sugar).toBe(1500);
    expect(teamster?.name).toBe('Fuhrunternehmen');
    expect(toys).toEqual(expect.objectContaining({
      name: 'Spielzeugfabrik',
      dataStatus: 'unknown',
      modes: expect.arrayContaining([
        expect.objectContaining({ inputs: { logs: null }, outputs: { toys: null }, referenceBatch: { inputs: { logs: 1000 }, outputs: { toys: 1729 } } }),
        expect.objectContaining({ inputs: { cotton: null }, outputs: { toys: null } }),
        expect.objectContaining({ inputs: { rubber: null }, outputs: { toys: null } })
      ])
    }));
    expect(GOODS.logs.name).toBe('Baumstämme');
  });

  it('erklärt Community-Messwerte für Spieler verständlich', () => {
    const { describeDataStatus, missingCalculationLabel, withDataStatusIndicator } = dataModule as unknown as {
      describeDataStatus?: (status: string) => string;
      missingCalculationLabel?: string;
      withDataStatusIndicator?: (label: string, status: string) => string;
    };

    expect(describeDataStatus?.('measured')).toBe('Datengrundlage: normierter Community-Messwert.');
    expect(describeDataStatus?.('unknown')).toBe(
      'Es wurden bisher keine klar belastbaren Produktionswerte gefunden. Daher gibt es hier keine korrekte Berechnung.'
    );
    expect(missingCalculationLabel).toBe('Keine belastbare Berechnung');
    expect(withDataStatusIndicator?.('+14.000 Fisch', 'estimated')).toBe('+14.000 Fisch · Schätzung');
  });
});
