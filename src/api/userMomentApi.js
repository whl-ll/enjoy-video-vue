import httpRequest from "@/axios/axiosConfig";

export default {

    // 分页查询用户动态
    async pageListMoments(params){
        return await httpRequest.get('/moments', {params});
    },

    //添加用户动态内容
    async addUserMomentContents(params){
        return await httpRequest.post('/contents', params);
    },

    //添加用户动态
    async addUserMoments (params) {
        return await httpRequest.post('/user-moments', params);
    },

}
