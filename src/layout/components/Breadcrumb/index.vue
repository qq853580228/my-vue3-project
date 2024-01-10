<template>
  <div class="breadcrumb-container">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(routeItem, rotueIndex) in menus" :key="routeItem?.name">
        {{routeItem?.meta?.title}}
        <!-- <template v-if="routeItem?.children?.length" #overlay>
          <a-menu :selected-keys="getSelectKeys(rotueIndex)">
            <template v-for="childItem in routeItem?.children" :key="childItem.name">
              <a-menu-item
                v-if="!childItem.meta?.hideInMenu && !childItem.meta?.hideInBreadcrumb"
                :key="childItem.name"
                @click="clickMenuItem(childItem)"
              >
                {{ childItem.meta?.title }}
              </a-menu-item>
            </template>
          </a-menu>
        </template> -->
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script setup>
  import { userInfo } from '@/stores/modules/user';

  const userStore = userInfo();
  const route = useRoute();
  const router = useRouter();

  const menus = computed(() => {
    console.log('route.meta?.namePath', route);
    if (route.meta?.namePath) {
      let children = userStore.menus;
      console.log('children', children);
      const paths = route.meta?.namePath?.map((item) => {
        const a = children.find((n) => n.name === item);
        children = a?.children || [];
        return a;
      });
      console.log('paths', paths);
      return [
        {
          name: '__index',
          meta: {
            title: '首页',
          },
          children: userStore.menus,
        },
        ...paths,
      ];
    }
    return route.matched;
  });

  const getSelectKeys = (rotueIndex) => {
    console.log('getSelectKeys', menus.value, rotueIndex + 1, [menus.value[rotueIndex + 1]?.name]);
    return [menus.value[rotueIndex + 1]?.name];
  };

  const findLastChild = (route = {}) => {
    if (typeof route?.redirect === 'object') {
      const redirectValues = Object.values(route.redirect);
      if (route?.children?.length) {
        const target = route.children.find((n) =>
          redirectValues.some((m) => [n.name, n.path, n.meta?.fullPath].some((v) => v === m)),
        );
        return findLastChild(target);
      }
      return redirectValues.find((n) => typeof n === 'string');
    } else if (typeof route?.redirect === 'string') {
      if (route?.children?.length) {
        const target = route.children.find((n) =>
          [n.name, n.path, n.meta?.fullPath].some((m) => m === route?.redirect),
        );
        return findLastChild(target);
      }
      return route?.redirect;
    }
    return route;
  };
  const getRouteByName = (name) => router.getRoutes().find((n) => n.name === name);

  // 点击菜单
  const clickMenuItem = (menuItem) => {
    const lastChild = findLastChild(menuItem);
    console.log('lastChild', menuItem, lastChild);

    const targetRoute = getRouteByName(lastChild?.name);
    const { isExt, openMode } = targetRoute?.meta || {};
    if (isExt && openMode !== 2) {
      window.open(lastChild?.name);
    } else {
      router.push({ name: lastChild?.name });
    }
  };

</script>
<style lang="less" scoped>
  .breadcrumb-container {
    float: left;
    padding-left: 20px;
    height: 100%;
    display: inline-flex;
    align-items: center;
  }
</style>