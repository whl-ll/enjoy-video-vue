import httpRequest from "@/axios/axiosConfig";

export default {

    //根据搜索词计算对应科目数量
    async countBySearchTxt(searchTxt){
        let config = {
            params:{searchTxt:searchTxt}
        }
        return await httpRequest.get('/search-counts',config);
    },

}
