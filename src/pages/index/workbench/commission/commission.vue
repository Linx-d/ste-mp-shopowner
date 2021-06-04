<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <text slot="content" class="my-text-color-black text-bold">佣金</text>
        </cu-custom>

        <view class="grid col-3 text-center bg-white padding-top">
            <view
                class="flex-col align-center margin-bottom"
                @click="navTo('/pages/index/workbench/commission/list?status='+item.status)"
                v-for="(item, index) in tabs"
                :key="index"
            >
                <view class="margin-bottom-sm round posr" style="width: 88rpx;height: 88rpx;" >
					<image :src="item.icon" style="width: 100%;height: 100%;"></image>
                        <view class="cu-tag badge" v-if="item.count > 0">{{item.count}}</view>
                </view>
                <view class="text-bold">{{item.title}}</view>
            </view>
        </view>
        <view class="margin-top cu-list menu">
            <view class="cu-item arrow" @click="navTo('/pages/bank/bank')">
                <view class="content">
                    <text class="cuIcon-vipcard my-text-color-black"></text>
                    <text class="my-text-color-black">银行卡</text>
                </view>
            </view>
        </view>
    </view>
</template>
 
<script>
import OrderService from "@/apis/order";
export default {
    data() {
        return {
            tabs: [
                {
                    title: "待结佣",
                    icon: "../../../../static/img/commission1.png",
                    bg: "bg-red",
                    status: 1,
                    count: 0,
                },
                // {
                //     title: "回款中",
                //     icon: "cuIcon-moneybag",
                //     bg: "bg-orange",
                //     status: 2,
                //     count: 0,
                // },
                {
                    title: "可结佣",
                    icon: "../../../../static/img/commission2.png",
                    bg: "bg-yellow",
                    status: 3,
                    count: 0,
                },
                {
                    title: "结佣中",
                    icon: "../../../../static/img/commission1.png",
                    bg: "bg-olive",
                    status: 4,
                    count: 0,
                },
                {
                    title: "已结佣",
                    icon: "../../../../static/img/commission3.png",
                    bg: "bg-green",
                    status: 5,
                    count: 0,
                },
                {
                    title: "结佣异议",
                    icon: "../../../../static/img/commission4.png",
                    bg: "bg-brown",
                    status: -2,
                    count: 0,
                },
            ],
        };
    },
    computed:{
        id(){
            return this.$store.state.user.id;
        }
    },
    mounted() {
        this.init();
    },
    onShow(){
        this.load();
    },
    methods: {
        init() {
            //this.load();
        },
        load() {
            OrderService.getStat(this.id, (res) => {
                if (res.data && res.data.data) {
                    this.setCount(res.data.data);
                }
            });
        },
        setCount(st) {
            let arr = this.tabs;
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                arr[i].count =
                    st[
                        item.status === 1
                            ? "moneyWait"
                            : item.status === 2
                            ? "money"
                            : item.status === 3
                            ? "moneyFinish"
                            : item.status === 4
                            ? "commissionApply"
                            : item.status === 5
                            ? "commissionFinish"
                            : item.status === -2
                            ? "commissionFail"
                            : ""
                    ] || 0;
                
            }
            this.tabs = [...arr];
        },
    },
};
</script>