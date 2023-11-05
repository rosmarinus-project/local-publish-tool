import shell from 'shelljs';
import { LOCK_FILE_MAP, PkgManager } from '../enum';

export interface PublishParams {
  cwd: string;
  pkgManager: PkgManager;
  version: string;
  master: string;
}

export function publish(params: PublishParams) {
  const { cwd } = params;

  shell.exec(`git add ${LOCK_FILE_MAP[params.pkgManager]}`, { cwd });
  const changeGit = shell.exec('git diff --cached --name-only', { cwd, silent: true }).stdout;

  const hasPackageLock = changeGit.includes(LOCK_FILE_MAP[params.pkgManager]);

  let commitMsg = '';

  if (hasPackageLock) {
    console.log(`提交 ${LOCK_FILE_MAP[params.pkgManager]}`);
    commitMsg = `feat: change ${LOCK_FILE_MAP[params.pkgManager]}`;
  } else {
    console.log(`${LOCK_FILE_MAP[params.pkgManager]} 已为最新`);
  }

  if (commitMsg) {
    shell.exec(`git commit -m "${commitMsg}"`, { cwd });
  }

  if (shell.exec(`git diff ${params.master} origin/${params.master}`, { cwd, silent: true }).stdout) {
    console.log(`本地主干 ${params.master} 与远端有差异，开始推送代码...`);
    shell.exec('git push', { cwd, silent: true });
  }

  // 打 tag
  const tagGit = shell.exec('git ls-remote', { cwd, silent: true }).stdout.includes(`refs/tags/v${params.version}`);

  if (!tagGit) {
    console.log(`正在推送 tag v${params.version}`);
    shell.exec(`git push origin "v${params.version}"`, { cwd, silent: true });
  }
}
