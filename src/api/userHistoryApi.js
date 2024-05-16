import httpRequest from "@/axios/axiosConfig";

export default {

    // 分页查询历史
    async pagListUserVideoHistory(params){
        return await httpRequest.get('/user-video-histories', {params});
    }

}
