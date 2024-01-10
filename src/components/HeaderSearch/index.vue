<template>
  <div :class="{ 'show': show }" class="header-search">
    <svg-icon size="16" name="search" @click.stop="click" />
    <span @click.stop="">
      <a-select
        ref="headerSearchSelectRef"
        v-model:value="search"
        @search="querySearch"
        show-search
        default-active-first-option
        :filter-option="false"
        placeholder="Search"
        class="header-search-select"
        @change="change"
      >
        <a-select-option v-for="(item, index) in resultOptions" :key="item.name" :value="index">
          {{ item.meta?.title }}
        </a-select-option>
      </a-select>
    </span>
  </div>
</template>

<script setup>
  import { userInfo } from '@/stores/modules/user';
  import utils from '@/utils';

  const userStore = userInfo();
  const search = ref();
  const options = ref([]);
  const show = ref(false);
  const headerSearchSelectRef = ref(null);
  const router = useRouter();
  const menusList = computed(() => transformRouteToList(userStore.menus));
  const resultOptions = shallowRef([]);

  const click = () => {
    show.value = !show.value
    if (show.value) {
      headerSearchSelectRef.value && headerSearchSelectRef.value.focus()
    }
  };
  const close = () => {
    headerSearchSelectRef.value && headerSearchSelectRef.value.blur()
    options.value = []
    show.value = false
  }
  const change = index => {
    const { name, meta } = resultOptions.value[index];
    const { isExt, openMode } = meta;
    if (isExt && openMode !== 2) {
      window.open(name);
    } else {
      router.push({ name })
    }
    search.value = null
    resultOptions.value = [];
    nextTick(() => {
      show.value = false
    });
  }

  const querySearch = utils.simpleDebounce(val => {
    resultOptions.value = menusList.value.filter((menu) => {
      const title = menu.meta?.title;
      return val && title?.toLocaleLowerCase().includes(val.toLocaleLowerCase().trim());
    });
  }, 300);

  /** 将路由转换成菜单列表 */
  function transformRouteToList(routes = [], treeMap = []) {
    if (routes && routes.length === 0) return [];
    return routes.reduce((acc, cur) => {
      /** 允许在菜单内显示并且无子路由 */
      if (!cur.meta?.hideInMenu && !cur.children) {
        acc.push(cur);
      }
      if (cur.children && cur.children.length > 0) {
        transformRouteToList(cur.children, treeMap);
      }
      return acc;
    }, treeMap);
  }

  watch(show, (value) => {
    if (value) {
      document.body.addEventListener('click', close)
    } else {
      document.body.removeEventListener('click', close)
    }
  });

</script>

<style lang='less' scoped>
.header-search {

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    :deep(.a-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>