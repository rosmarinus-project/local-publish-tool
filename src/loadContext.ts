import * as fse from 'fs-extra';
import i18n from '@rosmarinus/i18n';
import type { Context, Params } from './types';
import { checkout } from './flow/checkout';
import { PkgManager, LOCK_FILE_MAP, VersionMode, TestNpm } from './enum';
import { changePackageVersion } from './flow/version';
import { runUnitTest } from './flow/test';
import { publish } from './flow/publish';

function getPkgManger(cwd: string) {
  if (fse.existsSync(`${cwd}/${LOCK_FILE_MAP[PkgManager.pnpm]}`)) {
    return PkgManager.pnpm;
  }

  if (fse.existsSync(`${cwd}/${LOCK_FILE_MAP[PkgManager.yarn]}`)) {
    return PkgManager.yarn;
  }

  return PkgManager.npm;
}

export async function loadContext(params: Params): Promise<Context> {
  let cwd = process.cwd();
  let pkgManager = getPkgManger(cwd);
  let master = 'main';
  let testNpm = TestNpm.jest;

  if (params.config && fse.existsSync(params.config)) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const config = await require(params.config);

      config.cwd && (cwd = config.cwd);
      config.pkgManager && (pkgManager = config.pkgManager);
      config.master && (master = config.master);
      config.testNpm && (testNpm = config.testNpm);
    } catch (e) {
      console.warn(i18n().t('local-publish-tool.config-fail'));
    }

    const config = await fse.readJSON(params.config);

    return config;
  }

  return {
    checkout() {
      checkout({
        master,
        pkgManager,
        cwd,
      });
    },
    version(versionMode: VersionMode, versionInfo?: string) {
      changePackageVersion(versionMode, versionInfo, cwd);
    },
    async test() {
      const { numFailedTests } = await runUnitTest({
        cwd,
        testNpm,
      });

      if (numFailedTests !== 0) {
        // 单测不通过
        console.error(i18n().t('local-publish-tool.jest-fail'));
        process.exit(1);
      }
    },
    publish() {
      publish({
        cwd,
        pkgManager,
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        version: require(`${cwd}/package.json`).version,
        master,
      });
    },
  };
}
