<script>
import userUtils from "@/utils/userUtils";
import userCenterApi from "@/api/userCenterApi";
import MoveFollowingGroupDialog from "@/components/MoveFollowingGroupDialog.vue";

export default {
  name: "MySpaceFollowing",
  components: {MoveFollowingGroupDialog},
  mixins:[userUtils],
  data(){
    return {
      showFollowing:true,
      followingGroups:[],
      groupName:'',
      showAddGroupDialog:false,
      showMoveFollowingGroupDialog:false,
      currentFollowingId:null,
      totalFollowingCount:0,
      total:0,
      size:5,
      currentPage:1,
      currentGroupId:null,
      userFollowings:[],
      invisible:[],
      totalUserFans:0,
      userFans:[]
    }
  },

  methods:{

    async getUserCenterFollowingGroups(){
      const response = await userCenterApi.getUserCenterFollowingGroups();
      if(response.data){
        this.followingGroups = response.data;
        this.totalFollowingCount
            = this.followingGroups.map(item => item['count']).reduce((x, y)=> x+y);
      }
    },

    async countUserFans(){
      const response = await userCenterApi.countUserFans();
      if(response.data){
        this.totalUserFans = response.data;
      }
    },

    async pageListUserCenterFollowings(currentGroupId){
      this.currentGroupId = currentGroupId;
      let params = {
        size:this.size,
        no:this.currentPage,
        groupId:this.currentGroupId
      }
      let response = await userCenterApi.pageListUserCenterFollowings(params);
      if(response.data){
        this.total = response.data.total;
        this.userFollowings = response.data.list;
      }
      this.showFollowing = true;
    },

    async pageListUserFans(size, currentPage){
      this.showFollowing=false;
      let params = {
        size: size,
        no: currentPage
      }
      let response = await userCenterApi.pageListUserFans(params);
      if(response.data){
        const data = response.data;
        this.total = data.total;
        this.userFans = data.list;
        this.userFans.forEach(fan => {
          if(fan.userInfo.followed === false){
            this.invisible.push(fan.userId)
          }
        })
      }
    },

    async addUserFollowingGroups(){
      let params = {
        name:this.groupName
      }
      await userCenterApi.addUserFollowingGroups(params);
      this.showAddGroupDialog = false;
      location.reload();
    },

    visible(userFollowingId){
      return !this.invisible.some(item => item === userFollowingId);
    },

    async addUserFollowing(followingId){
      await userCenterApi.addUserFollowing(followingId);
      location.reload();
    },

    async deleteUserFollowing(followingId){
      await userCenterApi.deleteUserFollowing(followingId);
      location.reload();
    },

    setMoveFollowingGroupDialog(currentFollowingId){
      this.currentFollowingId = currentFollowingId;
      this.showMoveFollowingGroupDialog = true;
    }

  },

  mounted() {
    if(this.isUserLoggedIn){
      this.getUserCenterFollowingGroups();
      this.pageListUserCenterFollowings();
      this.countUserFans();
    }
  }
}
</script>

<template>
<div class="my-space-following">
  <div class="my-space-following-container">
<!--    左侧导航栏-->
    <div class="my-space-nav">
<!--      我的关注-->
      <div class="title">
        <div class="title-txt">
          我的关注
        </div>
        <el-button type="info" plain
                   icon="el-icon-plus"
                    class="add-group-button"
                    @click="showAddGroupDialog=true">
        </el-button>
        <el-dialog
            title="新建分组"
            :visible.sync="showAddGroupDialog"
            width="30%"
            center>
          <input type="text"
                 v-model="groupName"
                 placeholder="最多输入16个字" maxlength="16"
                  style="width: 100%">
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAddGroupDialog = false">取 消</el-button>
            <el-button type="primary" @click="addUserFollowingGroups">确 定</el-button>
          </span>
        </el-dialog>
      </div>
<!--      导航菜单-->
      <div class="my-space-menu">
        <div class="my-space-menu-item"
             @click="pageListUserCenterFollowings(null)">
          <div>
            全部
          </div>
          <div class="menu-item-count">
            {{totalFollowingCount}}
          </div>
        </div>
        <div class="my-space-menu-item"
              v-for="(group, index) in followingGroups"
             :key="index"
              @click="pageListUserCenterFollowings(group.id)">
          <div>
            {{group.name}}
          </div>
          <div class="menu-item-count">
            {{group.count}}
          </div>
        </div>
      </div>
<!--      我的粉丝-->
      <div class="title">
        <div class="title-txt">
          我的粉丝
        </div>
      </div>
      <div class="my-space-menu">
        <div class="my-space-menu-item">
          <div @click="pageListUserFans(size,1)">
            我的粉丝
          </div>
          <div class="menu-item-count">
            {{ totalUserFans }}
          </div>
        </div>
      </div>
    </div>

