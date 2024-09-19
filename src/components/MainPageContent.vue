<script>
import videoApi from "@/api/videoApi";
import userUtils from "@/utils/userUtils";

export default {
  name: "MainPageContent",
  mixins:[userUtils],
  data(){
    return{
      year: new Date().getFullYear(),
      author: '于建伟',
      record: '皖ICP备2024049525号',
      items:[
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:1,
        },
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:2,
        },
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:3,
        },
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:4,
        },
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:5,
        },
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:6,
        },
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:7,
        },
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:8,
        },
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:9,
        },
        {
          imgUrl:require('@/assets/header/header-banner.png'),
          id:10,
        }
      ],
      menus:[
        {
          name:'主页',
          path:'home',
          index:'1'
        },
        {
          name:'投稿',
          path:'post',
          index:'2'
        }
      ],
      recommendedVideos:[],
      videos:[],
      infiniteId:1,
      currentPage:1
    }
  },
  methods:{
    jumpToVideoDetail(video){
      if(video){
        this.$router.push({
          path:'videoDetail',
          query:{
            videoId:video.id
          }
        });
      }else{
        this.$router.push('/videoDetail');
      }
    },

    pageListVideos($state){
      let params = {
        size:10,
        no:this.currentPage
      }
      videoApi.pageListVideos({params}).then(response => {
        const {list:videos, total:total} = response.data;
        if(videos.length === 0){
          // 已加载所有数据，不再触发加载
          $state.complete();
          return;
        }
        this.videos = this.videos.concat(videos);
        this.total = total;
        // 递增当前页码
        this.currentPage++;
        // 标记加载完成
        $state.loaded();
      }).catch(error => {
        // 捕获异常
        console.error('请求出错:', error);
        $state.complete();
      });
    },

    async getVideoRecommendations(){
      if(this.isUserLoggedIn){
        let params = {
          // 1、基于用户的协同推荐 2、基于内容的协同推荐
          recommendType:'2'
        }
        let response = await videoApi.getVideoRecommendations(params);
        if(response.data){
          this.recommendedVideos = response.data;
        }
      }else{
        let response = await videoApi.getVideoRecommendationsForVisitor();
        if(response.data){
          this.recommendedVideos = response.data;
        }
      }
    }
  },

  mounted(){
    this.getVideoRecommendations();
  }
}
</script>

<template>
  <div class="main-page">

    <div class="main-page-video-container">

      <div class="carousel-container">
        <el-carousel :interval="4000" type="card" height="200px" class="carousel">
          <el-carousel-item v-for="(video, index) in recommendedVideos" :key="index">
            <img :src="video.thumbnail"
                 :alt="video.id" style="width: 100%; height: 100%; border-radius: 5px"
                  @click="jumpToVideoDetail(video)">
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="video-container" v-for="video in videos" :key="video.id"
          @click="jumpToVideoDetail(video)">
        <img :src="video.thumbnail" class="thumbnail" alt="">
        <span>{{video.title}}</span>
        <div class="videos-details">
          <div class="video-count-item">
            <img :src="require('@/assets/icon/viewCount.png')" alt="">
            {{video.viewCount ? video.viewCount : '-'}}
          </div>
          <div class="danmu-count-item">
            <img :src="require('@/assets/icon/danmuCount.png')" alt="">
            {{video.danmuCount ? video.danmuCount : '-'}}
          </div>
          <div class="videos-time">
            {{video.createTime}}
          </div>
        </div>

      </div>
      <infinite-loading :infinite-id="infiniteId"
                        @infinite="pageListVideos">
        <div slot="no-more"></div>
      </infinite-loading>
    </div>

<!--<a href="https://beian.miit.gov.cn/" target="_blank">皖ICP备2024049525号</a>
    <a href="https://beian.miit.gov.cn/" target="_blank">皖ICP备2024049525号-1</a>-->
    <div class="icp">
      {{`© ${year} ${author} ` }}
      <a href="https://beian.miit.gov.cn/" target="_blank">
        {{ record }}
      </a>
    </div>
  </div>
</template>

