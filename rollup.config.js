import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const external = Object.keys(pkg.dependencies);

function getConfig(format, banner) {
  return {
    input: 'src/index.ts',
    output: {
      file: `dist/${format}/index.js`,
      format,
      banner,
      sourcemap: true,
    },
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
  };
}

export default [getConfig('cjs', '#!/usr/bin/env node'), getConfig('es')];
