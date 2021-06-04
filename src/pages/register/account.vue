<template>
    <view v-if="visible">
        <button @click="showModal" class="cu-btn reg-btn lg  bg-blue shadow account" lang="zh_CN">
			账号密码登录
		</button>
        <view class="cu-modal" :class="modalName=='login'?'show':''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white">
                    <view class="content">登录</view>
                    <view class="action" @click="hideModal">
                        <text class="cuIcon-close text-red"></text>
                    </view>
                </view>
                <view class="padding-xl">
                    <form>
                        <view class="cu-form-group">
                            <input placeholder="请输入11位手机号" v-model="username" name="input" maxlength="11" />
                        </view>
                        <view class="cu-form-group margin-top">
                            <input placeholder="请输入6位密码" v-model="password" name="input" maxlength="6" />
                        </view>
                    </form>
                </view>
                <view class="cu-bar bg-white justify-end">
                    <view class="action">
                        <button class="cu-btn line-green text-green" @click="hideModal">取消</button>
                        <button class="cu-btn bg-green margin-left" @click="handleOk">确定</button>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import Service from '@/apis/service'
export default {
    data() {
        return {
            queryParam: {},
            modalName: null
        }
    },
    computed: {
        visible() {
            const serial = this.$store.state.serial
            if (serial === 'trial') {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        showModal() {
            this.modalName = 'login'
        },
        hideModal() {
            this.modalName = null
            this.username = ''
            this.password = ''
        },
        handleOk() {
            let { username, password } = this
            if(username ==='19922297443' && password === '297443') {
                this.modalName = null
                this.$emit('accountLogin')
            } else {
                this.toast('请输入正确的账号密码')
            }
        }
    }    
}
</script>

<style lang="less" scoped>
    .account {
        border-radius: 100rpx;
        width: 85%;
        margin-top: 5px;
    }
</style>