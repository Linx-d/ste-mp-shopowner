<template>
    <view>
        <cu-custom bg-color="bg-gradual-blue">
            <view slot="content">注册登录</view>
        </cu-custom>
        <!-- 进度条 -->
        <view class="bg-white padding">
            <view class="cu-steps">
                <view :class="step >= 0 ? 'cu-item text-blue' : 'cu-item'">
                    <text class="num" data-index="1"></text>邀请码
                </view>
                <view :class="step >= 1 ? 'cu-item text-blue' : 'cu-item'">
                    <text class="num" data-index="2"></text>绑定微信
                </view>
                <!-- <view :class="step >= 2 ? 'cu-item text-blue' : 'cu-item'">
                    <text class="num" data-index="3"></text>完善信息
                </view>-->
            </view>
        </view>
        <!-- 邀请码-->
        <view v-if="step === 0" class="margin-top">
            <view class="text-center">
                <view
                    class="margin-bottom padding-left-xl padding-right-xl text-gray"
                >《屋掌柜》当前使用邀请注册制</view>
                <view class="padding-left-xl padding-right-xl">
                    <input
                        type="digit"
                        :maxlength="6"
                        v-model="inviteCode"
                        placeholder="请输入邀请码"
                        class="input solids bg-white text-center"
                    />
                </view>
                <view class="text-center text-red margin-top-sm" v-if="error">{{error}}</view>
            </view>
            <view class="margin-top-xl padding-left-xl padding-right-xl flex flex-direction">
                <button class="cu-btn bg-blue lg" @click="toVerifyCode">继续</button>
            </view>
        </view>
        <view v-else-if="step === 1" class="margin-top">
            <view class="padding-left-xl padding-right-xl">
                <view class="cu-list menu-avatar" v-if="me.avatarUrl">
                    <view class="cu-item">
                        <view class="cu-avatar round lg" :style="meAvatar"></view>
                        <view class="content flex-sub">
                            <view class="text-grey">{{me.nickName}}</view>
                            <view
                                class="text-gray text-sm flex justify-between"
                            >{{me.province}} {{me.city}}</view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="margin-top-xl padding-left-xl padding-right-xl flex flex-direction">
                <button
                    class="cu-btn bg-blue lg"
                    @getphonenumber="onPhoneNumber"
                    open-type="getPhoneNumber"
                >继续</button>
            </view>
        </view>
        <view v-else-if="step === 2" class="margin-top padding-bottom-xl">
            <app-user-form :item="{name:me.nickName}" @change="formChange" />

            <view class="margin-top-xl margin-bottom-xl padding-left-xl padding-right-xl flex-row">
                <button class="cu-btn line-bg lg margin-right flex-1" @click="toSave">跳过</button>
                <button class="cu-btn bg-blue lg flex-1" @click="toSave">完成</button>
            </view>
        </view>
    </view>
</template>

<script>
import UserService from "apis/user.js";
export default {
    data() {
        return {
            step: 0,
            inviteCode: null,
            phone: null,

            payload: null,
            error: null,
        };
    },
    computed: {
        me() {
            return this.$store.state.me;
        },
        meAvatar() {
            return this.me && this.me.avatarUrl
                ? `background-image:url(${this.me.avatarUrl});`
                : null;
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {},
        toVerifyCode() {
            if (!this.inviteCode) {
                let msg = "请输入邀请码";
                this.toast(msg);
                this.error = msg;
                return;
            } else if (this.inviteCode.length < 6) {
                let msg = "邀请码格式不正确";
                this.toast(msg);
                this.error = msg;
                return;
            }

            this.showLoading(() => {
                UserService.checkInviteCode(this.inviteCode, (res) => {
                    this.hideLoading();
                    if (res.data.success) {
                        // 后续绑定需要用到
                        this.step = 1;
                        // this.fetchUserInfo();
                    } else {
                        let msg = res.data.message || "邀请码无效";
                        this.toast(msg);
                        this.error = msg;
                    }
                });
            });
        },
        onPhoneNumber(e) {
            let { encryptedData, iv } = e.detail;

            let sessionKey = this.me.sessionKey;
			console.log(e.detail);
            if (sessionKey) {
                this.decryptPhone(sessionKey, encryptedData, iv);
            } else {
                this.showLoading(() => {
                    this.wexinLogin((res) => {
                        this.hideLoading();
                        if (res) {
                            sessionKey = me.sessionKey;
                            this.decryptPhone(sessionKey, encryptedData, iv);
                        } else {
                            this.toast("获取失败", "error");
                        }
                    });
                });
            }
        },
        decryptPhone(key, raw, iv) {
            this.showLoading(() => {
                UserService.decryptPhone(key, raw, iv, (res) => {
                    this.hideLoading();
                    if (res.data.success) {
                        let { phoneNumber } = res.data.data;
                        this.phone = phoneNumber;
                        // this.step = 2;
                        // TODO: 不做完善
                        this.toSave();
                    } else {
                        this.toast("获取失败", "error");
                    }
                });
            });
        },

        formChange(item) {
            this.payload = item;
        },
        toSave() {
            let { phone, inviteCode } = this;
            let { nickName, openId } = this.me;
            let data = {
                name: nickName,
                phone,
                inviteCode,
                wx: {
                    openId,
                },

                ...this.payload,
            };

            this.saveUser(data, openId);
        },
        saveUser(data, openId) {
            this.showLoading(() => {
                UserService.registerBroker(data, (res) => {
                    this.hideLoading();
                    if (res.data && res.data.success) {
                        let user = res.data.data;
                        this.$store.commit("setUser", user);
                        this.showHome(openId);
                    } else {
                        this.toast("注册失败", "error");
                    }
                });
            });
        },
        showHome(openId) {
            UserService.getTokenByOpenId(openId, (res) => {
                this.hideLoading();
                if (res.data && res.data.data) {
                    let token = res.data.data.token;
                    this.$store.commit("setToken", token);
                    this.toast("注册成功", "success");

                    setTimeout(() => {
                        this.navTo("/pages/index/index");
                    }, 100);
                } else {
                    this.tost("授权出错", "error");
                }
            });
        },
    },
};
</script>
<style scoped>
.input {
    padding: 32rpx;

    height: 120rpx;
    line-height: 120rpx;

    font-size: 48rpx;
}
</style>