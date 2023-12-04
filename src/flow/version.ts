import { resolve } from 'path';
import i18n from '@rosmarinus/i18n';
import semver from 'semver';
import * as fse from 'fs-extra';
import { VersionMode } from '../enum';

export async function changePackageVersion(versionMode: VersionMode, cwd?: string) {
  const pkgPath = resolve(cwd || process.cwd(), 'package.json');
  const pkg = await fse.readJson(pkgPath);

  const newVersion = semver.inc(pkg.version, versionMode);

  if (!newVersion) {
    throw new Error('Invalid version');
  }

  console.log(`${i18n().t('local-publish-tool.new-version')}: ${newVersion}`);
}
