<!--包含了HTML的代码，用于定义组件的结构，而且可以嵌套VUE的指令、表达式、事件处理等等。-->
<template>
  <div id="app">
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <router-view></router-view>
  </div>
</template>

<!--脚本包含了组件的行为逻辑，数据、计算属性、方法等等-->
<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<!--样式，包含了组件的样式表，通常用的CSS预处理器。style是可选的，可以省略。-->
<style>

html body{
  margin: 0;
}

</style>
