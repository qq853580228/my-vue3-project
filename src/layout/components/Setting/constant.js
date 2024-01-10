import { theme } from 'ant-design-vue';

const { defaultAlgorithm, darkAlgorithm } = theme;
const title = import.meta.env.VITE_APP_NAME;

export const defaultSetting = {
  navTheme: 'dark', // theme for nav menu
  colorPrimary: '#1677FF', // '#F5222D', // primary color of ant design
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  iconfontUrl: '',
  /**
   * 网页标题
   */
  title,
  /**
   * 是否系统布局配置
   */
  showSettings: true,

  /**
   * 是否显示顶部导航
   */
  topNav: false,

  /**
   * 是否显示 tabsView
   */
  tabsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
};

export const themeStyle = [
  {
    label: '亮色主题风格',
    value: 'light',
  },
  {
    label: '暗色主题风格',
    value: 'dark',
  },
  {
    label: '暗黑模式',
    value: 'realDark',
  },
];

/** 主题色 */
export const themeColor = {
  light: defaultAlgorithm,
  dark: defaultAlgorithm,
  realDark: darkAlgorithm,
};


/** 主题色 */
export const themeColors = [
  {
    title: '拂晓蓝（默认）',
    key: 'techBlue',
    value: '#1677FF',
  },
  {
    title: '薄暮',
    key: 'dust',
    value: '#F5222D',
  },
  {
    title: '火山',
    key: 'volcano',
    value: '#FA541C',
  },
  {
    title: '日暮',
    key: 'sunset',
    value: '#FAAD14',
  },
  {
    title: '明青',
    key: 'cyan',
    value: '#13C2C2',
  },
  {
    title: '极光绿',
    key: 'green',
    value: '#52C41A',
  },
  {
    title: '极客蓝',
    key: 'geekblue',
    value: '#2F54EB',
  },
  {
    title: '酱紫',
    key: 'purple',
    value: '#722ED1',
  },
];

/** 导航模式（布局方式） */
export const layouts = [
  {
    label: '侧边菜单布局',
    value: 'sidemenu',
  },
  {
    label: '顶部菜单布局',
    value: 'topmenu',
  },
];
