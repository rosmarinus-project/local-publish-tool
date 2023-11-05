import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const external = Object.keys(pkg.dependencies);

function getConfig(format) {
  return {
    input: 'src/index.ts',
    output: {
      file: `dist/${format}/index.js`,
      format,
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

export default [getConfig('cjs'), getConfig('es')];
