export type ModuleLifecycle = 'showable' | 'next' | 'planned';

export interface ModuleStatus {
  key: string;
  name: string;
  status: ModuleLifecycle;
  description: string;
}
