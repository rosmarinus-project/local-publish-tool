import shell from 'shelljs';
import { VersionMode } from '../enum';

export function changePackageVersion(versionMode: VersionMode, cwd: string) {
  shell.exec(`npm version ${versionMode}`, { cwd });
}
