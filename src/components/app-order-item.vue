<template>
	<view class="bg-white margin-left margin-right shadow margin-bottom flex-col radius" v-if="item" @click.stop="toDetail">
		<view class="flex  padding-lr padding-top-sm padding-bottom-sm solids-bottom text-black text-bold">
			<view class="flex-1">单号：{{item.id}}</view>
			<view class="cu-tag my-text-color-blue" style="background-color: #E6F0FC;" v-if="item.status === 0">
				已认购{{fixedDays > 1 ? fixedDays : 1}}天
			</view>
			<view class="cu-tag" style="background-color: #FFEDED;color: #FA5151;" v-if="item.status === 1">
				签约成功
			</view>
			<view class="cu-tag" v-if="item.status === -1">
				已退房
			</view>
		</view>
		<view class="flex-row margin-top margin-bottom padding-lr">
			<view class="flex-1 flex-col">
				<view class="flex-row">
					<view class=" text-bold text-lg text-black">{{item.houseName}}</view>
					
					<view class="cu-tag margin-left-sm  bg-green radius" v-if="item.housePropertyType">{{ item.housePropertyType}}</view>
				</view>
				<view class="text-gray margin-top-sm">{{item.room}}</view>
				
				<view class="text-bold margin-top-sm flex align-center">{{item.clientName}}
				 <image v-if="item.clientSex==0" src="@/static/img/nan.png" style="width: 36rpx;height: 36rpx;margin-left: 10rpx;" mode=""></image>
				 <image v-else src="@/static/img/nv.png" style="width: 36rpx;height: 36rpx;margin-left: 10rpx;" mode=""></image>
				 <text class="text-light margin-left-sm">{{item.clientPhone}}</text>
				</view>
				<view class="text-gray margin-top-sm">
					认购时间：{{this.timeText(item.createTime)}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => null
			},
		},
		computed: {
			fixedDays() {
				let rs = 0;
				if (this.item) {
					let time = new Date(this.item.createTime.replace(/-/g, '/'));

					let left = new Date().getTime() - time.getTime();
					let d = 24 * 60 * 60 * 1000;

					return (left / d).toFixed(0);
				}

				return rs;
			},
		},
		methods: {
			toDetail() {
				this.navTo(`/pages/index/workbench/report/report-detail?reportId=${this.item.report.id}`);
			},
		},
	};
</script>
