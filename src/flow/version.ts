import shell from 'shelljs';
import { VersionMode } from '../enum';

export function changePackageVersion(versionMode: VersionMode, versionInfo?: string, cwd?: string) {
  const newVersion = shell
    .exec(`npm version ${versionMode}  -m "${versionInfo || ''}"`, { cwd, silent: true })
    .stdout.trim();

  console.log(`已生成新版本号: ${newVersion}`);
}
