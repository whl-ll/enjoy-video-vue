<script>
import userUtils from "@/utils/userUtils";
import LoginDialog from "@/components/LoginDialog.vue";
import videoApi from "@/api/videoApi";

export default {
  name: "VideoComment",
  components: {LoginDialog},
  mixins:[userUtils],
  data(){
    return {
      commentsCount:0,
      comment:'',
      showLoginDialog:false,
      videoCommentList:[],
      currentCommentId:'',
      commentUserName:'',
      replyUserId:'',
      infiniteId:1,
      currentCommentPage:1,
      totalComments:0,
      replyTxt:''

    }

  },

  methods:{

    async addVideoComment(){
      let params = {
        videoId:this.$route.query.videoId,
        comment:this.comment
      }
      await videoApi.addVideoComment(params);
      this.comment = '';
      //刷新评论区展示内容
      this.refreshVideoCommentComponent();
    },

    refreshVideoCommentComponent(){
      this.$store.state.showVideoCommentComponent = false;
      this.$nextTick( ()=>{
        this.$store.state.showVideoCommentComponent = true
      });
    },

    recordCurrentClickedComment(commentId, commentUserName, replyUserId){
      this.currentCommentId = commentId;
      this.commentUserName = commentUserName;
      this.replyUserId = replyUserId;
    },

    getVideoComments($state){
      let params = {
        videoId:this.$route.query.videoId,
        size:10,
        no:this.currentCommentPage
      };
      videoApi.pageListVideoComments({params}).then(response => {
        const {list:comments, total:total} = response.data;
        if(comments.length === 0){
          // 已加载所有数据。不再触发加载
          $state.complete();
          return;
        }
        this.videoCommentList = this.videoCommentList.concat(comments);
        this.totalComments = total;
        this.currentCommentPage++;
        $state.loaded();
      }).catch(error => {
        console.log('请求出错', error);
        $state.complete();
      })
    },

    async addReplyComment(replyCommentId){
      let params = {
        videoId:this.$route.query.videoId,
        comment:this.replyTxt,
        rootId:replyCommentId,
        replyUserId:this.replyUserId
      }
      await videoApi.addVideoComment(params);
      this.replyTxt = '';
      this.refreshVideoCommentComponent();
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
  }
}
</script>

<template>

  <div class="comment-container">

<!--    评论header-->
    <div class="comment-header">
      <div class="comment-header-title">
        评论
        <div class="comment-count">
          {{commentsCount}}
        </div>
      </div>
      <div class="comment-header-sort">
        <div class="hot-sort">

        </div>
        <div class="part-symbol">

        </div>
        <div class="time-sort">

        </div>
      </div>

    </div>

    <div class="comment-body">
<!--      用户没有登录的情况-->
      <div v-if="!this.isUserLoggedIn" class="comment-body-before-login">
        <div class="comment-send-area-before-login">
          <div class="user-avatar-before-login">
            <img :src="require('@/assets/ev.png')" alt="">
          </div>
          <div class="comment-input-before-login">
            <textarea class="comment-input-textarea"
                      placeholder="请登录后再观看和发表评论" v-model="comment">
            </textarea>
          </div>
          <div class="comment-button-before-login">
            <el-button type="primary" @click="showLoginDialog = true">
              发布
            </el-button>
            <el-dialog title="密码登录" :visible.sync="showLoginDialog" width="30%">
              <LoginDialog/>
            </el-dialog>
          </div>
        </div>


      </div>

<!--      用户登录的情况-->
      <div v-else class="comment-body-login">
<!--        输入评论区 and 发送-->
        <div class="comment-send-area">
          <div class="user-avatar">
            <img :src="avatar" alt="">
          </div>
          <div class="comment-input">
            <textarea class="comment-input-textarea" placeholder="天青色等烟雨，评论区在等你"
                      v-model="comment">
            </textarea>
          </div>
          <div class="comment-button">
            <el-button type="primary" @click="addVideoComment">
              发布
            </el-button>
          </div>
        </div>

<!--        查看评论区-->
        <div v-if="videoCommentList.length > 0">
          <div class="comment-root-reply-container"
               v-for="rootComment in videoCommentList" :key="rootComment.id">
            <div class="root-reply-avatar">
              <img :src="rootComment.userInfo.avatar" alt="">
            </div>
            <div class="total-reply-content-container">
<!--              一级评论-->
              <div class="root-reply-content-container">
                <div class="root-reply-username">
                  {{rootComment.userInfo.nick}}
                </div>
                <div class="root-reply-content">
                  <div class="root-reply-content-txt">
                    {{rootComment.comment}}
                  </div>
                  <div class="root-reply-content-operation">
                    <div class="reply-time">
                      {{rootComment.createTime}}
                    </div>
                    <div class="reply-btn"
                         @click="recordCurrentClickedComment(rootComment.id,
                       rootComment.userInfo.nick, rootComment.userId)">
                      回复
                    </div>
                  </div>
                </div>
              </div>
<!--              二级结构-->
              <div class="sub-reply-content-container"
                   v-for="childComment in rootComment.childList" :key="childComment.id">
                <div class="sub-reply-userInfo">
                  <div class="sub-reply-avatar">
                    <img :src="childComment.userInfo.avatar" alt="">
                  </div>
                </div>
                <div class="sub-reply-content">
                  <div class="sub-reply-username">
                    {{childComment.userInfo.nick}}
                  </div>
                  <div class="sub-reply-wrap">
                    <div >
                      回复{{childComment.replyUserInfo.nick}}：
                    </div>
                    <div class="sub-reply-content-txt">
                      {{childComment.comment}}
                    </div>
                  </div>
                  <div class="sub-reply-content-operation">
                    <div class="reply-time">
                      {{childComment.createTime}}
                    </div>
                    <div class="reply-btn"
                         @click="recordCurrentClickedComment(childComment.id,
                         childComment.userInfo.nick, childComment.userId)">
                      回复
                    </div>
                  </div>
                </div>
              </div>
