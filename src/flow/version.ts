import shell from 'shelljs';
import i18n from '@rosmarinus/i18n';
import { VersionMode } from '../enum';

export function changePackageVersion(versionMode: VersionMode, versionInfo?: string, cwd?: string) {
  const newVersion = shell
    .exec(`npm version ${versionMode}  -m "${versionInfo || ''}"`, { cwd, silent: true })
    .stdout.trim();

  console.log(`${i18n().t('local-publish-tool.new-version')}: ${newVersion}`);
}
