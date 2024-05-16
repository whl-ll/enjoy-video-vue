<script>
import userUtils from "@/utils/userUtils";
import userCenterApi from "@/api/userCenterApi";

export default {
  name: "MySpacePost",
  mixins:[userUtils],
  data(){
    return {
      activeIndex:'0',
      areaList:[
        {
          name:'全部',
          area:'',
          count:0,
          index:'0'
        },
        {
          name: '鬼畜',
          area:'0',
          count:0,
          index:'1'
        },
        {
          name: '音乐',
          area:'1',
          count:0,
          index:'2'
        },
        {
          name: '电影',
          area:'2',
          count:0,
          index:'3'
        },
        {
          name: '番剧',
          area:'3',
          count:0,
          index:'4'
        },
        {
          name: '游戏',
          area:'4',
          count:0,
          index:'5'
        }
      ],
      videos:[],
      totalVideoCount:0,
      pageSize:5,
      currentPage:1,
      currentArea:''
    }
  },

  methods:{

    async getUserCenterVideoAreas(){
      const response = await userCenterApi.getUserCenterVideoAreas();
      if(response.data){
        const areasCountMap = response.data;
        this.areaList.forEach(item => item.count = areasCountMap[item.area]);
        const values = Object.values(areasCountMap);
        this.areaList[0].count = values.reduce((x,y)=> x+y);
      }

    },

    async pageListUserVideos(){
      let params = {
        size:this.pageSize,
        no:this.currentPage,
        area:this.currentArea
      };
      let response = await userCenterApi.pageListUserVideos({params});
      if(response.data){
        let videoList = response.data.list;
        videoList.forEach(video => video.visible=true);
        this.videos = videoList;
        this.totalVideoCount = response.data.total;
      }
    },

    async handleSelect(currentIndex){
      const value = this.areaList[currentIndex];
      this.currentArea = value.area;
      this.currentPage=1;
      await this.pageListUserVideos();
    }
  },

  async mounted(){
    if(this.isUserLoggedIn){
      await this.getUserCenterVideoAreas();
      await this.pageListUserVideos();
    }
  }
}
</script>

<template>
  <div class="my-space-post">
    <div class="my-space-post-container">
      <div class="my-space-post-header">
        <div class="my-space-post-title">
          我的视频
        </div>
      </div>
      <!--      视频分类-->
      <div class="my-space-post-classification">
        <el-menu :default-active.sync="activeIndex"
                 class="filter-menu" mode="horizontal" @select="handleSelect">
          <el-menu-item class="filter-menu-item"
                        v-for="area in areaList"
                        :key="area.index"
                        :index="area.index">
            {{area.name}} {{area.count}}
          </el-menu-item>
        </el-menu>
      </div>
      <!--      视频列表-->
      <div class="my-space-post-videos">
        <div class="videos-item" v-for="(video,index) in videos"
             :key="index">
          <div class="videos-item-detail" v-if="video.visible">
            <div class="video-img">
              <img :src=video.thumbnail class="image" alt="">
            </div>
            <div class="video-info">
              <div class="video-info-title">
                <span>{{ video.title }}</span>
              </div>
              <div class="video-info-description">
                <span>{{ video.description}}</span>
              </div>
              <div class="video-info-count">
              <span>
                <img :src="require('@/assets/icon/viewCount.png')"
                     alt="">
                {{video.viewCount ? video.viewCount : '-'}}
              </span>
                <span>
                <img :src="require('@/assets/icon/danmuCount.png')" alt="">
                {{video.danmuCount ? video.danmuCount : '-'}}
              </span>
                <span>
                {{video.createTime}}
              </span>
              </div>

            </div>
          </div>
        </div>
      </div>
      <!--      分页展示视频-->
      <el-pagination class="page-list-videos"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :current-page.sync="currentPage"
                     @current-change="pageListUserVideos"
                     :total="totalVideoCount">
      </el-pagination>

    </div>
  </div>
</template>

<style scoped lang="less">

.my-space-post{
  margin-left: 20%;
  margin-right: 20%;
  padding: 40px;

  .my-space-post-container{

    .my-space-post-header{

      .my-space-post-title{
        font-size: 24px;
      }

    }

    .my-space-post-classification{
      .filter-menu{
        margin-top: 10px;
        background-color: #edf2f9;
        border-radius: 5px;
        .filter-menu-item{

          background-color: #edf2f9;
          color: black;
          border-radius: 5px;
        }
      }

    }

    .my-space-post-videos{

      .videos-item{

        .videos-item-detail{
          margin-top: 20px;
          display: flex;
          align-items: center;
          .video-img{
            margin-right: 40px;
            img{
              width: 240px;
              height: 135px;
              border-radius: 5px;
            }
          }
          .video-info{
            height: 135px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .video-info-title{
              display: flex;
              font-size: 22px;
            }

            .video-info-description{
              display: flex;
              font-size: 16px;
            }

            .video-info-count{
              font-size: 16px;
              display: flex;

              span{
                display: flex;
                align-items: center;
                margin-right: 20px;
                img{
                  height: 24px;
                  width: 24px;
                  border-radius: 2px;
                  margin-right: 5px;
                }
              }
            }
          }
        }



      }

    }

    .page-list-videos{
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

}

</style>