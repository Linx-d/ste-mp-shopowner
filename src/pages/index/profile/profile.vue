<template>
    <view>
		<cu-custom >
		    <block slot="content" class="my-text-color-black text-bold">我的</block>
		</cu-custom>
        <view class=" bgUrl nav" v-if="user">
			<image src="@/static/img/myHeadBg.svg" class="bgImg"></image>
          <view class="flex padding align-center bghead">
                <app-user-avatar :user="user" />
                <view class="margin-left flex-col flex-1">
                    <view class="flex align-center">
                        <text class="text-lg text-bold margin-right-sm">{{ user.wx.nickName }}</text>
						<image v-if="user.sex==0" src="@/static/img/nan.png" style="width: 36rpx;height: 36rpx;"></image>
						<image v-else src="@/static/img/nv.png" style="width: 36rpx;height: 36rpx;"></image>
                    </view>
                    <view class="text-gray text-sm margin-top-sm">
                        {{ user.phone }}
                    </view>
                </view>
            </view>
        </view>
		
			<!-- <view class="margin-top text-grey flex-row text-center bg-white radius margin-lr padding" style="margin-top: 300rpx;" >
				<view class="flex-1" @click="toReport(100)">
					<view class="text-bold text-lg text-black">{{statistics.report}}</view>
					<view class="margin-top-sm">有效报备</view>
				</view>
				<view class="flex-1"  @click="toReport(9)">
					<view class="text-bold text-lg text-black">{{statistics.arrive}}</view>
					<view class="margin-top-sm">到访客户</view>
				</view>
				<view class="flex-1" @click="toContract">
					<view class="text-bold text-lg text-black">{{statistics.order}}</view>
					<view class="margin-top-sm">等待签约</view>
				</view>
			</view> -->
		
        <view class="cu-list menu margin-top margin-lr radius" style="margin-top: 300rpx;">
            <view class="cu-item arrow " @click="navTo('/pages/index/workbench/calculators/index')">
                <view class="content">
                    <image src="@/static/img/my1.svg" style="width: 36rpx;height: 36rpx;"></image>
                    <text class="my-text-color-black margin-left-sm">房贷计算器</text>
                </view>
            </view>
			<!-- <view class="cu-item arrow" @click="showPhone">
			    <view class="content">
			        <image src="@/static/img/myPhone.svg" style="width: 36rpx;height: 36rpx;"></image>
			        <text class="my-text-color-black margin-left-sm">更改手机号</text>
			    </view>
			</view> -->
			<!-- <view class="cu-item arrow" @click="showQrCode">
			    <view class="content">
			        <image src="@/static/img/my2.svg" style="width: 36rpx;height: 36rpx;"></image>
			        <text class="my-text-color-black margin-left-sm">门店邀请码</text>
			    </view>
			</view> -->
			<view class="cu-item arrow" @click="invitation()">
			    <view class="content">
			        <image src="@/static/img/my6.svg" style="width: 36rpx;height: 36rpx;"></image>
			        <text class="my-text-color-black margin-left-sm">邀请函</text>
			    </view>
			</view>
			<view class="cu-item arrow" @click="clearCache">
					<view class="content">
							<image src="@/static/img/my3.svg" style="width: 36rpx;height: 36rpx;"></image>
							<text class="my-text-color-black margin-left-sm">清理缓存</text>
					</view>
			</view>
		</view>
		
		<!-- 邀请码弹框 -->
		<app-modal />

		<qr-code ref="QrCode" />
		<shop-phone ref="ShopPhone" />
    </view>
</template>

<script>
import UserService from "@/apis/user";
import { DEFAULT_COVER } from "@/common/const";
// import img from '@/static/img/myHeadBg.svg'
import ReportService from "@/apis/report";

import QrCode from './Profile/QrCode'
import ShopPhone from './Profile/ShopPhone'
export default {
    data() {
        return {
            DEFAULT_COVER,
			statistics:{},
            modalName: null
        };
    },
    components: {
        QrCode,
		ShopPhone
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
		shop() {
			return this.$store.state.shop
		}
    },
	created() {
	},
    mounted() {
        this.init();
    },
    methods: {
        init() {
           this.pullDownRefresh();
        },
		pullDownRefresh(){
			let data={
				brokerId:this.user.id,
				endTime:this.formatTime()
			}
			ReportService.dashboardNoRepeat(data,res=>{
				if(res.data.success){
					this.statistics=res.data.data
				}
				uni.stopPullDownRefresh();
			})
		},
		getBrokerInfo() {
				this.navTo(`/pages/index/profile/detail`);
		},
		clearCache() {
				this.confirm("您确定要清除缓存信息吗？", (ok) => {
						if (ok) {
								uni.clearStorageSync();
								uni.reLaunch({
										url: "/pages/root/root",
								});
						}
				});
		},
		toReport(st) {
			this.navTo('/pages/index/workbench/report/report' + (st !== undefined ? '?status=' + st : ''));
		},
		invitation() {
			this.navTo('/pages/index/profile/invitation')
		},
		toContract() {
			this.navTo('/pages/index/workbench/contract/contract');
		},
        showQrCode() {
            this.$refs.QrCode.showModal()
        },
		showPhone() {
			this.$refs.ShopPhone.showModal()
		}
    },
};
</script>
<style lang="less">
	.bgUrl{
		width: 100%;
		height: 416rpx;
		top: 0rpx;
		position: fixed;
		z-index: 1024;
		
		// background-image:url(@/static/img/myHeadBg.svg);
		background-size: 100% 100%;
		.bgImg{
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0rpx;
			top: 0rpx;
		}
		.bghead{
			width: 100%;
			position: absolute;
			margin-top: 200upx;
		}
	}
</style>

