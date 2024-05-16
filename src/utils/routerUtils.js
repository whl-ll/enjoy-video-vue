
export default {

    methods: {

        async jumpToPath(path){
            if (this.$route.path !== path) {
                await this.$router.push(path);
            }else{
                location.reload(); //刷新页面
            }
        },

        //跳转视频详情页
        jumpToVideoDetail(videoId){
            if(videoId){
                this.$router.push({
                    path: '/videoDetail',
                    //把当前视频的信息通过vue router传递给下一个路由对应的组件
                    query: {
                        videoId: videoId
                    }
                });
            }else{
                this.$router.push('/videoDetail')
            }
        },

    }

}