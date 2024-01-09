import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import 'amfe-flexible'
import router from '@/routers';
import pinia from '@/stores';
import '@/permission';

import { setupAssets, setupCustomComponents } from '@/plugins';

const app = createApp(App);

function setupPlugins() {
  // 引入静态资源
  setupAssets();
  // 注册全局自定义组件,如：<svg-icon />
  setupCustomComponents(app);
  // 注册全局自定义指令，如：v-permission权限指令
  // setupDirectives(app);
  // 注册全局方法，如：app.config.globalProperties.$message = message
  // setupGlobalMethods(app);
}


async function setupApp() {
  // 挂载vuex状态管理
  app.use(pinia);

  // 挂载路由
  app.use(router);;

  app.mount('#app');
}

setupPlugins();

setupApp();