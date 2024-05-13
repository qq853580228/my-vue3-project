import axios from 'axios';
import { Modal, message as $message } from 'ant-design-vue';
import errorCode from '@/utils/errorCode'
import { userInfo } from '@/stores/modules/user';
import { ACCESS_TOKEN, SUCCESS_CODE } from '@/stores/modules/mutation-types';
import cache from './cache';

// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// axios.defaults.withCredentials = true; // 表示跨域请求时是否需要使用凭证，跨域访问需要发送cookie时一定要加
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 15000,
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken == false
    console.log('isToken', isToken);
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (token && !isToken) {
      config.headers["Authorization"] = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    // update-begin-author: taoyan date:2020707 for:多租户
    // let tenantid = Vue.ls.get(TENANT_ID);
    // if (!tenantid) {
    //   tenantid = 0;
    // }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      config.headers["Content-Type"] = 'application/x-www-form-urlencoded';
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
      const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
      if (requestSize >= limitSize) {
        console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
        return config;
      }
      const sessionObj = cache.session.getJSON('sessionObj')
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url;                // 请求地址
        const s_data = sessionObj.data;              // 请求数据
        const s_time = sessionObj.time;              // 请求时间
        const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }
    // let sign = signMd5Utils.getSign(config.url, signData);
    // //将签名和时间戳，添加在请求接口 Header
    // let signHeader = {
    //   "X-Sign": sign,
    //   "X-TIMESTAMP": signMd5Utils.getDateTimeToString(),
    // };
    // config.headers = { ...config.headers, ...signHeader };
    // // console.log(window._CONFIG,'环境参数')
    // // console.log(Vue);
    // config.headers["X-App-Code"] = window._CONFIG["appCode"] || "PSC-TB-WEB";
    // config.headers["tenant-id"] = tenantid;
    // //update-end-author:taoyan date:2020707 for:多租户
    // if (config.method == "get") {
    //   if (config.url.indexOf("sys/dict/getDictItems") < 0) {
    //     config.params = {
    //       _t: Date.parse(new Date()) / 1000,
    //       ...config.params,
    //     };
    //   }
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(response => {
  const res = response.data;
  const msg = res.msg || errorCode['default'];
  if (res.code !== SUCCESS_CODE) {
    $message.error(msg);
    // Illegal token
    if ([1101, 1105].includes(res.code)) {
      // to re-login
      Modal.confirm({
        title: '警告',
        content: res.msg || '账号异常，您可以取消停留在该页上，或重新登录',
        okText: '重新登录',
        cancelText: '取消',
        onOk: () => {
          localStorage.clear();
          window.location.reload();
        },
      });
    }

    // throw other
    const error = new Error(msg);
    error.code = res.code;
    return Promise.reject(error);
  } else {
    return res;
  }
},
error => {
  if (!error) {
    // 处理 422 或者 500 的错误异常提示
    const errMsg = error?.response?.data?.msg ?? errorCode['default'];
    $message.error({ content: errMsg, key: errMsg });
    error.message = errMsg;
  }
  return Promise.reject(error)
})
/**
 * Blob解析
 * @param data
 */
function blobToJson(data) {
  let fileReader = new FileReader();
  let token = Vue.ls.get(ACCESS_TOKEN);
  fileReader.onload = function () {
    try {
      let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
      console.log("jsonData", jsonData);
      if (jsonData.status === 500) {
        console.log("token----------》", token);
        if (token && jsonData.msg.includes("Token失效")) {
          Modal.error({
            title: "登录已过期",
            content: "很抱歉，登录已过期，请重新登录",
            okText: "重新登录",
            mask: false,
            onOk: () => {
              store.dispatch("Logout").then(() => {
                Vue.ls.remove(ACCESS_TOKEN);
                window.location.reload();
              });
            },
          });
        }
      }
    } catch (err) {
      // 解析成对象失败，说明是正常的文件流
      console.log("blob解析fileReader返回err", err);
    }
  };
  fileReader.readAsText(data);
};
/**
* 参数处理
* @param {*} params  参数
*/
function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof (value) !== "undefined") {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result
};

export default service;