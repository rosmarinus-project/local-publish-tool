import { select, input } from '@inquirer/prompts';
import { getParams } from './cmd';
import { loadContext } from './loadContext';
import { VersionMode } from './enum';

async function main() {
  const params = await getParams();
  const context = await loadContext(params);
  const version = await select({
    message: '请选择版本号变更规则: ',
    choices: [{ value: VersionMode.major }, { value: VersionMode.minor }, { value: VersionMode.patch }],
  });
  const features = await input({
    message: '请输入版本特性: ',
    transformer(val) {
      return val.trim();
    },
  });

  context.checkout();
  context.version(version);
  await context.test();
  context.publish(features);
}

main();
