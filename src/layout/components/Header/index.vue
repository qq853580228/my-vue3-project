<template>
  <a-layout-header :style="headerStyle" class="layout-header">
    <div class="layout-header-left">
      <slot>
        <div class="hamburger-container" @click="() => emit('update:collapsed', !collapsed)">
          <component :style="{ fontSize: '18px' }" :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
        </div>
        <breadcrumb />
      </slot>
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
              <a-menu-item v-if="layoutSetting.showSettings" @click="showSetting">
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
    <setting ref="settingRef" />
  </a-layout-header>
</template>

<script setup>
  import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  import Setting from '@/layout/components/Setting';
  import useSetting from '@/stores/modules/settings';
  import Screenfull from '@/components/Screenfull';
  import HeaderSearch from '@/components/HeaderSearch/index.vue';
  import Breadcrumb from '../Breadcrumb/index.vue';
  import { userInfo } from '@/stores/modules/user';
  import useKeepAliveStore from '@/stores/modules/keepAlive';
  import { LOGIN_NAME } from '@/stores/modules/mutation-types';

  const settingRef = shallowRef(null);

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
    console.log('navTheme', navTheme);
    return {
      backgroundColor: navTheme === 'realDark' || isDark ? '' : 'rgba(255, 255, 255, 0.85)',
      color: isDark ? 'rgba(255, 255, 255, 0.85)' : '',
    };
  });

  // 布局设置
  const showSetting = () => {
    settingRef.value.showDrawer();
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
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    padding-right: 12px;
    height: @header-height;
    .layout-header-left {
      display: flex;
      width: calc(100% - 150px);
      flex: 1;
      :deep(.topmenu) {
        width: calc(100% - 160px);
        flex: 1;
        .menu-container {
          height: 100%;
        }
      }
    }
    .hamburger-container {
      padding-left: 12px;
      height: 100%;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
    .right-menu {
      flex-shrink: 0;
      min-width: 150px;
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