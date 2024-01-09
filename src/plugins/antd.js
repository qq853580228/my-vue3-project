import 'ant-design-vue/dist/reset.css';
import { AButton } from '@/components/basic/button/index';

export function setupAntd(app) {
  app.component('AButton', AButton);
}
