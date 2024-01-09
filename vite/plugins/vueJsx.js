import vueJsx from '@vitejs/plugin-vue-jsx';

export default function createAutoImport() {
  return vueJsx({
    include:/\.[jt]sx$|\.js$/
  });
}