<!--右侧用户关注内容-->
    <div class="my-space-content">
<!--      关注-->
      <div class="my-space-content-following" v-if="showFollowing">
        <div class="my-space-content-list">
          <div class="list-item" v-for="userFollowing in userFollowings"
               :key="userFollowing.id">
<!--            用户信息-->
            <div class="item-infos">
              <div class="avatar">
                <img :src=userFollowing.userInfo.avatar class="image" alt="">
              </div>
              <div class="description">
                <div class="nick">
                  <span>{{ userFollowing.userInfo.nick }}</span>
                </div>
                <div class="sign">
                  <span>{{ userFollowing.userInfo.sign }}</span>
                </div>
              </div>
            </div>
<!--            关注相关操作-->
            <div class="operation">
              <el-dropdown>
                <el-button type="primary">
                  已关注<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button type="text" style="color: black"
                               @click="setMoveFollowingGroupDialog(userFollowing.followingId)">
                      设置分组
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text" style="color: black"
                               @click="deleteUserFollowing(userFollowing.followingId)">
                      取消关注
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dialog
                  title="你正在移动1个关注用户"
                  :visible.sync="showMoveFollowingGroupDialog"
                  width="30%">
                <MoveFollowingGroupDialog :followingGroups="followingGroups"
                                          :followingId="currentFollowingId"
                                          :currentGroupId = "currentGroupId"/>
              </el-dialog>
            </div>
          </div>
        </div>
<!--        分页组件-->
        <div class="page-list-content-detail">
          <el-pagination
              background
              layout="prev, pager, next"
              :page-size="size"
              :current-page.sync="currentPage"
              @current-change="pageListUserCenterFollowings"
              :total="total">
          </el-pagination>
        </div>
      </div>
<!--      粉丝-->
      <div class="my-space-content-fans" v-else>
        <div class="my-space-content-list">
          <div class="list-item" v-for="userFan in userFans"
               :key="userFan.id">
<!--            用户信息-->
            <div class="item-infos">
              <div class="avatar">
                <img :src=userFan.userInfo.avatar class="image" alt="">
              </div>
              <div class="description">
                <div class="nick">
                  <span>{{ userFan.userInfo.nick }}</span>
                </div>
                <div class="sign">
                  <span>{{ userFan.userInfo.sign }}</span>
                </div>
              </div>
            </div>
<!--            相关粉丝操作-->
            <div class="userFollowing-operation">
              <el-dropdown v-if="visible(userFan.userId)">
                <el-button type="primary">
                  互相关注<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button type="text" style="color: black"
                               @click="setMoveFollowingGroupDialog(userFan.userId)">
                      设置分组
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text" style="color: black"
                               @click="deleteUserFollowing(userFan.userId)">
                      取消关注
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="info" plain v-else
                         @click="addUserFollowing(userFan.userId)">
                关注
              </el-button>
              <el-dialog
                  title="你正在移动1个关注用户"
                  :visible.sync="showMoveFollowingGroupDialog"
                  width="30%">
                <MoveFollowingGroupDialog :followingGroups="followingGroups"
                                      :followingId="currentFollowingId"
                                      :currentGroupId = "currentGroupId"/>
              </el-dialog>
            </div>
          </div>
        </div>
        <div class="page-list-content-detail">
          <el-pagination
              background
              layout="prev, pager, next"
              :page-size="size"
              :current-page.sync="currentPage"
              @current-change="pageListUserFans"
              :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="less">

  .my-space-following{
    margin-top: 40px;
    margin-left: 20%;
    margin-right: 20%;

    .my-space-following-container{
      display: flex;

      .my-space-nav{
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

        .my-space-menu{
          cursor: pointer;
          border-bottom: lightgray solid 1px;


          .my-space-menu-item{
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

      .my-space-content{
        margin-left: 40px;
        display: flex;
        flex-direction: column;
        width: 100%;
        flex: 7;

        .my-space-content-list{

          .list-item{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: lightgray solid 1px;
            justify-content: space-between;

            .item-infos{
              display: flex;
              align-items: center;
              .avatar{
                margin-right: 20px;
                img{
                  height: 80px;
                  width: 80px;
                  border-radius: 2px;
                }
              }
              .description{
                display: flex;
                flex-direction: column;

                .nick{
                  color: rgb(251, 114, 153);
                  margin-bottom: 10px;
                }

                .sign{
                  font-size: 16px;
                  color: gray;
                }
              }
            }

          }

        }

        .page-list-content-detail{
          display: flex;
          justify-content: center;
          align-items: center;
        }


      }
    }


  }

</style>