import request from '@/utils/request';

// 获取验证码
export function getCodeImg(params) {
  return request({
    url: '/auth/getCode',
    headers: {
      isToken: false
    },
    method: 'get',
    params,
  })
};

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
};