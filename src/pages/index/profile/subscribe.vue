<template>
    <view>
        <cu-custom bg-color="bg-gradual-blue" :is-back="true">
            <block slot="content">消息订阅</block>
        </cu-custom>

        <view class="cu-list menu margin-top">
            <view class="cu-item">
                <view class="title">报备审核消息</view>
                <switch class="red sm" :checked="audit"></switch>
            </view>
            <view class="cu-item">
                <view class="title">楼盘动态消息</view>
                <switch class="red sm" :checked="house"></switch>
            </view>
        </view>
    </view>
</template>

<script>
import {SUBSCRIB} from '@/common/const'
export default {
    data() {
        return {
            audit:false,
            house:false,
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            uni.getSetting({
                withSubscriptions: true,
                success(res) {
                    console.log(res.authSetting);
                    // res.authSetting = {
                    //   "scope.userInfo": true,
                    //   "scope.userLocation": true
                    // }
                    console.log(res.subscriptionsSetting);
                    // res.subscriptionsSetting = {
                    //   mainSwitch: true, // 订阅消息总开关
                    //   itemSettings: {   // 每一项开关
                    //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
                    //     SYS_MSG_TYPE_RANK: 'accept'
                    //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
                    //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
                    //   }
                    // }
                    if(res.subscriptionsSetting){

                    }
                },
            });
        },
    },
};
</script>