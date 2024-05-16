import httpRequest from "@/axios/axiosConfig";

export default {

    /**
     * 获取RSA公钥
     */
    async getRsaPublicKey(){
        return await httpRequest.get('/rsa-pks');
    },

    /**
     * 注册用户
     */
    async addUser(params){
        return await httpRequest.post('/users',params);
    },

    /**
     * 用户登录（单token）
     */
    async getUserToken(params){
        return await httpRequest.post('user-tokens', params);
    },

    /**
     * 用户登录（双token）
     */
    async getUserTokenAndRefreshToken(params){
        return await httpRequest.post('user-dts', params);
    },

    /**
     * 获取用户基本信息
     */
    async getUserBasicInfo(){
        return await httpRequest.get('/users');
    },


    /**
     * 更新用户
     */
    async updateUser(params){
        return await httpRequest.put('/users',params);
    },

    /**
     * 退出登录
     */
    async logout(){
        return await httpRequest.delete('/refresh-tokens');
    },

    //添加用户关注
    async addUserFollowings(params){
        return await httpRequest.post('/user-followings', params);
    },

    //获取用户关注
    async getUserFollowings(){
        return await httpRequest.get('/user-followings');
    },

    //更新用户基本信息
    async updateUserInfo(params){
        return await httpRequest.put('/user-infos',params);
    },

    //使用elasticsearch分页查询用户列表
    async pageListUsersByEs(params) {
        return await httpRequest.get('/search-users', {params});
    }
}