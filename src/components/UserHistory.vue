<script>
import CommonHeader from "@/components/CommonHeader.vue";
import userUtils from "@/utils/userUtils";
import routerUtils from "@/utils/routerUtils";
import userHistoryApi from "@/api/userHistoryApi";

export default {
  name: "UserHistory",
  components: {CommonHeader},
  mixins:[userUtils, routerUtils],
  data(){
    return {
      histories:[],
      infiniteId:+new Date(),
      currentPage:1,
      size:3,
    }
  },
  methods:{

    pageListUserHistory($state){
      let params = {
        size:this.size,
        no:this.currentPage
      };
      userHistoryApi.pagListUserVideoHistory(params).then(response =>{
        if(response.data){
          const {list:histories} = response.data;
          if(histories.length === 0){
            // 已加载所有数据，不再触发加载
            $state.complete();
            return;
          }
          this.histories = this.histories.concat(histories);
          this.currentPage++; // 递增当前页码
          $state.loaded(); // 标记加载完成
        }
      }).catch(error => {
        // 捕获异常
        console.error('请求出错:', error);
        $state.complete();
      });
    }

  },

  mounted() {
    if(!this.isUserLoggedIn){
      window.alert('请先登录');
      this.jumpToPath('/');
    }
  }
}
</script>

<template>
  <div class="user-history">
    <CommonHeader/>
    <div class="user-history-container">
<!--      头部区域-->
      <div class="history-header">
        <span style="color: white; font-weight: bolder; font-size: 22px">历史记录</span>

      </div>
<!--      历史列表-->
      <div class="user-history-list">
        <div class="user-history-list-item" v-for="(history, index) in histories"
             :key="index">
          <img :src="history.thumbnail" alt="">
          <div class="user-history-video-detail">
            <div class="user-history-video-detail-title"
                 @click="jumpToVideoDetail(history.videoId)"
                 style="cursor: pointer; font-size: 20px;">
              {{history.title}}
            </div>
            <div class="user-history-video-detail-description">
              {{history.description}}
            </div>
            <div class="user-history-video-detail-createTime">
              观看时间：{{history.createTime}}
            </div>
          </div>
        </div>
        <infinite-loading :identifier="infiniteId"
                          @infinite="pageListUserHistory">
        </infinite-loading>
      </div>
    </div>
  </div>

</template>

<style scoped lang="less">

.user-history-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #4e4e7a;

  .history-header{
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .user-history-list{
    width: 60%;
    margin-top: 10px;

    .user-history-list-item{
      background-color: white;
      padding: 20px;
      display: flex;
      margin-bottom: 10px;
      border-radius: 5px;

      img{
        max-height: 90px;
        max-width: 160px;
        border-radius: 5px;
      }

      .user-history-video-detail{
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .user-history-video-detail-createTime{
          color: gray;
        }

      }

    }
  }

}

</style>