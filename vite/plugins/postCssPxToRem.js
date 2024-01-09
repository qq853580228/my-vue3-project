import postCssPxToRem from 'postcss-pxtorem';

export default function postCssPxToRemFn() {
  return postCssPxToRem({
    // rootValue: 37.5, // 设计图最大宽度除以10，比如750的宽就写成75
    rootValue ({ file }) {
      // 如果是 Vant 的样式就按照 37.5 处理转换
      // 如果是我们自己的样式就按照 75 处理转换
      return file.indexOf('vant') !== -1 ? 37.5 : 75
      // 这样做的好处是当拿到width为750px的设计稿是其中的内容width是
      // 多少就直接写多少即可，不用除以2了
    },
    unitPrecision: 5, //允许rem单位增长的十进制数字
    replace: true, //替换包含rems的规则，而不添加后备
    mediaQuery: false, //允许在媒体查询中转换px
    minPixelValue: 0, //设置要替换的最小像素值
    propList:['*'], //可以从px转换为rem的属性，匹配正则
    // exclude:/node_modules/i  //要忽略并保留为px的文件路径
    selectorBlackList: ['van'], // 不需要将px转换为rem的文件可写在这里
  });
}