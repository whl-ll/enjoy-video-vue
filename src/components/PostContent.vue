<script>
import CommonHeader from "@/components/CommonHeader.vue";
import PostVideo from "@/components/PostVideo.vue";

export default {
  name: "PostContent",
  components: {PostVideo, CommonHeader}
}
</script>

<template>
<div class="post-content-container">
  <CommonHeader/>
  <PostVideo/>
</div>
</template>

<style scoped lang="less">

</style>