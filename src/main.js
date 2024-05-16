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

Vue.use(InfiniteLoading);

Vue.use(ElementUI);

/**
 * main.js文件是Vue.js应用程序的入口文件。
 * 它主要负责初始化Vue实例，并将根组件挂载到HTML文档中的某个元素上。
 *
 * Vue.config.productionTip = false是Vue.js 中的一个配置选项，
 * 用于控制是否在控制台中显示生产提示。当设置为 false 时，它会禁用 Vue.js 开发模式下的警告。
 * 实际生产环境一般会关闭这个选项，减少打包后的包体积，提升代码运行效率。
 */
Vue.config.productionTip = false

new Vue({
  // render(createElement){
  //   return createElement(App);
  // },
  //
  // render:(createElement) => {
  //   return createElement(App);
  // }
  //
  // render:createElement => createElement(App);
  //
  // render:h => h(App);
  router,
  store,
  /**
   * render返回一个完整的虚拟DOM树。
   * createElement通常在render中使用，用于创建虚拟DOM树的元素。
   */
  render: h => h(App),
}).$mount('#app')
