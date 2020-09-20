import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const configs = {
  umd: {
    file: pkg.main,
    name: 'VueExpandTransition',
    globals: {
      vue: 'Vue'
    },
  },
  es: {
    file: pkg.module,
  }
}

export default ['umd', 'es'].map((format) => ({
  input: `src/index.${format}.ts`,
  output: {
    format,
    ...configs[format],
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ], plugins: [
    terser({
      format: {
        comments: false
      }
    }),
    typescript({
      objectHashIgnoreUnknownHack: true,
    })
  ],
}));