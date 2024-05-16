import userApi from "@/api/userApi";
import JSEncrypt from 'jsencrypt';

//判断是否使用刷新令牌
export const usingRefreshToken = false;
export default {
    data() {
        return {
            defaultAvatar:require('@/assets/defaultAvatar.png'),
        };
    },
    methods: {

        //用户密码rsa加密
        encryptPassword(password, publicKey) {
            const encryptStr = new JSEncrypt();
            encryptStr.setPublicKey(publicKey.toString()); // 设置加密公钥
            return encryptStr.encrypt(password); // 进行加密
        },

        //用户注册
        async userRegister(account, password){
            let response = await userApi.getRsaPublicKey();
            //ES6 解构语句
            const {data:rsaPk} = response;
            let encryptPwd = this.encryptPassword(password, rsaPk);
            const params = {
                phone: account,
                password: encryptPwd
            }
            response = await userApi.addUser(params);
        },

        //用户登录
        async userLogin(account, password) {
            try {
                let response = await userApi.getRsaPublicKey();
                //ES6 解构语句
                const {data:rsaPk} = response;
                let encryptPwd = this.encryptPassword(password, rsaPk);
                const params = {
                    phone: account,
                    password: encryptPwd
                }
                let token = null;
                if(usingRefreshToken){
                    response = await userApi.getUserTokenAndRefreshToken(params);
                    const {data:map} = response;
                    const {accessToken:accessToken, refreshToken:refreshToken} = map;
                    token = accessToken;
                    localStorage.setItem('refreshToken', refreshToken);
                }else{
                    response = await userApi.getUserToken(params);
                    const {data:accessToken} = response;
                    token = accessToken;
                }
                if (token && token !== 'null') {
                    localStorage.setItem('token', token);
                }
            }catch (error){
                window.alert('登录失败')
            }
        },

        //查询用户基本信息
        async getUserBasicInfo(){
            //查询用户基本信息
            let response = await userApi.getUserBasicInfo();
            if(response.data){
                return response.data.userInfo;
            }
        },

        //退出登录
        logout() {
            localStorage.removeItem('token');
            location.reload(); //刷新页面
        },

    },

    computed: {
        //判断用户是否登录
        isUserLoggedIn() {
            let token = localStorage.getItem('token');
            return token && token !== 'null';
        }

    }
}