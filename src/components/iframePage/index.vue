<template>
  <div class="iframe-box wh-full">
    <a-spin :spinning="loading" size="large">
      <iframe class="wh-full" v-bind="$attrs" :src="src" @load="onFrameLoad"></iframe>
    </a-spin>
  </div>
</template>
<script setup name="IFramePage">

  defineProps({
    src: {
      type: String,
      required: true,
    },
  });

  const loading = ref(true);

  const onFrameLoad = () => {
    loading.value = false;
  };
</script>
<style lang="less" scoped>
  .wh-full {
    height: 100%;
    width: 100%;
  }
  .iframe-box {
    transform: translate(0);

    :deep(div[class^='ant-spin']) {
      height: 100%;
      width: 100%;
    }
  }
</style>
