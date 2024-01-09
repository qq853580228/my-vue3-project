import legacy from '@vitejs/plugin-legacy';

export default function createAutoImport() {
  return legacy({
    targets: ['defaults', 'not IE 11', 'chrome 79', 'maintained node versions'],
    additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    // 根据你自己需要导入相应的polyfill:  https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#polyfill-specifiers
    modernPolyfills: ['es.promise.finally', 'es/array', 'es/map', 'es/set'],
  });
}
