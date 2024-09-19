<script>
import userApi from "@/api/userApi";
import CommonHeader from "@/components/CommonHeader.vue";
import MainPageContent from "@/components/MainPageContent.vue";

export default {
  name: "MainPage",
  components: {MainPageContent, CommonHeader},
  data(){
    return{
      pk:''
    }
  },
  methods:{

    async getRsaPublicKey(){
      let response = await userApi.getRsaPublicKey();
      if(response.data){
        this.pk = response.data;
      }
    },

    async addUser(){
      let params = {
        phone:'3131',
        password:'dada'
      }
      let response = await userApi.addUser(params);
      console.log(response);
    },

    async updateUser(){
      let params = {
        phone:'3131',
        password:'dada'
      }
      let response = await userApi.updateUser(params);
      console.log(response);
    },

    async logout(){
      let response = await userApi.logout();
      console.log(response);
    }
  },
}
</script>

<template>
  <div>
    <CommonHeader/>
    <MainPageContent/>
  </div>
</template>

<style scoped lang="less">

</style>