export type PlannerTab = 'overview' | 'planning' | 'buildings' | 'backup';

export const PLANNER_NAVIGATION: readonly { id: PlannerTab; label: string }[] = [
  { id: 'overview', label: 'Inselstand' },
  { id: 'planning', label: 'Produktionsziel' },
  { id: 'buildings', label: 'Gebäude' },
  { id: 'backup', label: 'Sicherung' }
];
