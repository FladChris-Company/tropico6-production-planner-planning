export type DataStatus = 'verified' | 'estimated' | 'unknown' | 'model';
export type EntryStatus = 'existing' | 'planned' | 'disabled';
export type Severity = 'success' | 'warning' | 'error';
export type Era = 'colonial' | 'world-wars' | 'cold-war' | 'modern';

export interface Mode {
  id: string;
  name: string;
  inputs: Record<string, number | null>;
  outputs: Record<string, number | null>;
}

export interface Building {
  id: string;
  name: string;
  icon: string;
  category: string;
  dlc: string;
  workers: number;
  education: 'uneducated' | 'high-school' | 'college';
  kind: 'production' | 'teamster';
  stage: number;
  dataStatus: DataStatus;
  source: string;
  availableFrom?: Era;
  modes: Mode[];
}

export interface Entry {
  id: string;
  clusterId: string;
  buildingId: string;
  modeId: string;
  count: number;
  efficiency: number;
  staffing: number;
  distance: number | '';
  status: EntryStatus;
  note: string;
  rateOverrides: { inputs: Record<string, number | ''>; outputs: Record<string, number | ''> };
}

export interface Scenario {
  id: string;
  name: string;
  type: 'current' | 'forecast';
  clusters: { id: string; name: string; distance: number | '' }[];
  entries: Entry[];
  policies: Record<string, { externalSupply: number; reserve: number; exportEnabled: boolean }>;
}

export interface Project {
  id: string;
  name: string;
  era: Era;
  dlcs: string[];
  currentId: string;
  selectedId: string;
  scenarios: Scenario[];
}

export interface Settings {
  tooltips: boolean;
  compact: boolean;
  profile: 'optimistic' | 'realistic' | 'difficult' | 'custom';
  worktimeFactor: number;
  logisticsFactor: number;
  transportTripsPerWorker: number;
}

export interface Database {
  schema: 2;
  projects: Project[];
  activeProjectId: string;
  settings: Settings;
  updatedAt: string;
}
