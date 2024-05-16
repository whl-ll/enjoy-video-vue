import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from "@/components/UserLogin.vue";
import MainPage from "@/components/MainPage.vue";
import MySpaceHome from "@/components/mySpace/MySpaceHome.vue";
import MySpacePost from "@/components/mySpace/MySpacePost.vue";
import PostContent from "@/components/PostContent.vue";
import VideoDetail from "@/components/VideoDetail.vue";
import MySpaceContent from "@/components/mySpace/MySpaceContent.vue";
import MySpaceInfo from "@/components/mySpace/MySpaceInfo.vue";
import MySpaceCollection from "@/components/mySpace/MySpaceCollection.vue";
import MySpaceFollowing from "@/components/mySpace/MySpaceFollowing.vue";
import UserMoments from "@/components/UserMoments.vue";
import UserHistory from "@/components/UserHistory.vue";
import SearchContents from "@/components/search/SearchContents.vue";

Vue.use(VueRouter)

const routes = [
    {
        // 首页
        path:'/',
        component:MainPage,
    },
    {
        // 注册登录页
        path:'/userLogin',
        component:UserLogin
    },
    {
        // 个人中心
        path:'/mySpace',
        redirect:'/mySpace/home',
        component:MySpaceContent,
        children:[
            {
                // 个人中心-首页
                path: 'home',
                component: MySpaceHome
            },
            {
                // 个人中心-我的投稿
                path: 'post',
                component: MySpacePost
            },
            {
                // 个人中心-个人信息
                path: 'info',
                component: MySpaceInfo
            },
            {
                // 个人中心-我的收藏
                path: 'collection',
                component: MySpaceCollection
            },
            {
                // 个人中心-我的关注
                path: 'following',
                component: MySpaceFollowing
            },
        ]
    },
    {
        // 视频投稿
        path:'/postContent',
        component:PostContent,
    },
    {
        // 视频详情
        path:'/videoDetail',
        component:VideoDetail,
    },
    {
        // 用户动态
        path:'/userMoments',
        component:UserMoments,
    },
    {
        // 用户历史
        path:'/userHistory',
        component:UserHistory,
    },
    {
        //搜索
        path: '/searchContents',
        component: SearchContents
    },
]

const router = new VueRouter({
    routes
})

export default router