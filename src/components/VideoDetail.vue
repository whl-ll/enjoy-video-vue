<script>
import CommonHeader from "@/components/CommonHeader.vue";
import videoApi from "@/api/videoApi";
import Player, {Danmu} from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import 'xgplayer/es/plugins/danmu/index.css'
import {Events} from "xgplayer";
import VideoComment from "@/components/VideoComment.vue";
import userUtils from "@/utils/userUtils";
import userApi from "@/api/userApi";
import LoginDialog from "@/components/LoginDialog.vue";
import danmuApi from "@/api/danmuApi";

export default {
  name: "VideoDetail",
  mixins:[userUtils],
  components: {LoginDialog, VideoComment, CommonHeader},
  data(){
    return {
      videoDetail:{
        title:'title',
        createTime:''
      },
      viewCount:'',
      danmuCount:0,
      videoUpInfo:{},
      player:null,
      onWatching:0,
      danmuText:'',
      liked:false,
      likeCount:0,
      hasCoin:false,
      coinCount:0,
      collected:false,
      collectCount:0,
      followed:false,
      showLoginDialog:false,
      defaultDanmuConfig:{
        duration: 5000, //弹幕持续显示时间，单位是毫秒（最低为5000毫秒）
        style:{
          color:'#ffffff',
          padding:'5px 11px'
        }
      },
      ws:null,
      activeNames:['1'],
      tableData:[],
      danmus:[]
    }
  },

  methods:{

    async getDanmus(){
      const videoId = this.$route.query.videoId;
      const response = await danmuApi.getDanmus(videoId, null, null);
      const {data:danmuList} = response;
      this.danmuCount = danmuList.length===0?0:danmuList.length;
      danmuList.forEach(danmu => {
        let data = {
          danmuTime:'',
          txt:'',
          createTime:''
        };
        data.createTime = danmu.createTime;
        const {content:content} = danmu;
        data.txt = JSON.parse(content).txt;
        data.danmuTime = this.millisecondsToMinutesAndSeconds(danmu.danmuTime);
        this.tableData.push(data);
      });
      return danmuList;
    },

    async getVideoDetail(){
      const videoId = this.$route.query.videoId;
      if(videoId){
        const response = await videoApi.getVideoDetail(videoId);
        this.videoDetail = response.data.video;
        this.videoUpInfo = response.data.userInfo;
        await this.initPlayer();
        //获取视频的点赞数量
        await this.getVideoLikes();
        //获取视频的投币数量
        await this.getVideoCoins();
        //获取视频的收藏数量
        await this.getVideoCollections();
        //获取视频的播放量
        await this.getVideoViewCounts();
      }
      if(this.isUserLoggedIn){
        await this.getUserFollowings();
      }
    },

    async initPlayer(){
      const videoUrl = 'http://49.235.134.39:15005/video-slices?url=' + this.videoDetail.url;
      const danmuList = await this.getDanmus();
      if(danmuList && danmuList.length > 0){
        danmuList.forEach(item =>{
          const content = JSON.parse(item.content);
          content.id = item.id;
          this.danmus.push(content);
        });
      }
      this.player = new Player({
        id:'ev-player',
        url:videoUrl,
        width:'800px',
        height:'450px',
        plugins:[Danmu],
        danmu:{
          comments:this.danmus
        },
      });
      this.player.danmu.setFontSize('20', '24');
      this.player.on(Events.ENDED, async () => {
        let params = {
          videoId:this.$route.query.videoId
        }
        await videoApi.addVideoViews(params);
        this.viewCount++;
      })
    },

    sendDanmu(){
      if(!this.isUserLoggedIn){
        this.showLoginDialog = true;
        return;
      }
      if(this.danmuText){
        const danmuText = this.danmuText;
        const danmuTime = Math.floor(this.player.currentTime * 1000);
        let danmuMessage = {
          start:danmuTime,
          txt:danmuText,
          duration:this.defaultDanmuConfig.duration,
          style:this.defaultDanmuConfig.style,
        }
        //发送弹幕到后端进行保存
        let params = {};
        params.content = danmuMessage;
        params.videoId = this.$route.query.videoId;
        params.danmuTime = danmuTime;
        this.ws.send(JSON.stringify(params));
        //在前端播放器发送弹幕
        this.danmuText = '';
        danmuMessage.id = 1;
        this.player.danmu.sendComment(danmuMessage);
      }
    },

    initWebsocket(){
      const url = 'ws://49.235.134.39:15005/imserver/' + localStorage.getItem('token');
      console.log(url);
      this.ws = new WebSocket(url);
      this.ws.onmessage = (event) =>{
        const msgObj = JSON.parse(event.data);
        console.log('接收到后端的消息：', msgObj);
        // 如果消息类型是弹幕，则调用播放器发送弹幕
        if(msgObj.txt){
          console.log('接收到弹幕：',msgObj);
          this.player.danmu.sendComment(msgObj);
        }
        //在线人数通知消息处理
        if(msgObj.onlineCount){
          this.onWatching = msgObj.onlineCount;
        }
      };
    },

    async addOrDeleteVideoLike(){
      if(this.liked){
        await videoApi.deleteVideoLike(this.$route.query.videoId);
        this.likeCount--;
      }else{
        await videoApi.addVideoLike(this.$route.query.videoId);
        this.likeCount++;
      }
      this.liked = !this.liked;
    },

    async addVideoCoins(){
      let params = {
        videoId:this.$route.query.videoId,
        amount:1
      }
      await videoApi.addVideoCoins(params);
      this.coinCount++;
      this.hasCoin = true;
    },

    async addOrDeleteVideoCollection(){
      if(this.collected){
        await videoApi.deleteVideoCollection(this.$route.query.videoId);
        this.collectCount--;
      }else{
        let params = {
          videoId:this.$route.query.videoId,
          // groupId是系统预设的某一个收藏分组的id，这个id可以固定，也可以通过后端接口获取
          groupId:16
        };
        await videoApi.addVideoCollection(params);
        this.collectCount++;
      }
      this.collected = !this.collected;
    },

    async getVideoLikes(){
      let response = await videoApi.getVideoLikes(this.$route.query.videoId);
      this.likeCount = response.data.count !== null ? response.data.count:this.likeCount;
      this.liked = response.data.like;
    },

    async getVideoCoins(){
      let response = await videoApi.getVideoCoins(this.$route.query.videoId);
      this.coinCount = response.data.count !== null ? response.data.count:this.coinCount;
      this.hasCoin = response.data.hasCoin;
    },

    async getVideoCollections(){
      let response = await videoApi.getVideoCollections(this.$route.query.videoId);
      this.collectCount = response.data.count !== null ? response.data.count:this.collectCount;
      this.collected = response.data.collected;
    },

    async getVideoViewCounts(){
      let response = await videoApi.getVideoViewCounts(this.$route.query.videoId);
      this.viewCount = response.data !== null ? response.data : this.viewCount;
    },

    async addUserFollowings(followingId){
      if(!this.isUserLoggedIn){
        this.showLoginDialog = true;
        return;
      }
      let params = {
        followingId:followingId
      }
      await userApi.addUserFollowings(params);
      this.followed = true;
    },

    async getUserFollowings(){
      let response = await userApi.getUserFollowings();
      let followingGroupList = response.data;
      let followingUserList = [];
      followingGroupList.forEach(
          group => followingUserList.push(...(group.followingUserInfoList)));
      this.followed
          = followingUserList.some(item => item.userId === this.videoUpInfo.userId);
    },

    millisecondsToMinutesAndSeconds(milliseconds) {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
      return `${formattedMinutes}:${formattedSeconds}`;
    },

  },

  computed:{
    likeIcon(){
      return this.liked?
          require('@/assets/icon/dianzan2.png') : require('@/assets/icon/dianzan1.png');
    },

    collectIcon(){
      return this.collected?
          require('@/assets/icon/shoucang2.png') : require('@/assets/icon/shoucang1.png');
    }
  },

  mounted() {
    this.getVideoDetail();
    this.initWebsocket();
  }
}
</script>

