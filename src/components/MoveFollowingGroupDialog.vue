<script>
import userUtils from "@/utils/userUtils";
import userCenterApi from "@/api/userCenterApi";

export default {
  name: "MoveFollowingGroupDialog",
  mixins:[userUtils],
  props:['followingGroups', 'followingId','currentGroupId'],
  data(){
    return {
      radio:this.currentGroupId,
    }
  },

  methods:{
    async updateFollowingGroup(){
      let params = {
        followingId:this.followingId,
        groupId:this.radio
      }
      await userCenterApi.updateUserFollowing(params);
      location.reload();
    }
  }

}
</script>

<template>

  <div class="groups-container">
    <el-radio-group v-model="radio" class="groups">
      <el-radio v-for="group in followingGroups"
                :key="group.id"
                :label="group.id"
                class="group-item">
        {{group.name}}
      </el-radio>
    </el-radio-group>

    <el-button type="primary"
               @click="updateFollowingGroup">
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