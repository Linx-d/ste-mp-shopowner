<template>
	<view class="container">
		<cu-custom bg-color="bg-white" :is-back="true">
			<block slot="content" class="my-text-color-black text-bold">客户详情</block>
		</cu-custom>

		<view class="flex align-center padding bg-white solids-bottom">

			<view class="cu-avatar round lg" :class="client.sex==0?'bg-blue':'bg-red'">
				<text class="avatar-text" style="font-size: 40upx;">{{client?client.name.substring(0,1):''}}</text></view>
			<view class="text-bold text-lg margin-left margin-right-sm">
				{{client?client.name:''}}
			</view>
			<image v-if="client.sex==0" src="@/static/img/nan.png" style="width: 36rpx;height: 36rpx;"></image>
			<image v-else-if="client.sex==1" src="@/static/img/nv.png" style="width: 36rpx;height: 36rpx;"></image>
			<image class="margin-right"  @click="target" src="@/static/img/client2.png" style="width: 32rpx;height: 32rpx; margin-left: auto;"></image>
		</view>
		<view class="bg-white flex padding align-center justify-between" v-for="(item,index) in phoneList" :key="index">
			<view class="text-black flex text-lg">
				<view class="text-cut">{{ item || ''}}</view>
			</view>
			<view class="action" v-if="item" @click="callPhone(item)">
				<image src="@/static/img/client1.png" style="width: 80rpx;height: 80rpx;"></image>
			</view>
		</view>

		<!-- 电话 -->

		<!-- 购房需求 -->
		<app-info-card title="购房需求" :infos="demand" :intention="client.intention" />

		<!-- 基本信息 -->
		<app-info-card title="基本信息" :infos="base" />

		<!-- 时间线 -->
		<view class="margin-top bg-white padding-bottom" style="margin-bottom: 130upx;">
			<view class="text-bold text-lg padding">信息跟踪</view>
			<view class="cu-timeline margin-top">
				<view class="cu-item">
					<view class="content bg-white text-sm">
						<view class="cu-tag my-text-color-blue">{{client.createTime||''}}</view>
						<view class="margin-top">录入客户信息</view>
					</view>
				</view>
			</view>
		</view>


		<!-- 报备 -->
		<view class="padding-sm" style="position: fixed;bottom: 0upx;left: 0upx;width: 100%;">
			<button class="cu-btn bg-blue lg" style="width: 100%;" @click="report">报备</button>
		</view>

		<!-- 邀请码弹框 -->
		<app-modal :show="modalShow" @hideModal="hideModal"></app-modal>
		<!-- 排名 -->
		<!-- <view class="margin-top padding bg-white">
            <view class="text-lg text-bold">客户关注楼盘排名TOP5</view>
            
            <view class="flex-row margin-top text-center">
                <view class="flex-1">楼盘名称</view>
                <view class="flex-1">停留时间</view>
                <view class="flex-1">浏览次数</view>
            </view>
            <view  v-for="item in topList" :key="item">
                <view class="flex-row margin-top-xs text-center">
                    <view class="flex-1 ">{{ item.houseName }}</view>
                    <view class="flex-1 ">{{ item.time }}m</view>
                    <view class="flex-1 ">{{ item.count }}</view>
                </view>
            </view>
        </view> -->
	</view>
</template>

<script>
	import ClientService from "@/apis/client";

	export default {
		data() {
			return {
				modalShow: false,
				client: null,
				clientId: "",
				topList: [],
				demand: [],
				base: [],
				phoneList: []
			};
		},
		onLoad(options) {
			this.clientId = options.clientId;
		},
		mounted() {

		},
		onShow() {
			this.init();
		},
		methods: {
			init() {
				ClientService.byId(this.clientId, (res) => {
					this.client = res.data;
					this.phoneList = res.data.phone.split(',');
					this.parseInfo();
				});
			},
			parseInfo() {
				let demand = [];
				let base = [];
				if (this.client) {
					let {
						sex,
						// idcard,
						birthday,
						birthplace,
						nation,
						education,
						areaStart,
						areaEnd,
						propertyType,
						acceptPriceEnd,
						room,
						family,
						people,
						reason,
						car,
						address
					} = this.client;
					demand.push({
						title: "需求面积",
						value: areaStart ? areaStart + '--' + areaEnd : "-"
					});
					demand.push({
						title: "需求业态",
						value: propertyType ? propertyType : "-"
					});
					demand.push({
						title: "接受总价",
						value: acceptPriceEnd ? acceptPriceEnd + '万' : "-"
					});
					demand.push({
						title: "户型",
						value: room ? room : "-"
					});


					base.push({
						title: "性别",
						value: sex === 1 ? "女" : "男"
					});
					base.push({
						title: "家庭结构",
						value: family ? family : "-"
					});
					base.push({
						title: "居住人口",
						value: people ? people : "-"
					});
					base.push({
						title: "购买目的",
						value: reason ? reason : "-"
					});
					base.push({
						title: "有无私家车",
						value: car ? '有' : "无"
					});
					base.push({
						title: "现居地址",
						value: address ? address : "-"
					});
					base.push({
						title: "生日",
						value: birthday ? birthday.split(" ")[0] : "-",
					});
					base.push({
						title: "籍贯",
						value: birthplace
					});
					base.push({
						title: "名族",
						value: nation
					});
					base.push({
						title: "教育程度",
						value: education
					});
				}
				this.demand = demand;
				this.base = base;
			},
			target() {
				uni.setStorageSync('clients', this.client)
				this.navTo('/pages/index/client/add?type=update')
			},
			// 关闭邀请码弹框
			hideModal() {
				this.modalShow = false
			},
			report() {
				// 判断是否有邀请码或入驻
				this.byIdCheckBroker(this.user.id, res => {
					if (res.data == false) {
						this.modalShow = true;
						return
					} else {
						uni.setStorageSync('clients', this.client)
						this.navTo(`/pages/report/report`);
					}
				});
			}
		},
		computed: {
			user() {
				return this.$store.state.user
			}
		}
	};
</script>
