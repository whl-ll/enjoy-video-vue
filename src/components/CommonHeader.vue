<script>
import userUtils from "@/utils/userUtils";
import LoginDialog from "@/components/LoginDialog.vue";
import userMomentApi from "@/api/userMomentApi";
import userHistoryApi from "@/api/userHistoryApi";

export default {
  name: "CommonHeader",
  components: {LoginDialog},
  data(){
    return {
      dialogVisible:false,
      entries:[
        {
         id:1,
         name:'首页',
         path:'/'
        },
        {
          id:2,
          name:'音乐',
          path:'/MusicPlayer'
        },
        {
          id:3,
          name:'谢网',
          href: 'http://124.220.10.190:8083/web/'
        },
        {
          id:4,
          name:'登录',
          path:'/UserLogin'
        }
      ],
      searchTxt:'',
      moments:[],
      histories:[]
    }
  },
  mixins:[userUtils],
  methods:{
    jumpWithLoginUser(path){
      //先判断用户是否登录，如果没有登录，弹出用户登录对话框
      if(!this.isUserLoggedIn){
        this.dialogVisible = true;
      }else{
        //打开一个新的页面地址
        //如果当前页面的路径等于我们要跳转的路径，则只需要刷新页面
        if(this.$route.path !== path){
          this.$router.push(path);
        }else{
          location.reload();
        }
      }
    },

    jumpToPath(path){
      if(this.$route.path !== path){
        this.$router.push(path);
      }else{
        location.reload();
      }
    },

    searchContents(){
      if(this.searchTxt === ''){
        window.alert('请输入搜索内容');
        return;
      }
      //判断是否重复跳转
      if(decodeURIComponent(this.$route.fullPath)
          === '/searchContents?searchTxt='+this.searchTxt){
        location.reload();
        return;
      }
      this.$router.push({
        path:'/searchContents',
        query:{
          searchTxt:this.searchTxt
        }
      })
    }
  },

  async mounted() {
    if(this.isUserLoggedIn){
      this.$store.state.userInfo = await this.getUserBasicInfo();

      let params = {
        size:5,
        no:1
      }
      //查询动态
      let response = await userMomentApi.pageListMoments(params);
      if(response.data){
        this.moments = response.data.list;
      }
      //查询历史
      let response1 = await userHistoryApi.pagListUserVideoHistory(params);
      if(response1.data){
        this.histories = response1.data.list;
      }
    }
  },

  computed:{

    avatar(){
      const userInfo = this.$store.state.userInfo;
      if(userInfo && userInfo.avatar && userInfo.avatar !== '' ){
        return userInfo.avatar;
      }else{
        return require('@/assets/ev.png');
      }
    }
  },
}
</script>

<template>

  <div class="ev-header">

    <div class="header-nav-container">

<!--  <div class="left-entry">
        <div v-for="entry in entries" :key="entry.id">
          <span @click="jumpToPath(entry.path)">{{entry.name}}</span>
        </div>
      </div>-->

      <div class="left-entry">
        <div v-for="entry in entries" :key="entry.id">
          <!-- 如果有 href 属性，则使用 <a> 标签 -->
          <a v-if="entry.href" :href="entry.href" target="_blank" class="entry-link">{{ entry.name }}</a>
          <!-- 如果有 path 属性，则使用点击事件进行内部跳转 -->
          <span v-else @click="jumpToPath(entry.path)">{{ entry.name }}</span>
        </div>
      </div>

      <div class="center-search-bar">
        <form class="nav-search-form">
          <div class="nav-search-content">
            <input class="nav-search-input"
                    type="text" autocomplete="off"
                    maxlength="100" placeholder="请输入视频内容"
                    v-model="searchTxt">
          </div>
          <div class="nav-search-btn">
            <el-button icon="el-icon-search"
                       circle size="mini" @click="searchContents"></el-button>
          </div>
        </form>
      </div>

      <div class="right-entry">

        <div v-if="isUserLoggedIn" class="user-center">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img style="height: 50px; width: 50px; border-radius: 50%; object-fit: contain;"
                   :src="avatar" alt="">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" style="color: black"
                           @click="jumpToPath('/mySpace')">
                  个人中心
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item style="color: black">
                <el-button type="text" style="color: black"
                           @click="logout">
                  退出登录
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else class="user-center">
          <el-button
              class="login-button"
              type="text"
              style="font-family: 'Hiragino Sans GB', sans-serif;"
              @click="dialogVisible = true">
            登录
          </el-button>
          <div class="transparent-dialog">
            <el-dialog
                title=""
                :visible.sync="dialogVisible"
                width="650px"
                height="500px"
                :style="{ borderRadius: '10px' }"
                :show-close="true"
                :center="true"
                show-header="false">
              <LoginDialog/>
            </el-dialog>
          </div>
        </div>
