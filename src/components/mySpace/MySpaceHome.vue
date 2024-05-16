<script>
import userUtils from "@/utils/userUtils";
import userCenterApi from "@/api/userCenterApi";
import routerUtils from "@/utils/routerUtils";

export default {
  name: "MySpaceHome",
  mixins:[userUtils, routerUtils],
  data(){
    return {
      videoCount:0,
      myPostVideos:[],
      collectionCount:0,
      myCollectionGroups:[],
      myCollections:[]

    }
  },

  methods:{

    async pageListVideos(){
      let params = {
        size:4,
        no:1
      }
      let response = await userCenterApi.pageListUserVideos({params});
      if(response.data){
        const pageResult = response.data;
        this.myPostVideos = pageResult.list;
        this.videoCount = pageResult.total;
      }
    },

    async pageListCollections(){
      let params = {
        size:9999999,
        no:1
      }
      let response = await userCenterApi.pageListUserCenterCollections(params);
      if(response.data){
        const {groups:groups}=response.data;
        const {pageResult:collections}=response.data;
        this.myCollectionGroups = groups;
        this.myCollections = collections.list;
        this.collectionCount = collections.total;
        //取每个分组里第一个视频的封面图作为收藏分组的缩略图
        this.myCollectionGroups.forEach(group => {
          group.thumbnail = require('@/assets/icon/shoucangjia.png');
          const list = this.myCollections.filter(item => item.groupId === group.groupId);
          if(list[0]){
            group.thumbnail = list[0].videoInfo.thumbnail;
          }
        })
      }
    },

  },

  mounted() {
    this.pageListVideos();
    this.pageListCollections();
  }
}
</script>

<template>
  <div class="my-space-home">
    <div class="home-post-header">
      <div class="home-title">
        <div class="home-title-txt">
          我的视频
        </div>
        <div class="home-title-count">
          {{videoCount}}
        </div>
      </div>
      <div class="operation-btn">
        <el-button type="info" plain @click="jumpToPath('/mySpace/post')">
          更多<i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </div>
    </div>
    <div class="home-post-content">
      <div class="home-post-content-item" v-for="(myPostVideo,index) in myPostVideos"
           :key="index">
        <div class="home-post-content-item-thumbnail">
          <img :src="myPostVideo.thumbnail" alt="">
        </div>
        <div class="home-post-content-item-title">
          {{myPostVideo.title}}
        </div>
        <div class="home-post-content-item-infos-count">
          <img :src="require('@/assets/icon/viewCount.png')" alt="">
          <div>
            {{myPostVideo.viewCount==null? 0 : myPostVideo.viewCount}}
          </div>
        </div>
        <div class="home-post-content-item-infos-createTime">
          {{myPostVideo.createTime}}
        </div>

      </div>
    </div>

    <div class="home-collection-header">
      <div class="home-title">
        <div class="home-title-txt">
          我的收藏
        </div>
        <div class="home-title-count">
          {{collectionCount}}
        </div>
      </div>
      <div class="operation-btn">
        <el-button type="info" plain @click="jumpToPath('/mySpace/collection')">
          更多<i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </div>
    </div>
    <div class="home-collection-content">
      <div class="home-collection-content-item"
           v-for="(collectionGroup, index) in myCollectionGroups" :key="index">
        <div class="home-collection-content-item-thumbnail">
          <img :src="collectionGroup.thumbnail" alt="">
          <span>{{collectionGroup.count}}</span>
        </div>
        <div class="home-collection-content-item-title">
          {{collectionGroup.groupName}}
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="less">
.my-space-home{
  margin-top: 40px;
  margin-left: 20%;
  margin-right: 20%;

  .home-post-header{
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
    align-items: center;

    .home-title{
      display: flex;
      align-items: center;
      .home-title-txt{
        margin-right: 10px;
      }
      .home-title-count{
        color: gray;
      }
    }


  }

  .home-post-content{
    display: flex;
    margin-bottom: 40px;
    border-bottom: darkgray solid 1px;

    .home-post-content-item{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 20px;
      margin-bottom: 20px;
      width: 100%;

      .home-post-content-item-thumbnail{
        height:100%;
        width: 100%;
        margin-bottom: 10px;
        img{
          height:100%;
          width: 100%;
          border-radius: 5px;
        }
      }

      .home-post-content-item-title{
        font-size: 16px;
        margin-bottom: 10px;
      }

      .home-post-content-item-infos-count{
        display: flex;
        font-size: 16px;
        color: gray;
        margin-right: 20px;
        img{
          height: 20px;
          width: 20px;
          margin-right: 5px;
        }
      }

      .home-post-content-item-infos-createTime{
        font-size: 16px;
        color: gray;
      }

    }

  }

  .home-collection-header{
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
    align-items: center;

    .home-title{
      display: flex;
      .home-title-txt{
        margin-right: 10px;
      }
      .home-title-count{
        color: gray;
      }
    }


  }

  .home-collection-content{
    display: flex;
    margin-bottom: 40px;
    border-bottom: darkgray solid 1px;
    justify-content: space-evenly;

    .home-collection-content-item{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      max-width: 300px;
      margin-right: 20px;
      margin-bottom: 20px;
      width: 100%;

      .home-collection-content-item-thumbnail{
        margin-bottom: 10px;
        position: relative;
        img{
          height:100%;
          width: 100%;
          border-radius: 5px;
        }
        span{
          position: absolute;
          top: 10px;
          right: 10px;
          min-width: 12px;
          padding: 0 9px;
          text-align: center;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          background: rgba(0,0,0,.5);
          border-radius: 9px;
        }

      }

      .home-collection-content-item-title{
        text-align: center;
        font-size: 18px;
      }

    }

  }

}
</style>