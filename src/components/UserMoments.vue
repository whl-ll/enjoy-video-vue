<script>
import CommonHeader from "@/components/CommonHeader.vue";
import userMomentApi from "@/api/userMomentApi";
import fileUtils from "@/utils/fileUtils";
import userUtils from "@/utils/userUtils";
import routerUtils from "@/utils/routerUtils";

export default {
  name: "UserMoments",
  components: {CommonHeader},
  mixins:[fileUtils, userUtils, routerUtils],
  data(){
    return {
      postTxt:'',
      imagePreview:null,
      selectedFile:null,
      activeIndex:'0',
      menus:[
        {
          index:'0',
          name:'全部',
          type:''
        },
        {
          index:'1',
          name:'视频投稿',
          type:'0'
        },
        {
          index:'2',
          name:'图文',
          type:'1'
        },
      ],
      moments:[],
      infiniteId:+new Date(),
      currentPage:1,
      size:3,
    }
  },
  methods:{

    handleImageUpload(event) {
      const fileInput = event.target;
      const file = fileInput.files[0];
      if (file) {
        // 使用FileReader来读取文件并生成预览
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
          console.log(this.imagePreview);
        };
        reader.readAsDataURL(file);
      }
      // 处理文件上传逻辑，例如显示预览图等
    },

    async addUserMoments(){
      if(this.postTxt === '' ){
        window.alert('发布内容为空');
      }else{
        //上传图片
        let imgUrl = '';
        if(this.selectedFile){
          const fileMd5 = await this.calculateVideoMD5(this.selectedFile);
          console.log(fileMd5);
          const response = await this.uploadFileBySlices(this.selectedFile);
          if(response){
            const {data:data} = response;
            imgUrl = data;
          }
        }
        let content = {
          txt:this.postTxt,
          img:imgUrl
        }
        let params1 = {
          contentDetail:content
        }
        let response = await userMomentApi.addUserMomentContents(params1);
        if(response.data){
          let params2 = {
            contentId:response.data,
            type:'1'
          }
          await userMomentApi.addUserMoments(params2);
          // location.reload();
        }
      }
    },

    async handleSelect(key, type) {
      this.infiniteId += 1;
      this.currentType = type;
      this.currentPage = 1;
      let params = {
        size:this.size,
        no:this.currentPage,
        type:type
      };
      let response = await userMomentApi.pageListMoments(params);
      if(response.data){
        const {list:moments} = response.data;
        this.moments = moments;
        this.currentPage++; // 递增当前页码
      }
    },

    pageListMoments($state){
      let params = {
        size:this.size,
        no:this.currentPage,
        type:this.currentType
      };
      userMomentApi.pageListMoments(params).then(response =>{
        if(response.data){
          const {list:moments} = response.data;
          if(moments.length === 0){
            // 已加载所有数据，不再触发加载
            $state.complete();
            return;
          }
          this.moments = this.moments.concat(moments);
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
      window.alert('请先登录')
      this.jumpToPath('/')
    }
  }
}
</script>

<template>
  <div class="user-moments">
    <CommonHeader/>

    <div class="user-moments-container">
      <!--      发布动态-->
      <div class="user-moments-post">
        <input placeholder="有什么想和大家分享的？"
               class="user-moments-post-input" v-model="postTxt">
        <div class="user-moments-post-img">
          <img :src="imagePreview" alt=""
               v-show="imagePreview" class="uploaded-img">
        </div>
        <div class="user-moments-post-tools">
          <div class="user-moments-post-tools-img">
            <label for="file-input">
              <img :src="require('@/assets/icon/uploadImg.png')"
                   alt="" class="icon">
            </label>
            <input type="file" id="file-input"
                   style="display: none;" accept="image/*"
                   @change="handleImageUpload">
          </div>
          <el-button type="primary" @click="addUserMoments">发布</el-button>
        </div>
      </div>
      <!--      导航栏-->
      <div class="user-moments-nav">
        <el-menu :default-active.sync="activeIndex"
                 class="user-moments-nav-menu" mode="horizontal">
          <el-menu-item v-for="menu in menus"
                        :key="menu.index" :index="menu.index"
                        class="user-moments-nav-menu-item"
                        @click="handleSelect(menu.index, menu.type)">
            {{menu.name}}
          </el-menu-item>
        </el-menu>
      </div>
      <!--      动态列表-->
      <div class="user-moments-list">
        <div class="user-moments-list-item" v-for="(moment, index) in moments"
             :key="index">
          <div class="user-moments-list-item-userInfo">
            <img :src="moment.userInfo.avatar" alt="">
            <div class="user-moments-list-item-userInfo-detail">
              <div style="color: #f69; font-weight: bold; margin-bottom: 10px">
                {{moment.userInfo.nick}}
              </div>
              <div style="color: darkgray; ">
                发布于：{{moment.createTime}}
              </div>
            </div>
          </div>
          <div class="user-moments-list-item-moment">
            <div class="user-moments-list-item-moment-txt">
              {{moment.content.contentDetail.txt}}
            </div>
            <div class="user-moments-list-item-moment-img" v-if="moment.type==='1' ">
              <img :src="moment.content.contentDetail.img" alt="">
            </div>
            <div class="user-moments-list-item-moment-video" v-if="moment.type==='0' ">
              <img :src="moment.content.contentDetail.thumbnail" alt="">
              <div class="user-moments-list-item-moment-video-detail">
                <div class="user-moments-list-item-moment-video-detail-title"
                     @click="jumpToVideoDetail(moment.content.contentDetail.id)"
                     style="cursor: pointer">
                  {{moment.content.contentDetail.title}}
                </div>
                <div class="user-moments-list-item-moment-video-detail-description">
                  {{moment.content.contentDetail.description}}
                </div>
                <div class="user-moments-list-item-moment-video-detail-count">
                  <div class="user-moments-list-item-moment-video-detail-viewCount">
                    <img :src="require('@/assets/icon/viewCount.png')"
                         alt="">
                    {{moment.content.contentDetail.viewCount
                      ? moment.content.contentDetail.viewCount : 0}}
                  </div>
                  <div class="user-moments-list-item-moment-video-detail-danmuCount">
                    <img :src="require('@/assets/icon/danmuCount.png')" alt="">
                    {{moment.content.contentDetail.danmuCount
                      ? moment.content.contentDetail.danmuCount : 0}}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <infinite-loading :identifier="infiniteId"
                          @infinite="pageListMoments">
        </infinite-loading>
      </div>
    </div>
  </div>

</template>

<style scoped lang="less">

.user-moments-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #4e4e7a;

  .user-moments-post{
    width: 50%;
    margin-top: 10px;
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    margin-bottom: 10px;

    .user-moments-post-input{
      min-height:40px;
      width: 100%;
      outline: none;
      border: none;
      font-size: 16px;
    }

    .user-moments-post-img{
      .uploaded-img{
        height: 180px;
        width: 320px;
      }
    }

    .user-moments-post-tools{
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-content: center;

      .user-moments-post-tools-img{
        display: flex;
        align-items: center;

        .icon{
          cursor: pointer;
          height: 20px;
          width: 20px;
        }
      }

    }
  }

  .user-moments-nav{
    width: 50%;
    background-color: white;
    border-radius: 5px;


    .user-moments-nav-menu{
      padding: 10px;
      border-radius: 5px;
      margin-top: 10px;
      margin-bottom: 10px;

      el-menu-item{
        font-size: 18px;
      }
    }
  }

  .user-moments-list{
    width: 50%;
    margin-top: 10px;

    .user-moments-list-item{
      background-color: white;
      padding: 20px;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      border-radius: 5px;

      .user-moments-list-item-userInfo{
        display: flex;
        align-items: center;
        img{
          max-height: 60px;
          max-width: 60px;
          border-radius: 5px;
        }
        .user-moments-list-item-userInfo-detail{
          margin-left: 20px;
        }
      }
      .user-moments-list-item-moment{
        display: flex;
        flex-direction: column;
        padding: 40px;

        .user-moments-list-item-moment-txt{
          font-size: 18px;
          margin-bottom: 10px;

        }

        .user-moments-list-item-moment-img{
          img{
            max-height: 180px;
            max-width: 320px;
            border-radius: 5px;
          }
        }
        .user-moments-list-item-moment-video{
          background-color: #f5f5f5;
          border-radius: 5px;
          display: flex;
          padding: 10px;

          img{
            max-height: 180px;
            max-width: 320px;
            border-radius: 5px;
          }
          .user-moments-list-item-moment-video-detail{
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .user-moments-list-item-moment-video-detail-title{
              font-size: 20px;
            }

            .user-moments-list-item-moment-video-detail-description{
              color: gray;
            }

            .user-moments-list-item-moment-video-detail-count{
              display: flex;
              margin-top:20px;

              .user-moments-list-item-moment-video-detail-viewCount{
                display: flex;
                align-items: center;
                margin-right: 20px;
                img{
                  max-height: 20px;
                  max-width: 20px;
                  margin-right: 5px;
                }
              }
              .user-moments-list-item-moment-video-detail-danmuCount{
                display: flex;
                align-items: center;
                margin-right: 20px;
                img{
                  max-height: 20px;
                  max-width: 20px;
                  margin-right: 5px;
                }
              }
            }

          }


        }
      }

    }
  }

}

</style>