<template>
  <div class="icp">{{`© ${year} ${author} ` }}<a href="https://beian.miit.gov.cn/" target="_blank">{{ record }}</a></div>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
      author: '于建伟',
      record: '皖ICP备2024049525号'
    };
  }
};
</script>

<style>
.icp {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10px 0;
  width: 100%;
  height: 36px;
  white-space: pre;
  text-align: center;
  color: gray;
  z-index: 1000;
}
.icp > a {
  color: gray;
  text-decoration: none;
}
.icp > a:hover {
  color: aqua;
  text-decoration: none;
}
</style>
