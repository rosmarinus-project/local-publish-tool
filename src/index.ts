import { select, input } from '@inquirer/prompts';
import i18n from '@rosmarinus/i18n';
import { getParams } from './cmd';
import { loadContext } from './loadContext';
import { VersionMode } from './enum';

async function main() {
  const params = await getParams();
  const context = await loadContext(params);
  const version = await select({
    message: `${i18n().t('local-publish-tool.rule-input')}: `,
    choices: [{ value: VersionMode.major }, { value: VersionMode.minor }, { value: VersionMode.patch }],
  });
  const features = (
    await input({
      message: `${i18n().t('local-publish-tool.feature-input')}: `,
    })
  ).trim();

  context.checkout();
  await context.test();
  context.version(version, features);
  context.publish();
}

main();
