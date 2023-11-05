import shell from 'shelljs';
import i18n from '@rosmarinus/i18n';
import { LOCK_FILE_MAP, PkgManager } from '../enum';

export interface PublishParams {
  cwd: string;
  pkgManager: PkgManager;
  version: string;
  master: string;
}

export function publish(params: PublishParams) {
  const { cwd } = params;

  shell.exec(`git add ${LOCK_FILE_MAP[params.pkgManager]}`, { cwd, silent: true });
  const changeGit = shell.exec('git diff --cached --name-only', { cwd, silent: true }).stdout;

  const hasPackageLock = changeGit.includes(LOCK_FILE_MAP[params.pkgManager]);

  let commitMsg = '';

  if (hasPackageLock) {
    console.log(`${i18n().t('local-publish-tool.commit')} ${LOCK_FILE_MAP[params.pkgManager]}`);
    commitMsg = `feat: change ${LOCK_FILE_MAP[params.pkgManager]}`;
  } else {
    console.log(`${LOCK_FILE_MAP[params.pkgManager]} ${i18n().t('local-publish-tool.latest')}`);
  }

  if (commitMsg) {
    shell.exec(`git commit -m "${commitMsg}"`, { cwd });
  }

  if (shell.exec(`git diff ${params.master} origin/${params.master}`, { cwd, silent: true }).stdout) {
    console.log(i18n().t('local-publish-tool.push', params.master));
    shell.exec('git push', { cwd, silent: true });
  }

  // 打 tag
  const tagGit = shell.exec('git ls-remote', { cwd, silent: true }).stdout.includes(`refs/tags/v${params.version}`);

  if (!tagGit) {
    console.log(i18n().t('local-publish-tool.push-tag', params.version));
    shell.exec(`git push origin "v${params.version}"`, { cwd, silent: true });
  }
}
