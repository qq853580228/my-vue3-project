import SvgIcon from '@/components/SvgIcon';
import IconFont from '@/components/Iconfont';

/**
 * 全局注册自定义组件
 * @param app
 */
export function setupCustomComponents(app) {
  app.component(SvgIcon.name, SvgIcon);
  app.component(IconFont.name, IconFont);
}
