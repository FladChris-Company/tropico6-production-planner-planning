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
      modes: [expect.objectContaining({ inputs: { logs: null }, outputs: { toys: null } })]
    }));
    expect(GOODS.logs.name).toBe('Baumstämme');
  });

  it('erklärt Community-Messwerte für Spieler verständlich', () => {
    const describeDataStatus = (dataModule as unknown as { describeDataStatus?: (status: string) => string }).describeDataStatus;

    expect(describeDataStatus?.('measured')).toBe('Datengrundlage: normierter Community-Messwert.');
    expect(describeDataStatus?.('unknown')).toBe('Datengrundlage: noch nicht ausreichend dokumentiert.');
  });
});
