<template>
  <svg v-bind="$attrs" class="svg-icon" :style="getStyle" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup name="SvgIcon">
  const props = defineProps({
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 16,
    },
    color: {
      type: String,
      default: "",
    },
  });
  const symbolId = computed(() => `#${props.prefix}-${props.name}`);
  const getStyle = computed(() => {
    const { size, color } = props;
    const s = `${size}`.replace('px', '').concat('px');
    return {
      width: s,
      height: s,
      color,
    };
  });
</script>

<style lang="less">
  .svg-icon {
    overflow: hidden;
    fill: currentcolor;
    vertical-align: -0.15em;
  }
  .dark {
    .svg-icon {
      color: rgba(255, 255, 255, 0.85);
    }
  }
</style>
