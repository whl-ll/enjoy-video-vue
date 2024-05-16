<script>
import userApi from "@/api/userApi";

export default {
  name: "SearchUser",
  data(){
    return {
      users:[],
      pageSize:4,
      currentPage:1,
      totalUserCount:0,
      tabPosition:'默认排序',
      currentTabType:'4',
      tabs:[
        {
          label:'默认排序',
          type:'4'
        },
        {
          label:'粉丝数由高到低',
          type:'5'
        },
        {
          label:'粉丝数由低到高',
          type:'6'
        }
      ]
    }
  },

  methods:{

    async searchUsers(){
      let params = {
        pageSize:this.pageSize,
        pageNo:this.currentPage,
        keyword:this.$route.query.searchTxt,
        searchType:this.currentTabType
      }
      let response = await userApi.pageListUsersByEs(params);
      if(response.data){
        this.users = response.data.content;
        this.totalUserCount = response.data.totalElements;
      }
    },

    async handleTabClick(tabType){
      this.currentTabType = tabType;
      this.tabs.forEach(item => {
        if(item.type === tabType){
          this.tabPosition = item.label;
        }
      });
      await this.searchUsers();
    }

  },
  mounted() {
    this.searchUsers();
  }
}
</script>

<template>
<div class="search-contents-users-container">
  <div class="search-contents-users-tab">
    <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
      <el-radio-button v-for="tab in tabs" :key="tab.type"
                       :label="tab.label">
        <span @click="handleTabClick(tab.type)">
          {{ tab.label }}
        </span>
      </el-radio-button>
    </el-radio-group>
  </div>
  <div class="search-contents-users">
    <div class="search-contents-users-item" v-for="user in users"
         :key="user.id">
      <div class="search-contents-users-avatar">
        <img :src=user.avatar class="image" alt="">
      </div>
      <div class="search-contents-users-info">
        <div class="search-contents-users-info-nick">
          {{ user.nick }}
        </div>
        <div class="search-contents-users-info-sign">
          {{ user.sign }}
        </div>
        <div class="search-contents-users-info-fan-count">
          {{ user.fanCount }} 粉丝
        </div>
      </div>
    </div>
  </div>
  <div class="page-list-users">
    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="searchUsers"
        :total="totalUserCount">
    </el-pagination>
  </div>
</div>
</template>

<style scoped lang="less">

.search-contents-users-container{
  display: flex;
  flex-direction: column;
  align-content: center;
  .search-contents-users-tab{
    margin-top: 30px;
    ::v-deep .el-radio-button__inner{
      border: none;
    }
  }
  .search-contents-users{
    display: flex;
    flex-wrap: wrap;
    .search-contents-users-item{
      display: flex;
      flex: 0 0 50%;
      width: 100%;
      max-width: 50%;
      margin-bottom: 60px;
      .search-contents-users-avatar{
        margin-right: 10px;
        img{
          height: 100px;
          width: 100px;
          border-radius: 50%;
        }
      }
      .search-contents-users-info{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .search-contents-users-info-nick{
          font-weight: bolder;
          font-size: 20px;
        }
        .search-contents-users-info-sign{
          font-size: 16px;
          color: gray;
        }
        .search-contents-users-info-fan-count{
          font-size: 16px;
          color: gray;
        }
      }

    }

  }
  .page-list-users{
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}

</style>