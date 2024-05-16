import httpRequest from "@/axios/axiosConfig";

export default {

    async getDanmus(videoId, startTime, endTime){
        let params = {
            params:{
                videoId:videoId,
                startTime:startTime,
                endTime:endTime
            }
        };
        return await httpRequest.get('danmus', params);
    }

}