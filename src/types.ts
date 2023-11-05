import type { VersionMode } from './enum';

export interface Params {
  config: string;
}

export interface Context {
  checkout(): void;
  version(versionMode: VersionMode): void;
  test(): Promise<void>;
  publish(versionInfo?: string): void;
}
