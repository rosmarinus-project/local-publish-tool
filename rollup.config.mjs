import common from '@rosmarinus/common-plugins';

const external = ['shelljs'];

/**
 *
 * @param {*} format
 * @param {*} banner
 * @returns {import('rollup').RollupOptions}
 */
function getConfig(format, banner) {
  return {
    input: 'src/index.ts',
    output: {
      file: `dist/${format}/index.js`,
      format,
      banner,
      sourcemap: true,
      inlineDynamicImports: true,
    },
    external,
    plugins: [common()],
  };
}

export default [getConfig('cjs', '#!/usr/bin/env node'), getConfig('es')];
