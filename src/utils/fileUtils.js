import SparkMD5 from "spark-md5";
import videoApi from "@/api/videoApi";


export default {

    methods: {

        async uploadFileBySlices(selectedFile){
            if(!selectedFile){
                window.alert('没有选择文件');
                return;
            }
            //计算视频md5
            const fileMd5 = await this.calculateVideoMD5(selectedFile);
            const fileName = selectedFile.name;
            let sliceName = fileName.split(".")[0];
            let sliceType = fileName.split(".")[1];
            const sliceSize = 2 * 1024 * 1024; //分片大小：2MB
            const totalSliceNo = Math.ceil(selectedFile.size / sliceSize);
            const uploadSlice = (sliceIndex) =>{
                const start = sliceIndex * sliceSize;
                const end = Math.min(start+sliceSize, selectedFile.size);
                let slice = selectedFile.slice(start, end);
                return new Promise((resolve)=>{
                    slice = new File([slice], sliceName+sliceIndex+"."+sliceType);
                    const formData = new FormData();
                    formData.append('fileMd5', fileMd5);
                    formData.append('sliceNo', sliceIndex+1);
                    formData.append('totalSliceNo',totalSliceNo);
                    formData.append('slice', slice);
                    videoApi.uploadFileBySlices(formData).then((response)=>{
                        sliceIndex++;
                        this.uploadProgress = (sliceIndex/totalSliceNo * 100).toFixed(1);
                        if(sliceIndex === totalSliceNo){
                            resolve(response);
                        }else{
                            uploadSlice(sliceIndex).then(resolve);
                        }
                    })
                })
            };
            return await uploadSlice(0);
        },

        //计算文件md5值
        async calculateVideoMD5(file) {
            return new Promise((resolve, reject) => {
                const blobSlice = File.prototype.slice;
                const chunkSize = 2097152; // 2 MB chunks (you can adjust this value)
                const fileReader = new FileReader();
                const spark = new SparkMD5.ArrayBuffer();
                let currentChunk = 0;
                const totalChunks = Math.ceil(file.size / chunkSize);
                fileReader.onload = (e) => {
                    spark.append(e.target.result);
                    currentChunk++;
                    if (currentChunk < totalChunks) {
                        loadNextChunk();
                    } else {
                        const md5 = spark.end(false);
                        resolve(md5);
                    }
                };
                fileReader.onerror = (e) => {
                    reject(e);
                };
                function loadNextChunk() {
                    const start = currentChunk * chunkSize;
                    const end = Math.min(start + chunkSize, file.size);
                    const chunk = blobSlice.call(file, start, end);
                    fileReader.readAsArrayBuffer(chunk);
                }
                loadNextChunk();
            });
        },

        convertBase64ToPngFile(base64String) {
            const blob = this.base64ToBlob(base64String);
            // 创建一个新的 File 对象，类型为 'image/png'
            const pngFile = new File([blob],
                'image.png', { type: 'image/png' });
            console.log('png', pngFile);
            return pngFile;
        },

        base64ToBlob(base64String) {
            const byteString = atob(base64String.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: 'image/png' });
        },

    }

}