// 自动导入ui-组件
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default function createAutoImport() {
  return Components({
    // dirs 指定组件所在位置，默认为 src/components
    // 可以让我们使用自己定义组件的时候免去 import 的麻烦
    dirs: ['src/components/'],
    // 配置需要将哪些后缀类型的文件进行自动按需引入
    extensions: ['vue', 'md'],
    resolvers: [
      AntDesignVueResolver({ importStyle: 'less', resolveIcons: true }),
      // VantResolver(),
    ],
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    // 解决组件命名冲突问题
    directoryAsNamespace: true,
  });
}
