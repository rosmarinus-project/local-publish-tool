import { Command } from 'commander';
import type { Params } from './types';

const program = new Command();

program.name('rosmarinus-publish').usage('<command> [options]').description('a tool which can help publish npm local');

export function getParams(): Promise<Params> {
  return new Promise((resolve) => {
    program
      .command('publish')
      .option('--config', '配置')
      .action((result) => {
        resolve(result);
      });
    program.parse(process.argv);
  });
}
