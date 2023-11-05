import shell from 'shelljs';
import { PkgManager } from '../enum';

export interface CheckoutParams {
  master: string;
  pkgManager: PkgManager;
  cwd: string;
}

const installCmdMap: Record<PkgManager, string> = {
  [PkgManager.npm]: 'npm i',
  [PkgManager.pnpm]: 'pnpm i',
  [PkgManager.yarn]: 'yarn',
};

export function checkout(params: CheckoutParams) {
  const { cwd } = params;

  shell.exec(`git checkout ${params.master}`, { cwd });
  const gitChanges = shell.exec('git status  | grep "nothing to commit"', { cwd }).stdout;

  if (gitChanges) {
    console.log('local (当前本地有修改未提交，发布终止)');
    process.exit(1);
  }

  console.log(`正在切换至最新 ${params.master} 分支`);
  shell.exec('git checkout .', { cwd });
  shell.exec('git clean -df', { cwd });
  shell.exec(`git checkout ${params.master}`, { cwd });
  shell.exec('git pull', { cwd });

  const installCmd = installCmdMap[params.pkgManager];

  if (installCmd) {
    shell.exec(installCmd, { cwd });
  } else {
    console.warn('未检测到包管理器，跳过安装依赖');
  }
}
