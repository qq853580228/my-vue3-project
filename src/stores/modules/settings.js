import { defineStore } from 'pinia';
import { theme as antdTheme } from 'ant-design-vue';
import { themeColor, defaultSetting } from '@/layout/components/Setting/constant';

const layoutSetting = { ...defaultSetting };

const setting = defineStore('layoutSetting', {
  state: () => {
    return {
      title: '',
      collapsed: false, // 是否水平折叠收起菜单
      layoutSetting,
      themeConfig: {
        algorithm: themeColor[layoutSetting.navTheme] || antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: layoutSetting.colorPrimary,
        },
      }
    }
  },
  actions: {
    setTitle(title) {
      this.title = title;
      if (this.layoutSetting.dynamicTitle) {
        document.title = this.layoutSetting.title + ' - ' + title;
      } else {
        document.title = title ? `${title}` : this.layoutSetting.title;
      }
    },
    collapsedChange() {
      this.collapsed = !this.collapsed;
    },
    updateLayoutSetting(settings) {
      this.layoutSetting = Object.assign(this.layoutSetting, settings);
      const { navTheme, colorPrimary } = this.layoutSetting;
      if (navTheme) {
        this.toggleTheme(navTheme)
      }
      if (colorPrimary) {
        this.setColorPrimary(colorPrimary);
      }
    },
    toggleTheme(navTheme) {
      if (navTheme === 'realDark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      this.themeConfig.algorithm = themeColor[navTheme];
    },
    setColorPrimary(color) {
      this.themeConfig.token.colorPrimary = color;
    },
  },
  getters: {
    getNavTheme: state => state.layoutSetting.navTheme,
  },
  persist: {
    // 设置key名 默认持久所有的数据
    key: 'setting',
    // 修改存储位置 默认在localStorage中
    storage: localStorage,
    // 只想持久化单个数据
    // paths: ['layoutSetting'], // 要持久化的属性
  },
});

export default setting;