<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <text slot="content" class="my-text-color-black text-bold">结佣申请</text>
        </cu-custom>
        <app-commission-info v-if="item" :item="item" />
        <app-loading v-else />

        <view v-if="banks.length > 0">
            <view class="cu-bar bg-white margin-top">
                <view class="action">
                    <text class="text-sm text-gray">佣金将结算到该银行卡</text>
                </view>
            </view>
            <view
                class="flex-row bg-white padding solids-top"
                v-if="bank"
                @click="navTo('/pages/bank/bank?callback=setBank')"
            >
                <view class="flex-1">{{bank.bankName}}</view>
                <view class="flex-2 tex-center">{{hideLen(bank.card)}}</view>
                <view class="flex-1 text-right">
                    <text class="cuIcon-right"></text>
                </view>
            </view>
        </view>
        <view
            v-else
            class="add-btn margin bg-white shadow"
            @click="navTo('/pages/bank/create')"
        >添加银行卡</view>

        <view class="padding margin-top-xl flex-row">
            <button class="cu-btn bg-blue lg flex-1" @click="toApply">提交申请</button>
        </view>

        <app-result v-if="result" :result="result" @ok="onResult" />
    </view>
</template>

<script>
import OrderService from "@/apis/order";
import BankService from "@/apis/bank";
export default {
    data() {
        return {
            id: null,
            item: null,
            banks: [],
            bank: null,
            result: null,
        };
    },
    onLoad(options) {
        this.id = options.id;
    },
    mounted() {
        this.init();
    },
    onShow() {
        this.loadBank();
    },
    methods: {
        init() {
            this.load();
            //this.loadBank();
        },
        load() {
            OrderService.getOrderById(this.id, (res) => {
                if (res.data) {
                    this.item = res.data;
                } else {
                    this.toast("加载信息失败");
                }
            });
        },
        loadBank() {
            BankService.getMe((res) => {
                if (res.data && res.data.data) {
                    this.banks = res.data.data;
                    if (this.bank == null && this.banks.length > 0) {
                        this.bank = this.banks[0];
                    }
                }
            });
        },
        setBank(item) {
            console.log("set bank " , item)
            this.bank = item;
        },
        toApply() {
            if (!this.bank) {
                this.toast("请选择银行卡");
                return;
            }
            this.confirm("您确认要提交结佣申请吗？", (ok) => {
                if (ok) {
                    OrderService.commissionApply(
                        this.item.id,
                        this.bank.id,
                        (res) => {
                            let rs = {};
                            if (res.data && res.data.data) {
                                rs.type = "success";
                                rs.title = "申请成功";
                                rs.text =
                                    "预计到账时间7个工作日内\n请注意接收佣金到账通知";
                            } else {
                                rs.type = "error";
                                rs.title = "提交失败";
                            }
                            this.result = rs;
                        }
                    );
                }
            });
        },
        onResult() {
            if (this.result.type === "success") {
                let pages = getCurrentPages();
                let pre = pages[pages.length - 2];
                pre.$vm.reload();
                this.navBack();
            }
            this.result = null;
        },
    },
};
</script>
<style lang="less" scoped>
.add-btn {
    padding: 40rpx;
    border-radius: 20rpx;
    text-align: center;
    color: #aaa;
    border: 2px dashed #aaa;
}
</style>