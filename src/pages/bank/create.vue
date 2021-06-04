<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <text slot="content" class="my-text-color-black text-bold">添加银行卡</text>
        </cu-custom>
        <form>
            <view class="cu-form-group">
                <view class="title">姓名</view>
                <input class="text-right" placeholder="请输入姓名" v-model="payload.name" />
            </view>
            <view class="cu-form-group">
                <view class="title">银行卡号</view>
                <input class="text-right" placeholder="请输入储蓄卡卡号" type="digit" v-model="payload.card" />
            </view>
            <view class="cu-form-group">
                <view class="title">身份号</view>
                <input class="text-right" placeholder="请输入身份证号" type="idcard" v-model="payload.idnum" />
            </view>
        </form>

        <view class="flex-row margin-top padding">
            <button class="cu-btn lg my-bg-color-blue flex-1 text-white" @click="toSave">添加</button>
        </view>
    </view>
</template>

<script>
import BankService from "@/apis/bank";
export default {
    data() {
        return {
            payload: {},
        };
    },
    methods: {
        toSave() {
            let { name, card, idnum } = this.payload;

            if (!card) {
                this.toast("请输入账号");
                return;
            }
            if (!name) {
                this.toast("请输入账户姓名");
                return;
            }
            if (!idnum) {
                this.toast("请输入账户身份证号");
                return;
            }

            this.confirm("您确定要保存银行卡信息吗？", (ok) => {
                if (ok) {
                    this.showLoading(()=>{
                        BankService.save(this.payload,(res) => {
                            this.hideLoading();
                            if (res.data && res.data.data) {
                                this.toast("保存成功", "success", () => {
                                    // let pages = getCurrentPages();
                                    // let pre = pages[pages.length - 2];
                                    // pre.$vm.load();
                                    this.navBack();
                                });
                            } else {
                                //this.toast("保存失败", "error");
                                let err = '保存银行卡信息失败';
                                this.toast(res.data ? (res.data.message || err) : err);
                            }
                        });
                    });
                }
            });
        },
    },
};
</script>