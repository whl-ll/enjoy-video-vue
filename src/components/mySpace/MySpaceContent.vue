<template>
  <div class="my-space-content">
    <MySpaceNavigator/>
    <router-view></router-view>
  </div>
</template>


<script>
import MySpaceNavigator from "@/components/mySpace/MySpaceNavigator.vue";
import userUtils from "@/utils/userUtils";

export default {
  name: "MySpaceContent",
  mixins:[userUtils],
  components:{
    MySpaceNavigator
  },
  mounted() {
    if(!this.isUserLoggedIn){
      window.alert('请登录！');
      this.$router.push('/userLogin');
    }
  }
}
</script>


<style scoped lang="less">

</style>