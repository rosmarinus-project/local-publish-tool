import shell from 'shelljs';
import { VersionMode } from '../enum';

export function changePackageVersion(versionMode: VersionMode, cwd: string) {
  const newVersion = shell.exec(`npm version ${versionMode}`, { cwd, silent: true }).stdout.trim();

  console.log(`已生成新版本号: ${newVersion}`);
}