<template>
  <div>
    <CommonHeader/>
    <div class="video-detail-container">
      <div class="left-container">
        <div class="video-info-container">
          <div class="video-info-title">
            {{videoDetail.title}}
          </div>
          <div class="video-info-count">
            <span>
              <img :src="require('@/assets/icon/viewCount.png')" alt="">
              {{viewCount}}
            </span>
            <span>
              <img :src="require('@/assets/icon/danmuCount.png')" alt="">
              {{danmuCount}}
            </span>
            <span>
              {{videoDetail.createTime}}
            </span>
            <span>
              <img :src="require('@/assets/icon/jinzhi.png')" alt="">
              未经作者授权，禁止转载
            </span>
          </div>
        </div>
<!--        播放器页面站位DOM-->
        <div id="ev-player"></div>

        <div class="danmu-bar">
<!--          数据统计-->
          <div class="danmu-bar-video-info">
            {{onWatching}}人正在看，已装填{{danmuCount}}条弹幕
          </div>
<!--          弹幕操作-->
          <div class="danmu-bar-operation">
            <div class="danmu-bar-sender">
              <input class="danmu-bar-sender-input" v-model="danmuText"
                     placeholder="发个友善的内容见证当下" autocomplete="off"
                      @keyup.enter="sendDanmu">
              <el-button type="primary" @click="sendDanmu">发送</el-button>
            </div>
          </div>

        </div>

        <!--          点赞、投币、收藏-->
        <div class="video-tools-bar">
          <div class="video-tools-bar-left">
            <!--              点赞-->
            <div class="like-coin-collect">
              <img :src="likeIcon" @click="addOrDeleteVideoLike" alt="">
              <div>{{likeCount}}</div>
            </div>
            <!--              收藏-->
            <div class="like-coin-collect">
              <img :src="collectIcon" @click="addOrDeleteVideoCollection" alt="">
              <div>{{collectCount}}</div>
            </div>

          </div>

        </div>

