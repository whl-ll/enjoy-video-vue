<script>
import videoApi from "@/api/videoApi";
import routerUtils from "@/utils/routerUtils";

export default {
  name: "SearchVideo",
  mixins:[routerUtils],
  data(){
    return {
      videos:[],
      pageSize:10,
      currentPage:1,
      totalVideoCount:0,
      tabPosition:'综合排序',
      currentTabType:'0',
      tabs:[
        {
          label:'综合排序',
          type:'0'
        },
        {
          label:'最多播放',
          type:'1'
        },
        {
          label:'最近发布',
          type:'2'
        },
        {
          label:'最多弹幕',
          type:'3'
        }
      ]
    }
  },
  methods:{

    async searchVideos(){
      let params = {
        pageSize:this.pageSize,
        pageNo:this.currentPage,
        keyword:this.$route.query.searchTxt,
        searchType:this.currentTabType
      }
      let response = await videoApi.pageListVideosByEs(params);
      if(response.data){
        this.videos = response.data.content;
        this.totalVideoCount = response.data.totalElements;
      }
    },

    async handleTabClick(tabType){
      this.currentTabType = tabType;
      this.tabs.forEach(item => {
        if(item.type === tabType){
          this.tabPosition = item.label;
        }
      });
      await this.searchVideos();
    }

  },
  mounted() {
    this.searchVideos();
  }
}
</script>

<template>
  <div class="search-contents-videos-container">
    <div class="search-contents-videos-tab">
      <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
        <el-radio-button v-for="tab in tabs" :key="tab.type"
                         :label="tab.label">
          <span @click="handleTabClick(tab.type)">
            {{ tab.label }}
          </span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="search-contents-videos">
      <div class="search-contents-videos-item" v-for="video in videos"
           :key="video.id">
        <div class="search-contents-videos-item-detail">
          <div class="search-contents-videos-img" @click="jumpToVideoDetail(video.id)">
            <img :src=video.thumbnail class="image" alt="">
          </div>
          <div class="search-contents-videos-info">
            <div class="search-contents-videos-info-title"
                 @click="jumpToVideoDetail(video.id)">
              <span>{{ video.title }}</span>
            </div>
            <div class="search-contents-videos-info-count">
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
    <div class="page-list-videos">
      <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="searchVideos"
          :total="totalVideoCount">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped lang="less">

.search-contents-videos-container{
  display: flex;
  flex-direction: column;
  align-content: center;
  .search-contents-videos-tab{
    margin-top: 30px;
    ::v-deep .el-radio-button__inner{
      border: none;
    }
  }
  .search-contents-videos{
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(4, 1fr);
    height: 100%;
    .search-contents-videos-item{
      margin-top: 20px;

      .search-contents-videos-item-detail{
        display: flex;
        flex-direction: column;

        .search-contents-videos-img{
          cursor: pointer;
          img{
            max-height: 200px;
            max-width: 300px;
          }

        }
        .search-contents-videos-info{
          margin-top: 10px;
          .search-contents-videos-info-title{
            cursor: pointer;
            font-size: 18px;
            margin-bottom: 5px;
          }
          .search-contents-videos-info-count{
            display: flex;
            align-items: center;
            span{
              display: flex;
              align-items: center;
              margin-right: 20px;
              font-size: 14px;
              img{
                height: 25px;
                width: 25px;
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
  }
}

</style>