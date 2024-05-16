<script>
import userCenterApi from "@/api/userCenterApi";
import userUtils from "@/utils/userUtils";
import routerUtils from "@/utils/routerUtils";
import videoApi from "@/api/videoApi";
import MoveCollectionDialog from "@/components/MoveCollectionDialog.vue";
export default {
  name: "MySpaceCollection",
  components: {MoveCollectionDialog},
  mixins:[userUtils,routerUtils],
  data(){
    return{
      showAddCollectionDialog:false,
      groupName:'',
      collectionGroups:[],
      collections:[],
      currentPage:1,
      size:5,
      total:0,
      currentGroupId:null,
      showMoveCollectionDialog:false,
      moveVideoId:null,
      moveVideoGroupId:null

    }
  },

  methods:{

    async handleMenuClick(groupId){
      this.currentGroupId = groupId;
      await this.pageListUserCenterCollections(this.size, 1, this.currentGroupId);
    },

    async pageListUserCenterCollections(size, currentPage, groupId){
      let params = {
        size:size,
        no:currentPage,
        groupId:groupId
      }
      let response = await userCenterApi.pageListUserCenterCollections(params);
      if(response.data){
        const {groups:groups}=response.data;
        const {pageResult:collections}=response.data;
        this.collectionGroups = groups;
        this.collections = collections.list;
        this.total = collections.total;
      }
    },

    async addUserCollectionGroups(){

      if(this.groupName && this.groupName !== ''){
        let params = {
          name:this.groupName
        };
        await userCenterApi.addUserCollectionGroups(params);
      }
      this.groupName = '';
      this.showAddCollectionDialog = false;
      location.reload();
    },

    async deleteCollection(videoId){
      await videoApi.deleteVideoCollection(videoId);
      location.reload();
    },

    moveCollection(videoId, moveVideoGroupId){
      this.moveVideoId = videoId;
      this.moveVideoGroupId = moveVideoGroupId;
      this.showMoveCollectionDialog = true;

    }

  },

  mounted() {
    if(this.isUserLoggedIn){
      this.pageListUserCenterCollections(this.size, this.currentPage);
    }
  }
}
</script>

<template>
<div class="my-space-collection">

  <div class="my-space-collection-container">
    <div class="my-space-collection-nav">
      <div class="title">
        <div class="title-txt">
          我的创建
        </div>
        <el-button type="info" plain
                   icon="el-icon-plus"
                   class="add-group-button"
                   @click="showAddCollectionDialog=true">
        </el-button>
        <el-dialog
            title="新建收藏夹"
            :visible.sync="showAddCollectionDialog"
            width="30%"
            center>
          <input type="text"
                 v-model="groupName"
                 placeholder="最多输入16个字" maxlength="16"
                 style="width: 100%">
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAddCollectionDialog = false">取 消</el-button>
            <el-button type="primary" @click="addUserCollectionGroups">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="my-space-collection-menu">
        <div class="my-space-collection-menu-item"
             v-for="group in collectionGroups"
             :key="collectionGroups.indexOf(group)"
             @click="handleMenuClick(group.groupId)">
          <div>
            {{group.groupName}}
          </div>
          <div class="menu-item-count">
            {{group.count}}
          </div>
        </div>
      </div>
    </div>
    <div class="my-space-collection-content">
      <div class="my-space-collection-videos">
        <div class="collection-videos-item" v-for="collection in collections"
             :key="collection.videoInfo.id">
          <div class="collection-videos-item-detail">
            <div class="collection-video-img">
              <img :src=collection.videoInfo.thumbnail class="image" alt="">
            </div>
            <div class="collection-video-info">
              <div class="collection-video-info-title" @click="jumpToVideoDetail(collection.videoInfo.id)">
                <span>{{ collection.videoInfo.title }}</span>
              </div>
              <div class="collection-video-info-description">
                <span>{{ collection.videoInfo.description}}</span>
              </div>
              <div class="collection-video-info-createTime">
                <span>
                  收藏于：{{collection.videoInfo.createTime}}
                </span>
                <el-dropdown trigger="click" style="cursor: pointer">
                  <span class="el-dropdown-link">
                    ...
                  </span>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button type="text" style="color: black"
                                 @click="deleteCollection(collection.videoInfo.id)">
                        取消收藏
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="text" style="color: black"
                                 @click="moveCollection(collection.videoInfo.id, collection.groupId)">
                        移动到
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
        <div class="page-list-collections">
          <el-pagination
              background
              layout="prev, pager, next"
              :page-size="size"
              :current-page.sync="currentPage"
              @current-change="pageListUserCenterCollections(size, currentPage, currentGroupId)"
              :total="total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
          title="你正在移动1个视频到"
          :visible.sync="showMoveCollectionDialog"
          width="30%">
        <MoveCollectionDialog :collectionGroups="collectionGroups"
                              :moveVideoId="moveVideoId"
                              :moveVideoGroupId="moveVideoGroupId" />
      </el-dialog>
    </div>
  </div>
</div>
</template>

<style scoped lang="less">

.my-space-collection{
  margin-top: 40px;
  margin-left: 20%;
  margin-right: 20%;

  .my-space-collection-container{
    display: flex;

    .my-space-collection-nav{
      width: 100%;
      flex: 2;

      .title{
        color: darkgray;
        margin-bottom: 20px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title-txt{
          margin-right: 40px;
        }

        .add-group-button{
          height: 20px;
          width: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

      }
      .my-space-collection-menu{
        cursor: pointer;
        border-bottom: lightgray solid 1px;

        .my-space-collection-menu-item{
          font-size: 18px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;

          .menu-item-count{
            color: darkgray;
          }
        }
      }

    }

    .my-space-collection-content{
      flex: 7;
      display: flex;
      flex-direction: column;
      margin-left: 40px;

      .my-space-collection-videos{
        .collection-videos-item{
          margin-bottom: 40px;
          .collection-videos-item-detail{
            display: flex;
            align-items: center;

            .collection-video-img{
              margin-right: 40px;
              img{
                width: 240px;
                height: 135px;
                border-radius: 5px;
              }
            }

            .collection-video-info{
              height: 135px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;

              .collection-video-info-title{
                display: flex;
                font-size: 22px;
                cursor: pointer;
              }

              .collection-video-info-description{
                display: flex;
                font-size: 16px;
              }

              .collection-video-info-createTime{
                font-size: 16px;
                display: flex;
                color: gray;
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

        .page-list-collections{
          display: flex;
          align-items: center;
          justify-content: center;
        }

      }

    }


  }

}

</style>