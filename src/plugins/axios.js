"use strict";

import Vue from 'vue';
import axios from "axios";
import { Loading } from 'element-ui';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
axios.defaults.baseURL = 'http://localhost:6500/'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

let loadingArr = 0
let loadingInstance

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    loadingArr--; // 动画加载个数减1
    if (loadingArr === 0) {
        loadingInstance.close();
    }
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

// 在请求头中加token(interceptors为axios拦截器，在每次ajax请求时都会触发)
_axios.interceptors.request.use(
  config => {
  // 判断是否存在token，如果存在的话，则每个http header都加上token
    let token = sessionStorage.getItem('token')
    if (!config.headers.hasOwnProperty('Authorization') && token) {
      config.headers.Authorization = token;
    }
    loadingInstance = Loading.service({ // 加载动画
        text: '玩命加载中',
        background: 'rgba(255, 255, 255, 0.6)'
    });
    loadingArr++;
    return config;
  },
  error => {
    return Promise.reject(error);
  });

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