<!--        视频描述和视频标签-->
        <div class="left-container-under-player">
<!--          视频描述-->
          <div class="video-detail-description">
            {{videoDetail.description}}
          </div>
<!--          视频标签-->
          <div class="video-detail-tags">
            <el-tag type="info" style="margin-right: 20px; font-size: 16px"
              v-for="tag in videoDetail.videoTagList" :key="tag.tagId">
                {{tag.tagName}}
            </el-tag>
          </div>
        </div>

        <VideoComment v-if="this.$store.state.showVideoCommentComponent" />

      </div>
      <div class="right-container">
<!--        视频投稿的up主信息-->
        <div class="up-info-container">
          <div class="up-avatar">
            <img :src="videoUpInfo.avatar" alt="">
          </div>
          <div class="up-info-right">
            <div class="up-info-detail">
              {{videoUpInfo.nick}}
            </div>
          </div>
          <div class="up-operation">
            <el-button type="primary"
                       v-if="!followed"
                       @click="addUserFollowings(videoUpInfo.userId)">
              关注
            </el-button>
            <el-button type="primary" v-else disabled>
              已关注
            </el-button>
            <el-dialog title="密码登录"
                       :visible.sync="showLoginDialog"
                       width="30%">
              <LoginDialog/>
            </el-dialog>
          </div>
        </div>

        <div>
          <img src="@/assets/alice.gif" alt="My Animation">
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.video-detail-container{
  display: flex;
  justify-content: center;

  .left-container{
    display: flex;
    flex-direction: column;

    .video-info-container{
      display: flex;
      height: 108px;
      flex-direction: column;
      justify-content: center;

      .video-info-title{
        font-size: 24px;
        margin-bottom: 5px;
      }
      .video-info-count{
        font-size: 13px;
        align-items: center;
        color: gray;
        display: flex;
        span{
          display: flex;
          align-items: center;
          margin-right: 20px;
          img{
            height: 25px;
            width: 25px;
            border-radius: 2px;
            margin-right: 5px;
          }
        }

      }
    }

    .danmu-bar{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #d5d2d2;
      border-radius: 2px;

      .danmu-bar-video-info{
        width: 100%;
      }

      .danmu-bar-operation{
        display: flex;
        height: 40px;
        width: 100%;
        border-radius: 8px;
        background: #f4f4f4;

        .danmu-bar-sender{
          display: flex;
          width: 100%;
          align-items: center;
          border: none;
          border-radius: 8px 0 0 8px;
          height: 100%;

          .danmu-bar-sender-input{
            outline: none;
            background: none;
            border: 0;
            color: #212121;
            height: 28px;
            line-height: 28px;
            min-width: 100px;
            padding: 0 5px;
            width: 100%;
          }

        }

      }

    }

    .video-tools-bar{
      margin-top: 10px;
      display: flex;
      border-bottom: 1px solid #d5d2d2;
      .video-tools-bar-left{
        width: 100%;
        display: flex;
        margin-bottom: 10px;
        .like-coin-collect{
          display: flex;
          align-items: center;
          margin-right: 40px;
          img{
            height:36px;
            width: 36px;
            margin-right: 10px;
            cursor: pointer;
          }

        }
      }
    }

    .left-container-under-player{

      .video-detail-description{
        max-width: 800px;
        margin: 18px 0;
      }

    }
  }

  .right-container{
    margin-left: 30px;
    display: flex;
    flex-direction: column;

    .up-info-container{
      display: flex;
      align-items: center;
      height: 108px;
      .up-avatar{
        img{
          width: 60px;
          height: 60px;
          border-radius: 5px;
        }
      }
      .up-info-right{
        padding: 20px;
        .up-info-detail{
          color: #FB7299;
        }
      }
    }
  }


}
</style>