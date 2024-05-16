<script>
import userUtils from "@/utils/userUtils";
import videoApi from "@/api/videoApi";

export default {
  name: "MoveCollectionDialog",
  mixins:[userUtils],
  props:['collectionGroups', 'moveVideoId', 'moveVideoGroupId'],
  data(){
    return {
      radio:this.moveVideoGroupId,
    }
  },

  methods:{
    async updateUserCollection(){
      console.log('moveVideoId', this.moveVideoId);
      const params = {
        videoId:this.moveVideoId,
        groupId:this.radio
      }
      await videoApi.updateVideoCollections(params);
      location.reload();
    }
  }

}
</script>

<template>

  <div class="groups-container">
    <el-radio-group v-model="radio" class="groups">
      <el-radio v-for="group in collectionGroups"
                :key="group.groupId"
                :label="group.groupId"
                class="group-item">
        {{group.groupName}}
      </el-radio>
    </el-radio-group>

    <el-button type="primary"
               @click="updateUserCollection">
      确定
    </el-button>
  </div>

</template>

<style scoped lang="less">
.groups-container{
  display: flex;
  align-items: center;
  flex-direction: column;
  .groups{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    .group-item{
      margin:0 0 20px 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>