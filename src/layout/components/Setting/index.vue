<template>
  <a-drawer v-model:open="visible" placement="right" :closable="false">
    <a-descriptions title="整体风格" :column="5">
      <a-descriptions-item v-for="theme in themeStyle" :key="theme.value">
        <a-tooltip :title="theme.label">
          <div
            class="style-checbox-item"
            :class="{ active: layoutSetting.navTheme === theme.value }"
            @click="setNavTheme(theme.value)"
          >
            <svg-icon :name="theme.value" size="50"></svg-icon>
          </div>
        </a-tooltip>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="主题色" :column="9">
      <a-descriptions-item v-for="item in themeColors" :key="item.key">
        <div class="style-checbox-item">
          <a-tooltip :title="item.title">
            <a-tag :color="item.value" @click="setThemeColor(item.value)">
              <span :style="{ visibility: getThemeColorVisible(item.value) }"> ✔ </span>
            </a-tag>
          </a-tooltip>
        </div>
      </a-descriptions-item>
      <a-descriptions-item key="custom">
        <div class="style-checbox-item">
          <a-tooltip title="自定义">
            <a-tag :color="customColor" class="color-container">
              <input
                v-model="customColor"
                type="color"
                class="input-color"
                :style="colorPickerStyle"
                @input="setCustomColor"
              />
              <span :style="{ visibility: getThemeColorVisible(customColor) }"> ✔ </span>
            </a-tag>
          </a-tooltip>
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="导航模式" :column="5">
      <a-descriptions-item v-for="item in layouts" :key="item.value">
        <div
          class="style-checbox-item"
          :class="{ active: layoutSetting.layout === item.value }"
          @click="setLayout(item.value)"
        >
          <svg-icon :name="item.value" size="50"></svg-icon>
        </div>
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup name="ProjectSetting">
  import { layouts, themeColors, themeStyle } from './constant';
  import useSetting from '@/stores/modules/settings';
  import utils from '@/utils';

  const layoutSettingStore = useSetting();
  const { layoutSetting } = storeToRefs(layoutSettingStore);
  const customColor = ref(layoutSetting.value.colorPrimary);
  const visible = ref(false);

  const colorPickerStyle = computed(() => ({ '--custom-color': customColor.value }));

  const setNavTheme = (theme) => {
    layoutSettingStore.updateLayoutSetting({ navTheme: theme });
  };
  const setLayout = (layout) => {
    layoutSettingStore.updateLayoutSetting({ layout });
  };

  const setThemeColor = (colorPrimary) => {
    layoutSettingStore.updateLayoutSetting({ colorPrimary });
  };

  const setCustomColor = utils.simpleDebounce(() => {
    setThemeColor(customColor.value);
  }, 300);

  const getThemeColorVisible = (color) =>
    layoutSetting.value.colorPrimary === color ? 'visible' : 'hidden';

  const showDrawer = () => {
    visible.value = true;
  };
  defineExpose({
    showDrawer,
  });
</script>

<style lang="less" scoped>
  .style-checbox-item {
    position: relative;
    cursor: pointer;
    &.active::after {
      content: '✔';
      position: absolute;
      right: 12px;
      bottom: 10px;
      color: @primary-color;
    }
    .color-container {
      position: relative;
      overflow: hidden;
      .input-color {
        position: absolute;
        inset: 0;
      }
    }
  }

  input[type='color'] {
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    outline: none;
    appearance: none;

    &::-webkit-color-swatch-wrapper {
      background: var(--custom-color);
    }

    &::-webkit-color-swatch {
      display: none;
    }
  }
</style>
