// 导入Vue库
import Vue from 'vue'
// 导入应用程序的根组件
import App from './App.vue'
import router from "@/router";
//引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui';
Element.Dialog.props.lockScroll.default=false;

import InfiniteLoading from 'vue-infinite-loading'
import store from '@/vuex/index'

//Vue.js 组件中实现懒加载缩略图，使用 Vue 的第三方库，vue-lazyload。
import VueLazyload from 'vue-lazyload'

Vue.use(InfiniteLoading);

Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  // 错误时显示的图片
  error: require('@/assets/main.jpg'),
  // 加载时显示的图片
  loading: require('@/assets/main.jpg'),
  attempt: 1
})

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.head.appendChild(link);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
