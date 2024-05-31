<script>
import CommonHeader from "@/components/CommonHeader.vue";
import routerUtils from "@/utils/routerUtils";
import userApi from "@/api/userApi";
import fileUtils from "@/utils/fileUtils";

export default {
  name: "MySpaceNavigator",
  components: {CommonHeader},
  mixins:[routerUtils, fileUtils],
  data(){
    return {
      navigationList:[
        {
          name:'主页',
          path:'/mySpace/home',
          index:'1'
        },
        {
          name:'投稿',
          path:'/mySpace/post',
          index:'2'
        },
        {
          name:'关注',
          path:'/mySpace/following',
          index:'3'
        },
        {
          name:'收藏',
          path:'/mySpace/collection',
          index:'4'
        },
        {
          name:'个人信息',
          path:'/mySpace/info',
          index:'5'
        },
      ],
      selectedFile:null
    }
  },

  methods:{

    selectAvatar(){
      this.$refs.fileInput.click();
    },

    async setAvatar(){
      const files = this.$refs.fileInput.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
        const response = await this.uploadFileBySlices(this.selectedFile);
        const avatar = 'http://120.55.181.121:8888/group1/' + response.data;
        console.log('new avatar: ', avatar);
        let params = {
          avatar:avatar
        }
        await userApi.updateUserInfo(params);
        this.$store.state.userInfo.avatar = avatar;
      }
    },

  },

  computed:{

    activeIndex(){
      let index = '1';
      this.navigationList.forEach(item =>{
        if(item.path === this.$route.path){
          index = item.index;
        }
      })
      return index;
    },

    //获取用户头像（通过CommonHeader给vuex传递userInfo来获取）
    userInfo(){
      const userInfo = this.$store.state.userInfo;
      if (userInfo) {
        if(!userInfo.avatar){
          userInfo.avatar = require('@/assets/ev.png');
        }
        return userInfo;
      } else {
        return {
          avatar: require('@/assets/ev.png'),
          nick: '-',
          sing: '-',
          gender: '-'
        };
      }
    },

    gender(){
      const gender = this.userInfo.gender;
      const male = require('@/assets/icon/male.png');
      const female = require('@/assets/icon/female.png');
      const unknown = require('@/assets/icon/unknown.png');
      if(gender){
        return gender==='0'? male : female;
      }else{
        return unknown;
      }
    }

  }
}
</script>

<template>

  <div class="my-space-container">
    <CommonHeader/>

    <div class="my-space-content-container">
      <!--    用户信息-->
      <div class="my-space-userinfo-container">
<!--        头像-->
        <div class="my-space-avatar" @click="selectAvatar">
          <img :src="userInfo.avatar" alt="">
          <input type="file" ref="fileInput" style="display: none"
                 @change="setAvatar" accept="image/*">
        </div>
        <div class="info-wrap">
          <div class="my-space-userinfo">
            <div class="my-space-nick">
              {{userInfo.nick}}
            </div>
            <div class="my-space-gender">
              <img :src="gender" alt="">
            </div>
          </div>
          <div class="my-space-sign">
            {{userInfo.sign}}
          </div>
        </div>
      </div>

<!--      导航栏-->
      <div class="my-space-navigator">
        <el-menu :default-active="activeIndex"
                 class="navigator-menu" mode="horizontal">
          <el-menu-item class="navigator-menu-item" @click="jumpToPath(navigation.path)"
                        v-for="navigation in navigationList"
                        :key="navigation.index"
                        :index="navigation.index">
            {{navigation.name}}
          </el-menu-item>
        </el-menu>
      </div>
    </div>

  </div>

</template>

<style scoped lang="less">

.my-space-container{


  .my-space-content-container{
    margin-left: 20%;
    margin-right: 20%;

    .my-space-userinfo-container{
      margin-top: 20px;
      display: flex;
      align-items: center;

      .my-space-avatar{
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;
        img{
          height:80px;
          width: 80px;
          border-radius: 2px;
        }
      }

      .info-wrap{
        display: flex;
        flex-direction: column;
        justify-content: center;

        .my-space-userinfo{
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .my-space-nick{
            font-weight: bold;
            font-size: 24px;
            margin-right: 10px;
          }
          .my-space-gender{
            display: flex;
            img{
              height:30px;
              width: 30px;
              border-radius: 2px;
            }

          }
        }

        .my-space-sign{
          color: gray;
          font-size: 18px;
        }
      }



    }

    .my-space-navigator{
      margin-top: 20px;
      border-top: #e7e4e4 solid 1px;

      .navigator-menu{

        .navigator-menu-item{
          font-size: 18px;
          margin-right: 20px;

        }
      }
    }


  }



}

</style>