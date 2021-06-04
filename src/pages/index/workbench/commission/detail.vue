<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <text slot="content" class="my-text-color-black text-bold">详情</text>
        </cu-custom>
		<!-- <view class="my-bg-color-blue flex align-center text-white text-lg padding-lr" style="height: 144rpx;">
			<image src="@/static/img/commission.png" style="width: 36rpx;height: 36rpx;"></image>
			<text class="margin-left">已结佣</text>
			<view class="" style="margin-left: auto;">
				￥12312.12
			</view>
		</view> -->
		<view class="bg-white padding my-text-color-black" v-if="item">
			<view class="flex align-center">
				<text class="margin-right-sm">{{item.clientName}}</text>
				<image v-if="item.clientSex==0" src="@/static/img/nan.png" mode="" style="width: 36rpx;height: 36rpx;"></image>
				<image v-if="item.clientSex==1" src="@/static/img/nv.png" mode="" style="width: 36rpx;height: 36rpx;"></image>
				<text class="margin-left">{{item.clientPhone}}</text>
			</view>
			<view class="margin-top flex">
				<text class="margin-right">房号</text>
				<text class="">{{item.houseName}} - {{item.room}}</text>
			</view>
		</view>
        <view v-if="item">
            <app-commission-info :item="item" />
            <app-commission-timeline :item="item"/>
            <app-contract-info :item="item" />
        </view>
        <app-loading v-else />

        <view class="cu-tabbar-height" />

        <!-- 按钮 -->
        <view class="flex-row foot bg-white shadow-lg align-center ">
            <button
                class="flex-1 cu-btn bg-blue lg margin-lr margin-bottom radius text-lg"
                @click="toCallManager"
                :disabled="!item || !item.houseManagerPhone"
            >
			<image src="@/static/img/phone.png" class="margin-right" style="width: 32rpx;height: 32rpx;"></image>
			联系项目掌柜</button>
        </view>
    </view>
</template>

<script>
import OrderService from "@/apis/order";

export default {
    data() {
        return {
            id: null,
            item: null,
        };
    },
    onLoad(options) {
        this.id = options.id;
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            OrderService.getOrderById(this.id, (res) => {
                if (res.data) {
                    this.item = res.data;
                    this.loadContractPhotos();
                } else {
                    this.toast("加载信息失败");
                }
            });           
        },
        loadContractPhotos(){
             OrderService.getContractPhotos(this.id, (res) => {
                if (res.data && res.data._embedded) {
                    this.$set(
                        this.item,
                        "contractPhotos",
                        res.data._embedded.medias || []
                    );
                }
            });
        },
        toCallManager() {
            this.callPhone(this.item.houseManagerPhone);
        },
    },
};
</script>