<!--动态-->
        <div class="right-entry-moments">
          <el-popover
              placement="top-start"
              width="300"
              trigger="hover">
            <div v-if="isUserLoggedIn">
              <div class="moment-list">
                <div class="moment-list-item" v-for="moment in moments" :key="moment.id"
                     style="background-color: #f1f1f1; margin-bottom: 10px; border-radius: 5px; padding: 5px">
                  <div class="moment-list-item-txt">
                    {{moment.content.contentDetail.txt}}
                  </div>
                  <div class="moment-list-item-img" v-if="moment.type==='1' " >
                    <img :src="moment.content.contentDetail.img" alt=""
                         style="height: 60px; width: 100px; border-radius: 5px; margin-right: 5px; object-fit: contain;">
                  </div>
                  <div class="moment-list-item-video" v-if="moment.type==='0' " style="display: flex">
                    <img :src="moment.content.contentDetail.thumbnail" alt=""
                         style="height: 60px; width: 100px; border-radius: 5px; margin-right: 5px; object-fit: contain;">
                    <div class="moment-list-item-video-detail" style="display: flex; flex-direction: column; justify-content: space-between">
                      <div class="moment-list-item-video-detail-title">
                        {{moment.content.contentDetail.title}}
                      </div>
                      <div class="moment-list-item-video-detail-description">
                        {{moment.content.contentDetail.description}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <el-button type="info" style="width: 100%" v-if="isUserLoggedIn"
                         @click="jumpToPath('/userMoments')">
                查看更多
              </el-button>
            </div>

            <div v-else>
              <div style="text-align: center; font-size: 16px; padding: 10px">
                登录即可查看动态
              </div>
              <el-button type="info" style="width: 100%" @click="dialogVisible=true">
                立即登录
              </el-button>
            </div>

            <el-button slot="reference"
                       icon="el-icon-picture-outline-round"
                       class="el-btn-moments"
                       style="background-color: #FFC0CB"
                       type=""
                       circle>
            </el-button>
          </el-popover>
          <span style="color: white; margin-top: 5px">动态</span>
        </div>
<!--历史-->
        <div class="right-entry-content">
          <el-popover
              placement="top-start"
              width="300"
              trigger="hover">
            <div class="history-list">
              <div class="history-list-item" v-for="(history,index) in histories"
                   :key="index"
                   style="background-color: #f1f1f1; margin-bottom: 10px; border-radius: 5px; padding: 5px">
                <div class="history-list-item-video" style="display: flex">
                  <img :src="history.thumbnail" alt=""
                       style="height: 60px; width: 100px; border-radius: 5px; margin-right: 5px; object-fit: contain;">
                  <div class="history-list-item-video-detail"
                       style="display: flex; flex-direction: column; justify-content: space-between">
                    <div class="history-list-item-video-detail-title">
                      {{history.title}}
                    </div>
                    <div class="history-list-item-video-detail-description">
                      {{history.description}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-button type="info" style="width: 100%" v-if="isUserLoggedIn"
                       @click="jumpToPath('/userHistory')">
              查看更多
            </el-button>
            <div v-else>
              <div style="text-align: center; font-size: 16px; padding: 10px">
                登录即可查看历史
              </div>
              <el-button type="info" style="width: 100%" @click="dialogVisible=true">
                立即登录
              </el-button>
            </div>
            <el-button class="right-entry-button"
                       style="background-color: #FFC0CB"
                       type=""
                       slot="reference"
                       icon="el-icon-video-play"
                       @click="jumpWithLoginUser('/userHistory')"
                       circle>
            </el-button>
          </el-popover>
          <span style="color: white; margin-top: 5px">历史</span>
        </div>
        <div class="right-entry-content">
          <el-button style="background-color: #FFC0CB"
                     type=""
                     icon="el-icon-upload2"
                     circle
                     @click="jumpWithLoginUser('postContent')"></el-button>
          <span style="color: white; margin-top: 5px">发布</span>
        </div>
      </div>
    </div>

    <div class="header-banner-container">
      <img class="banner"
          :src="require('@/assets/header/header-banner.png')" alt="">
    </div>
  </div>

</template>

<style scoped lang="less">

.ev-header{

  .header-nav-container{

    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left-entry{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-left: 30px;
      min-width: 100px;
      max-width: 208px;
      span{
        margin-right: 20px;
        color: white;
        font-weight: bolder;
        cursor: pointer;
      }
      .entry-link {
        margin-right: 20px;
        color: white;
        font-weight: bolder;
        cursor: pointer;
        text-decoration: none;
      }
    }

    .center-search-bar{
      flex: 1 auto;
      min-width: 10px;
      max-width: 400px;
      .nav-search-form{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 4px 0 4px;
        height: 40px;
        background-color: white;
        border-radius: 8px;
        opacity: 0.8;
        .nav-search-content{
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 36px;
          border: 2px solid transparent;
          border-radius: 6px;
          .nav-search-input{
            width: 100%;
            font-size: 14px;
            padding-right: 8px;
            background-color: transparent;
            border: none;
            box-shadow: none;
            outline: none;
          }
        }

        .nav-search-btn{
          margin: 0;
          padding: 0;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      }
    }

    .right-entry{
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      padding: 10px;
      min-width: 100px;
      max-width: 258px;

      .user-center{
        margin-right: 30px;
        .login-button{
          color: #000000;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-weight: bold;
          background-color: #FFC0CB;
          font-family: "Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        }
        .transparent-dialog {
          background-color: transparent!important;
          .el-dialog__header{
            background-color: transparent!important;
          }
        }
      }
      .right-entry-moments{
        margin: 0 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .right-entry-content{
        margin: 0 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }

  .header-banner-container{
    .banner{
      width: 100%;
    }
  }
}

//手机端样式，适用于宽度小于或等于1080px的屏幕
@media (max-width: 1080px) {
  .ev-header{

    .header-nav-container{

      position: absolute;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left-entry{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-left: 0;
        min-width: 30px;
        max-width: 80px;
        span{
          margin-right: 0;
          color: white;
          font-weight: bolder;
          cursor: pointer;
        }
        .entry-link {
          margin-right: 0;
          color: white;
          font-weight: bolder;
          cursor: pointer;
          text-decoration: none;
        }
      }

      .center-search-bar{
        flex: 1;
        margin-left: -65px;
        min-width: 20px;
        max-width: 100px;
        .nav-search-form{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px 0 4px;
          height: 38px;
          background-color: white;
          border-radius: 8px;
          opacity: 0.8;
          .nav-search-content{
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 36px;
            border: 2px solid transparent;
            border-radius: 6px;
            .nav-search-input{
              width: 100%;
              font-size: 8px;
              padding-right: 5px;
              background-color: transparent;
              border: none;
              box-shadow: none;
              outline: none;
            }
          }

          .nav-search-btn{
            margin: 0;
            padding: 0;
            width: 30px;
            height: 30px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          }
        }
      }

      .right-entry{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 0;
        min-width: 50px;
        max-width: 100px;


        .user-center{
          margin-right: 0;
          .login-button{
            color: #000000;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            font-weight: bold;
            background-color: #FFC0CB;
            font-family: "Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
          }
          .transparent-dialog {
            background-color: transparent!important;
            .el-dialog__header{
              background-color: transparent!important;
            }
          }
        }
        .right-entry-moments{
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .right-entry-content{
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    }

    .header-banner-container{
      .banner{
        width: 100%;
      }
    }
  }
}
</style>