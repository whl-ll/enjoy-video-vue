<script>
import CommonHeader from "@/components/CommonHeader.vue";
import SearchVideo from "@/components/search/SearchVideo.vue";
import SearchUser from "@/components/search/SearchUser.vue";
import searchApi from "@/api/searchApi";

export default {
  name: "SearchContents",
  components: {SearchVideo, SearchUser, CommonHeader},
  data(){
    return {
      activeIndex:'1',
      menuList:[
        {
          name:'视频',
          tab:'SearchVideo',
          index:'1',
          count:0
        },
        {
          name:'用户',
          tab:'SearchUser',
          index:'2',
          count:0
        }
      ],
      currentTab:'SearchVideo',
      searchTxt:''
    }
  },
  methods:{
    async countBySearchTxt(){
      const response = await searchApi.countBySearchTxt(this.searchTxt);
      if(response && response.data){
        const {videoCount:videoCount, userCount:userCount} = response.data;
        this.menuList[0].count = videoCount;
        this.menuList[1].count = userCount;
      }
      console.log(this.menuList)
    }

  },

  mounted() {
    this.searchTxt = this.$route.query.searchTxt;
    this.countBySearchTxt();
  }

}
</script>

<template>
  <div>
    <CommonHeader/>
    <div class="search-contents-container">
      <el-menu :default-active="activeIndex" class="search-contents-nav-menu"
               mode="horizontal">
        <el-menu-item class="search-contents-nav-menu-item"
                      v-for="item in menuList" :index="item.index"
                      :key="menuList.indexOf(item)"
                      @click="currentTab = item.tab">
          <div class="search-contents-nav-menu-item-txt">
            {{item.name}}
          </div>
          <div class="search-contents-nav-menu-item-count">
            {{item.count > 99 ? '99+' : item.count}}
          </div>
        </el-menu-item>
      </el-menu>
      <component :is="currentTab"></component>
    </div>
  </div>

</template>

<style scoped lang="less">

.search-contents-container{
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 20px;
  .search-contents-nav-menu{
    .search-contents-nav-menu-item{
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      .search-contents-nav-menu-item-txt{
        margin-right: 5px;
      }
      .search-contents-nav-menu-item-count{
        color: darkgray;
        background-color: #f3f0f0;
        border-radius: 10px;
        width: 40px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

}

</style>