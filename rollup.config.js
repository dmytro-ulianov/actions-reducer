const pkg = require('./package.json')

const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const ignore = require('rollup-plugin-ignore')
const json = require('rollup-plugin-json')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const {terser} = require('rollup-plugin-terser')

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json']

const commonPlugins = [
  babel({
    extensions,
    exclude: ['node_modules/**'],
  }),
  resolve({extensions, preferBuiltins: false}),
]

const getPlugins = umd => {
  return umd
    ? [
        ...commonPlugins,
        commonjs(),
        ignore(['stream']),
        terser(),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        json(),
      ]
    : commonPlugins
}

const getOutput = (umd, pkg) => {
  return umd
    ? {
        name: 'ActionsReducer',
        file: pkg.unpkg,
        format: 'umd',
        exports: 'named',
      }
    : [
        {
          file: pkg.main,
          format: 'cjs',
          exports: 'named',
        },
        {
          file: pkg.module,
          format: 'es',
        },
      ]
}

const createConfig = ({umd, pkg, plugins = [], ...config}) => ({
  plugins: [...getPlugins(umd), ...plugins],
  output: getOutput(umd, pkg),
  ...config,
})

export default [
  createConfig({
    pkg,
    input: 'src/index.ts',
    output: [
      {
        format: 'es',
        dir: 'es',
      },
      {
        format: 'cjs',
        dir: 'lib',
        exports: 'named',
      },
    ],
  }),
  createConfig({pkg, input: 'src/index.ts', umd: true}),
]
