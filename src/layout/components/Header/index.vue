<template>
  <a-layout-header :style="headerStyle" class="layout-header">
    <div class="hamburger-container" @click="() => emit('update:collapsed', !collapsed)">
      <component :style="{ fontSize: '18px' }" :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
    </div>
    <div class="breadcrumb-container">
      <a-breadcrumb>
        <a-breadcrumb-item v-for="(routeItem, rotueIndex) in menus" :key="routeItem?.name">
          {{routeItem?.meta?.title}}
          <template v-if="routeItem?.children?.length" #overlay>
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
          </template>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="right-menu">
      <header-search id="header-search" class="right-menu-item" />

      <screenfull id="screenfull" class="right-menu-item hover-effect" />

      <div class="avatar-container">
        <a-dropdown class="right-menu-item hover-effect">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <span class="user-name">{{ userStore.name }}</span>
          </div>
          <template #overlay>
            <a-menu>
              <router-link to="/account/settings">
                <a-menu-item>个人中心</a-menu-item>
              </router-link>
              <a-menu-item v-if="layoutSetting.showSettings">
                <span>布局设置</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item @click="doLogout">
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup>
  import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  import useSetting from '@/stores/modules/settings';
  import Screenfull from '@/components/Screenfull';
  import HeaderSearch from '@/components/HeaderSearch/index.vue';
  import { userInfo } from '@/stores/modules/user';
  import useKeepAliveStore from '@/stores/modules/keepAlive';
  import { LOGIN_NAME } from '@/stores/modules/mutation-types';

  defineProps({
    collapsed: {
      type: Boolean,
    },
  });

  const emit = defineEmits(['update:collapsed']);

  const router = useRouter();
  const route = useRoute();
  const keepAliveStore = useKeepAliveStore();
  const userStore = userInfo();
  const { layoutSetting } = useSetting();
  const headerStyle = computed(() => {
    const { navTheme, layout } = layoutSetting;
    const isDark = navTheme === 'dark' && layout === 'topmenu';
    return {
      backgroundColor: navTheme === 'realDark' || isDark ? '' : 'rgba(255, 255, 255, 0.85)',
      color: isDark ? 'rgba(255, 255, 255, 0.85)' : '',
    };
  });

  const menus = computed(() => {
    if (route.meta?.namePath) {
      let children = userStore.menus;
      const paths = route.meta?.namePath?.map((item) => {
        const a = children.find((n) => n.name === item);
        children = a?.children || [];
        return a;
      });
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

  // 退出登录
  const doLogout = () => {
    Modal.confirm({
      title: '您确定要退出登录吗？',
      // icon: <QuestionCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        await userStore.handleLogOut();
        keepAliveStore.clear();
        // 移除标签页
        localStorage.clear();
        message.success('成功退出登录');
        await nextTick();
        try {
          // location.href = route.fullPath;
          router.replace({
            name: LOGIN_NAME,
            query: {
              redirect: route.fullPath,
            },
          });
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

</script>
<style lang="less" scoped>
  .layout-header {
    position: relative;
    padding-left: 20px;
    padding-right: 12px;
    height: @header-height;
    background: #fff;
    .hamburger-container {
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
    .breadcrumb-container {
      float: left;
      padding-left: 20px;
      height: 100%;
      display: inline-flex;
      align-items: center;
    }
    .right-menu {
      float: right;
      height: 100%;
      line-height: @header-height;
      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        display: inline-block;
        .avatar-wrapper {
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 26px;
            height: 26px;
            border-radius: 10px;
            vertical-align: middle
          }
          .user-name {
            padding-left: 10px;
            font-size: 16px;
            vertical-align: middle
          }
          i {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>