import { defineComponent, unref, computed } from 'vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';

// let scriptUrls = [`${import.meta.env.BASE_URL}iconfont.js`];

let MyIconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
  // scriptUrl: '//at.alicdn.com/t/font_2184398_zflo1kjcemp.js',
  // iconfont字体图标本地化，详见：/public/iconfont.js
  // scriptUrl: scriptUrls,
});

export default defineComponent({
  name: 'IconFont',
  props: {
    type: {
      type: String,
      default: '',
    },
    prefix: {
      type: String,
      default: 'icon-',
    },
    color: {
      type: String,
      default: 'unset',
    },
    size: {
      type: [Number, String],
      default: 14,
    },
    scriptUrl: {
      // 阿里图库字体图标路径
      type: String,
      default: '',
    },
  },
  setup(props, { attrs }) {
    // 如果外部传进来字体图标路径，则覆盖默认的
    if (props.scriptUrl) {
      // scriptUrls = [...new Set(scriptUrls.concat(props.scriptUrl))];
      MyIconFont = createFromIconfontCN({
        scriptUrl: props.scriptUrls,
      });
    }

    const wrapStyleRef = computed(() => {
      const { color, size } = props;

      const fs = typeof size === 'string' ? parseFloat(size) : size;

      return {
        color,
        fontSize: `${fs}px`,
      };
    });

    return () => {
      const { type, prefix } = props;

      return type ? (
        <MyIconFont
          type={type.startsWith(prefix) ? type : `${prefix}${type}`}
          {...attrs}
          style={unref(wrapStyleRef)}
        />
      ) : null;
    };
  },
});
