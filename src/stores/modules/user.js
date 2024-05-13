import { defineStore } from 'pinia';
import { resetRouter } from '@/routers';
import cache from '@/utils/cache';
import { generatorDynamicRouter } from '@/routers/generator-router';
import defAva from '@/assets/images/logo.png'
import { ACCESS_TOKEN } from '@/stores/modules/mutation-types';
import { login } from '@/api/login';

export const userInfo = defineStore('useUserInfo', {
  state: () => {
    return {
      name: 'bls',
      avatar: defAva,
      [ACCESS_TOKEN]: '',
      userInfo: {},
      menus: [],
      // roles: ['test'],
    }
  },
  actions: {
    async handleLogin(data) {
      try {
        const res = await login(data);
        this[ACCESS_TOKEN] = res.data[ACCESS_TOKEN];
        this.userInfo = res.data.userInfo;
        await this.afterLogin();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async afterLogin() {
      try {
        // const [userInfo, { perms, menus }] = await Promise.all([getInfo(), permmenu()]);
        // this.perms = perms;
        // this.name = userInfo.name;
        // this.avatar = userInfo.headImg;
        // this.userInfo = userInfo;
        const menus = [
          {
            name: 'User',
            router: '/user',
            parentId: null,
            id: '1',
            type: 0,
            isShow: true,
            // viewPath: 'user/index',
            keepAlive: false,
            meta: {
              title: '用户权限菜单',
              icon: 'icon-twitter',
            },
            children: [
              {
                "name": "TypeORM中文文档(外链)",
                "router": "https://www.bookstack.cn/read/TypeORM-0.2.20-zh/README.md",
                "type": 1,
                "isShow": true,
                viewPath: '',
                "isExt": true,
                "openMode": 1,
                meta: {
                  "icon": "icon-twitter",
                },
              },
              {
                "name": "antdv文档(内嵌)",
                "router": "https://next.antdv.com/components/overview-cn/",
                "icon": "icon-ant-design",
                "type": 1,
                viewPath: '',
                "isShow": true,
                "isExt": true,
                "openMode": 2,
                meta: {
                  "icon": "icon-duqushujuku",
                },
              },
              {
                name: 'UserChildren1',
                router: 'children1/:id',
                id: '1-1',
                parentId: '1',
                type: 1,
                viewPath: 'user/children1/index',
                "isShow": false,
                meta: {
                  title: '用户权限User - Children1',
                  roles: ['test'],
                },
              },
              {
                name: 'UserChildren1',
                router: 'children1/1',
                id: '1-2',
                parentId: '1',
                type: 1,
                viewPath: 'user/children1/index',
                "isShow": true,
                keepAlive: true,
                meta: {
                  title: '用户权限User - Children1',
                  roles: ['test'],
                },
              },
              {
                name: 'UserChildren1',
                router: 'children1/2',
                id: '1-3',
                parentId: '1',
                type: 1,
                viewPath: 'user/children1/index',
                "isShow": true,
                keepAlive: false,
                meta: {
                  title: '用户权限User - Children1',
                  roles: ['test'],
                },
              },
              {
                name: 'UserChildren2',
                router: 'children2',
                id: '1-2',
                parentId: '1',
                type: 1,
                viewPath: 'user/children2/index',
                "isShow": true,
                keepAlive: true,
                meta: {
                  title: '用户权限User - Children2',
                },
              },
            ],
          },
          {
            name: 'User2',
            router: '/user2',
            parentId: null,
            id: '2',
            type: 0,
            // component: 'user/index',
            isShow: true,
            keepAlive: false,
            meta: {
              title: '用户权限菜单2',
              // hideChildrenInMenu: true,
              "icon": "icon-twitter",
            },
            children: [
              {
                name: 'UserChildren',
                router: 'children1',
                id: '2-1',
                parentId: '2',
                type: 1,
                viewPath: 'user2/children1/index',
                "isShow": true,
                keepAlive: true,
                meta: {
                  title: '用户权限User2 - Children1',
                  roles: ['test'],
                },
              },
              {
                name: 'UserChildren2',
                router: 'children2',
                id: '2-2',
                parentId: '2',
                type: 1,
                viewPath: 'user2/children2/index',
                "isShow": false,
                keepAlive: false,
                meta: {
                  title: '用户权限User2 - Children2',
                  roles: ['test'],
                },
              },
            ],
          },
        ];
        // 生成路由
        const generatorResult = await generatorDynamicRouter(menus);
        this.menus = generatorResult.menus.filter((item) => !item.meta?.hideInMenu);
        console.log('generatorResult', this.menus);

        // return { menus, perms, userInfo };
        return { menus };
      } catch (error) {
        return Promise.reject(error);
        // return this.logout();
      }
    },
    handleLogOut() {
      return new Promise((resolve) => {
        this.resetToken();
        resetRouter();
        resolve();
      });
    },
    /** 清空token及用户信息 */
    resetToken() {
      this[ACCESS_TOKEN] = this.name = '';
      this.menus = [];
      this.userInfo = {};
      cache.local.clear();
    },
  },
  persist: {
    // 设置key名 默认持久所有的数据
    key: 'useUserInfo',
    // 修改存储位置 默认在localStorage中
    storage: localStorage,
    // 只想持久化单个数据
    paths: [ACCESS_TOKEN, 'userInfo'], // 要持久化的属性
  },
});