<!--              回复某一个用户的评论区域-->
              <div class="reply-comment-area"
                   v-if="currentCommentId === rootComment.id
                   || rootComment.childList.some(item => item.id === currentCommentId)">
                <div class="reply-user-avatar">
                  <img :src="avatar" alt="">
                </div>
                <div class="reply-comment-input">
                  <textarea class="comment-input-textarea"
                              :placeholder="'回复' + commentUserName"
                              v-model="replyTxt">
                  </textarea>
                </div>
                <div class="reply-comment-button">
                  <el-button type="primary" @click="addReplyComment(rootComment.id)">
                    回复
                  </el-button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
      <infinite-loading :infinite-id="infiniteId" @infinite="getVideoComments">
      </infinite-loading>

    </div>

  </div>

</template>

<style scoped lang="less">

.comment-container{
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-direction: column;

  .comment-header{
    display: flex;

    .comment-header-title{
      display: flex;
      align-items: center;
      margin-right: 20px;
      font-size: 24px;
      font-weight: 500;
      .comment-count{
        font-size: 14px;
        margin: 0 36px 0 6px;
        font-weight: 400;
        color: #a8a6a6;
      }
    }

    .comment-header-sort{
      display: flex;
      align-items: center;

      .hot-sort{
        cursor: pointer;
      }

      .time-sort{
        cursor: pointer;
      }

      .part-symbol{

      }
    }
  }

  .comment-body{

    .comment-body-login{
      display: flex;
      flex-direction: column;

      .comment-send-area{
        display: flex;
        align-items: center;
        margin-top: 20px;

        .user-avatar{
          display: flex;
          flex: 1;
          img{
            height: 70px;
            width: 70px;
          }
        }

        .comment-input{
          flex:6;
          height: 50px;
          .comment-input-textarea{
            height: 100%;
            width: 100%;
            border: none;
            border-radius: 6px;
            background-color: #e7e7e7;
            line-height: 38px;
            resize: none;
            outline: none;

          }
        }

        .comment-button{
          display: flex;
          justify-content: flex-end;
          flex: 1;
        }
      }

      .comment-root-reply-container{
        display: flex;
        margin-top: 20px;

        .root-reply-avatar{
          margin-right: 20px;
          img{
            height:50px;
            width: 50px;
            border-radius: 2px;
          }
        }

        .total-reply-content-container{
          display: flex;
          flex-direction: column;

          .root-reply-content-container{
            display: flex;
            flex-direction: column;

            .root-reply-username{
              font-size: 14px;
              font-weight: 500;
              color: gray;
              margin-top: 10px;
              margin-bottom: 4px;
            }

            .root-reply-content{
              display: flex;
              flex-direction: column;

              .root-reply-content-txt{
                font-size: 16px;
              }

              .root-reply-content-operation{
                display: flex;
                align-items: center;
                font-size: 13px;
                color: gray;
                margin-top: 4px;
                .reply-time{
                  margin-right: 20px;
                }
                .reply-btn{
                  cursor: pointer;
                }

              }

            }

          }
          .sub-reply-content-container{
            display: flex;
            align-items: center;
            font-size: 14px;

            .sub-reply-userInfo{
              display: flex;
              align-items: center;

              .sub-reply-avatar{
                margin-right: 20px;
                img{
                  height: 40px;
                  width: 40px;
                  border-radius: 2px;
                }
              }
            }
            .sub-reply-content{
              display: flex;
              flex-direction: column;
              .sub-reply-username{
                font-size: 14px;
                font-weight: 500;
                color: gray;
                margin-top: 10px;
                margin-bottom: 4px;
              }
              .sub-reply-wrap{
                display: flex;
              }
              .sub-reply-content-operation{
                display: flex;
                align-items: center;
                font-size: 13px;
                color: gray;
                margin-top: 4px;
                .reply-time{
                  margin-right: 20px;
                }
                .reply-btn{
                  cursor: pointer;
                }
              }
            }

          }
          .reply-comment-area{
            display: flex;
            align-items: center;
            margin-top: 10px;

            .reply-user-avatar{
              flex: 1;
              margin-right: 6px;
              img{
                height: 50px;
                width: 50px;
              }
            }

            .reply-comment-input{
              flex:3;
              height: 40px;
              display: flex;
              align-items: center;
              margin-right: 6px;

              .comment-input-textarea{
                font-size: 14px;
                height: 100%;
                width: 100%;
                border: none;
                border-radius: 6px;
                background-color: #e7e7e7;
                line-height: 38px;
                resize: none;
                outline: none;

              }
            }

            .reply-comment-button{
              display: flex;
              justify-content: flex-end;
              flex: 1;
            }
          }
        }
      }
    }

    .comment-body-before-login{
      display: flex;
      flex-direction: column;

      .comment-send-area-before-login{
        display: flex;
        align-items: center;
        margin-top: 20px;

        .user-avatar-before-login{
          flex: 1;
          display: flex;
          align-items: center;
          img{
            height: 70px;
            width: 70px;
          }
        }
        .comment-input-before-login{
          flex:6;
          height: 50px;
          .comment-input-textarea{
            height: 100%;
            width: 100%;
            border: none;
            border-radius: 6px;
            background-color: #e7e7e7;
            line-height: 38px;
            resize: none;
            outline: none;

          }
        }

        .comment-button-before-login{
          display: flex;
          justify-content: flex-end;
          flex: 1;
        }
      }

    }
  }

}

</style>