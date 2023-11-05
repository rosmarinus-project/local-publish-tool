import shell from 'shelljs';
import { LOCK_FILE_MAP, PkgManager } from '../enum';

export interface PublishParams {
  cwd: string;
  pkgManager: PkgManager;
  version: string;
  versionInfo?: string;
}

export function publish(params: PublishParams) {
  const { cwd } = params;

  shell.exec('git add package.json', { cwd });
  shell.exec(`git add ${params.pkgManager}`, { cwd });
  const changeGit = shell.exec('git diff --cached --name-only', { cwd }).stdout;

  const hasPackage = changeGit.includes('package.json');
  const hasPackageLock = changeGit.includes(LOCK_FILE_MAP[params.pkgManager]);

  let commitMsg = '';

  if (hasPackage && hasPackageLock) {
    console.log(`提交版本号更改以及 ${LOCK_FILE_MAP[params.pkgManager]}`);
    commitMsg = `feat: change version and ${LOCK_FILE_MAP[params.pkgManager]}`;
  } else if (hasPackage) {
    console.log('提交版本号更改');
    commitMsg = 'feat: change version';
  } else if (hasPackageLock) {
    console.log(`提交 ${LOCK_FILE_MAP[params.pkgManager]}`);
    commitMsg = `feat: change ${LOCK_FILE_MAP[params.pkgManager]}`;
  } else {
    console.log(`无版本号更改，${LOCK_FILE_MAP[params.pkgManager]} 已为最新`);
  }

  if (commitMsg) {
    shell.exec(`git commit -m "${commitMsg}"`, { cwd });
    shell.exec('git push', { cwd });
  }

  // 打 tag
  const tagGit = shell.exec('git ls-remote', { cwd }).stdout.includes(`refs/tags/v${params.version}`);

  if (!tagGit) {
    shell.exec(`git tag -a "v${params.version}" -m "${params.versionInfo || ''}"`, { cwd });
    shell.exec(`git push origin "v${params.version}"`, { cwd });
  }
}
