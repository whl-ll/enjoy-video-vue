import httpRequest from "@/axios/axiosConfig";

export default {

    //查询视频分区
    async getUserCenterVideoAreas () {
        return await httpRequest.get('/user-center-video-areas');
    },

    //分页查询视频列表
    async pageListUserVideos (params) {
        return await httpRequest.get('/user-center-videos', params);
    },

    //分页查询用户收藏
    async pageListUserCenterCollections(params){
        return await httpRequest.get('/user-center-collections', {params});
    },

    //添加用户收藏分组
    async addUserCollectionGroups(params){
        return await httpRequest.post('/user-center-collection-groups', params);
    },

    //分页查询用户关注
    async pageListUserCenterFollowings (params) {
        return await httpRequest.get('/user-center-followings', {params});
    },

    //分页查询用户粉丝
    async pageListUserFans (params) {
        return await httpRequest.get('/user-center-fans', {params});
    },

    //计算用户粉丝总数
    async countUserFans(){
        return await httpRequest.get('/user-center-fan-counts');
    },

    //添加用户关注
    async addUserFollowing(followingId){
        let params = {
            followingId:followingId
        }
        return await httpRequest.post('/user-followings', params);
    },

    //取消关注
    async deleteUserFollowing(followingId) {
        let params = {
            followingId:followingId
        }
        return await httpRequest.delete('/user-followings', {params});
    },

    //更新用户关注
    async updateUserFollowing(params){
        return await httpRequest.put('/user-followings', params);
    },

    //添加用户关注分组
    async addUserFollowingGroups (params) {
        return await httpRequest.post('/user-following-groups', params);
    },

    //获取用户关注分组
    async getUserCenterFollowingGroups () {
        return await httpRequest.get('/user-center-following-groups');
    }


}
