import inquirer from 'inquirer';
import type { Answer } from './types';
import { getParams } from './cmd';
import { loadContext } from './loadContext';

async function main() {
  const params = await getParams();
  const context = await loadContext(params);
  const promise = inquirer.prompt([
    {
      type: 'input',
      prefix: '📦',
      message: '请选择版本号变更规则: ',
      name: 'version',
      choices: ['major', 'minor', 'patch'],
    },
    {
      type: 'editor',
      prefix: '👍',
      message: '请输入版本特性: ',
      name: 'features',
      filter: (raw: string) => raw.trim(),
    },
  ]);
  const answer: Answer = await promise;

  context.checkout();
  context.version(answer.version);
  await context.test();
  context.publish(answer.features);
}

main();
