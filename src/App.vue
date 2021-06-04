<script>
import Vue from "vue";
import Service from "apis/service.js";
export default {
    onLaunch: function () {
        console.log("App Launch");
        

        const e = uni.getSystemInfoSync();

        console.log(e);
        Vue.prototype.system = e.system;
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform == "android") {
            Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
            Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif
        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar =
            custom.bottom + custom.top - e.statusBarHeight;
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif

        let { platform } = e;

        // develop = 开发版
        // trial = 体验版
        // release = 正式版

        let serial = __wxConfig.envVersion;
        Vue.prototype.serial = serial;
        console.log("serial : " + serial);
        this.$store.commit("setSerial", serial);

        // let local = true;
        let local = false; 
        // serial = 'release';
        let url,
            oss,
            suffix = "";
        if (serial === "develop" && local) {
            // 开发版
            // url = "http://11.0.0.90:8911"; 
			// url = "http://11.0.0.139:8910/v1";
            url =  "http://11.0.2.101:8910/v1";
            oss = "https://ste-dev.oss-cn-chengdu.aliyuncs.com";
            suffix = "_dev";
        } else if (serial === "release") {
            // 正式版
            url = "https://wzg.jinlutech.cn/api/v1";
            oss = "https://ste.oss-cn-chengdu.aliyuncs.com";
        } else {
            // 体验版
            url = "https://wzg-test.jinlutech.cn/api/v1";
            oss = "https://ste-test.oss-cn-chengdu.aliyuncs.com";
            suffix = "_test";
        }
        console.log("request uri : " + url);
        console.log("request oss : " + oss);
        Service.URI_API = url;
        Service.URI_OSS = oss;
        Service.KEY_SUFFIX = suffix;



        let user = uni.getStorageSync("user"+suffix);
        if (user) {
            this.$store.commit("setUser", user);
        }
        let token = uni.getStorageSync("token"+suffix);
        if (token) {
            this.$store.commit("setToken", token);
        }
    },
    onShow () {
        console.log("App Show");
    },
    onHide () {
        console.log("App Hide");
    },
};
</script>
<style lang="scss">
	@import url("common/my.css");
    @import "uview-ui/index.scss";
</style>