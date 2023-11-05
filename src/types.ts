import type { VersionMode } from './enum';

export interface Params {
  config: string;
}

export interface Context {
  checkout(): void;
  version(versionMode: VersionMode, versionInfo?: string): void;
  test(): Promise<void>;
  publish(): void;
}
