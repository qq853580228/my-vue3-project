<template>
  <div class="login-box">
    <div class="login-logo">
      <img src="~@/assets/images/logo.png" style="width: 50px" />
      <h1 class="mb-0 ml-2 text-3xl font-bold">后台管理系统</h1>
    </div>
    <a-form layout="horizontal" :model="loginForm" @submit.prevent="handleLogin">
      <a-form-item>
        <a-input v-model:value="loginForm.username" size="large" placeholder="admin">
          <template #prefix> <Icon icon="ant-design:user-outlined" /> </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="loginForm.password"
          size="large"
          type="password"
          placeholder="a123456"
          autocomplete="new-password"
        >
          <template #prefix> <Icon icon="ant-design:lock-outlined" /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="loginForm.verifyCode"
          placeholder="验证码"
          :maxlength="4"
          size="large"
        >
          <template #prefix> <Icon icon="ant-design:safety-outlined" /> </template>
          <template #suffix>
            <span
              v-html="captchaImg"
              class="captcha"
              @click="updateCaptcha"
            />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" size="large" :loading="loading" block>
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
  import { message, Modal } from 'ant-design-vue';
  import { userInfo } from '@/stores/modules/user';
  import { getCodeImg } from '@/api/login';
  import { to } from '@/utils/awaitTo';

  const route = useRoute();
  const router = useRouter();

  const userStore = userInfo();

  const loading = ref(false);
  const captchaImg = ref('');
  const captcha = ref('');
  const loginForm = ref({
    username: 'admin',
    password: '123456',
    verifyCode: '',
  });
  // const model = reactive({ accessToken: 'bls' });
  
  const updateCaptcha = async () => {
    const { data: { img, text } } = await getCodeImg({ width: 100 });
    captcha.value = text;
    captchaImg.value = img;
  };
  updateCaptcha();

  const handleLogin = async () => {
    const { username, password, verifyCode } = loginForm.value;
    if (username.trim() == '' || password.trim() == '') {
      return message.warning('用户名或密码不能为空！');
    }

    if (!verifyCode) {
      return message.warning('请输入验证码！');
    }

    if (captcha.value !== verifyCode) {
      loginForm.value.verifyCode = ''
      updateCaptcha();
      return message.warning('验证码错误！');
    }

    message.loading('登录中...', 0);
    loading.value = true;
    const [err] = await to(userStore.handleLogin(loginForm.value));
    if (err) {
      Modal.error({
        title: () => '提示',
        content: () => err.msg,
      });
      loginForm.value.verifyCode = ''
      updateCaptcha();
    } else {
      const query = route.query;
      const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
      setTimeout(() => {
        message.success('登录成功！');
        router.push({ path: route.query && route.query.redirect || '/', query: otherQueryParams });
      }, 0);
    }
    loading.value = false;
    message.destroy();
  };
</script>

<style lang="less" scoped>
  .login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-size: 100%;

    .login-logo {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .svg-icon {
        font-size: 48px;
      }
    }
    .captcha {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      height: 100%;
    }
    :deep(.ant-form) {
      width: 400px;

      .ant-col {
        width: 100%;
      }

      .ant-form-item-label {
        padding-right: 6px;
      }
    }
  }
</style>