<style scoped lang="less">
.main-page{

  .main-page-video-container{
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(5, 1fr);
    height: 100%;
    flex-shrink: 0;
    margin-right: 5%;
    margin-left: 5%;
    margin-top: 30px;

    .carousel-container{
      grid-column: 1/4;
      grid-row: 1/3;
      cursor: pointer;
      .carousel{
        height: 100%;
        max-height: 480px;
        ::v-deep .el-carousel__container{
          height: 100%;
          min-height: 450px;
        }
      }
      .carousel img {
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        padding: 10px;
        box-sizing: border-box;
        object-fit: cover;
        border-radius: 5px;
      }
    }

    .video-container{
      display: flex;
      flex-direction: column;
      font-size: 16px;
      height: 100%;
      cursor: pointer;
      justify-content: space-between;
      .thumbnail{
        width: 100%;
        max-width: 320px;
        height: 180px;
        border-radius: 5px;
        padding: 10px;
        box-sizing: border-box;
        object-fit: cover;
      }
      .videos-details{
        display: flex;
        align-items: center;
        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
        .video-count-item{
          display: flex;
          align-items: center;
          margin-right: 10px;
          img{
            max-height: 26px;
            max-width: 26px;
            margin-right: 5px;
          }
        }
        .danmu-count-item{
          display: flex;
          align-items: center;
          margin-right: 10px;
          img{
            max-height: 26px;
            max-width: 26px;
            margin-right: 5px;
          }
        }
        .videos-time{
          color: gray;
          font-size: 16px;
        }
      }
    }

    @media (max-width: 1680px){
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1080px){
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.icp {
  bottom: 0;
  right: 0;
  margin: 10px 0;
  width: 100%;
  height: 36px;
  white-space: pre;
  text-align: center;
  color: gray;
  z-index: 9999;
}
.icp > a {
  color: gray;
  text-decoration: none;
}
.icp > a:hover {
  color: aqua;
  text-decoration: none;
}

// 手机端样式，适用于宽度小于或等于1080px的屏幕
@media (max-width: 1080px) {
  .main-page{

    .main-page-video-container{
      display: grid;
      grid-gap: 20px;
      grid-template-columns: repeat(5, 1fr);
      height: 100%;
      flex-shrink: 0;
      margin-right: 5%;
      margin-left: 5%;
      margin-top: 30px;

      .carousel-container{
        grid-column: 1/3;
        grid-row: 1/3;
        cursor: pointer;
        .carousel{
          height: 100%;
          max-height: 480px;
          ::v-deep .el-carousel__container{
            height: 100%;
            min-height: 200px;
          }
        }
        .carousel img {
          width: calc(100% - 20px);
          height: calc(100% - 20px);
          padding: 10px;
          box-sizing: border-box;
          object-fit: cover;
          border-radius: 5px;
        }
      }

      .video-container{
        display: flex;
        flex-direction: column;
        font-size: 16px;
        height: 100%;
        cursor: pointer;
        justify-content: space-between;
        .thumbnail{
          width: 100%;
          max-width: 320px;
          height: 180px;
          border-radius: 5px;
          padding: 10px;
          box-sizing: border-box;
          object-fit: cover;
        }
        .videos-details{
          display: flex;
          align-items: center;
          width: 100%;
          margin-top: 10px;
          margin-bottom: 10px;
          .video-count-item{
            display: flex;
            align-items: center;
            margin-right: 10px;
            img{
              max-height: 26px;
              max-width: 26px;
              margin-right: 5px;
            }
          }
          .danmu-count-item{
            display: flex;
            align-items: center;
            margin-right: 10px;
            img{
              max-height: 26px;
              max-width: 26px;
              margin-right: 5px;
            }
          }
          .videos-time{
            color: gray;
            font-size: 16px;
          }
        }
      }

      @media (max-width: 1680px){
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 1080px){
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  .icp {
    bottom: 0;
    right: 0;
    margin: 10px 0;
    width: 100%;
    height: 36px;
    white-space: pre;
    text-align: center;
    color: gray;
    z-index: 9999;
  }
  .icp > a {
    color: gray;
    text-decoration: none;
  }
  .icp > a:hover {
    color: aqua;
    text-decoration: none;
  }
}
</style>