<template>
	<view class="bg-white margin-left margin-right shadow margin-bottom flex radius" style="overflow: hidden;" v-if="item" @click.stop="toDetail"
	 @longpress.stop="showSheet">
	 <view class="flex-1">
	 	<view class="flex-row padding">
	 		<view class=" text-black text-bold text-lg">{{ item.houseName }}</view>
	 		<view class="cu-tag bg-green margin-left-sm radius">{{ item.housePropertyType }}</view>
	 		<view class="cu-tag text-yellow radius" style="background-color: #FEF1E8;" v-if="item.status === -2">已失效</view>
	 		<view class="cu-tag line-red radius" v-else-if="item.status === -1">已否决</view>
	 		<view class="cu-tag my-text-color-blue radius" style="background-color: #E6F0FC;" v-else-if="item.status === 0">待审核</view>
	 		<view class="margin-left cu-tag text-green mybg radius" v-if="item.status==9&&item.leftProtectDays > 0">保护期{{item.leftProtectDays}}天</view>
	 		<view class="margin-left cu-tag line-red radius" v-else-if="item.status==9&&item.leftProtectDays < 0">超过保护期</view>
	 		<view :class=" item.auditTime && fixedHour ===  0 ? 'cu-tag line-red radius' : `cu-tag text-green mybg radius` " v-else-if="item.status === 1">{{ !item.auditTime ? '已通过' : fixedHour > 0 ? `${fixedHour}小时后过期` : '作废'}}</view>
	 	</view>
	 	<view class="flex-row padding-lr align-center">
	 		<view class="flex-1" v-if="item.client">
	 			<view class="flex-col margin-bottom">
	 				<view class="text-bold text-lg flex align-center">
	 					{{item.client.name}}
						<image v-if="item.client.sex==0" src="@/static/img/nan.png" style="width: 36rpx;height: 36rpx;margin-left: 10rpx;" mode=""></image>
						<image v-else src="@/static/img/nv.png" style="width: 36rpx;height: 36rpx;margin-left: 10rpx;" mode=""></image>
	 					<text class="text-black margin-left text-light">{{item.client.phone.split(',')[0]}}</text>
	 	
	 				</view>
	 				<view class="text-bold text-lg">
	 					<text class="text-gray margin-left padding-left text-light" v-if="item.client.phone.length>11">{{item.client.phone.split(',').splice(1)}}</text>
	 				</view>
	 				<view class="text-gray margin-top-sm" >报备时间：{{ this.timeText(item.createTime) }}</view>
	 				<view class="text-gray margin-top-sm"  v-if="item.status !== 9">预计到访时间：{{ this.timeText(item.appointment) }}</view>
					<view class="margin-top-sm"  v-if="item.status === 9">到访时间：{{ this.timeText(item.acceptTime)}}</view>
	 			</view>
	 		</view>
	 		<!-- <view class="margin-left">
	 	        <view
	 	            class="cu-btn bg-blue round shadow"
	 	            v-if="item.status === 9 "
	 	            @click.stop="evidence(item)"
	 	        >证据链</view>
	 	    </view> -->
	 	</view>
	 <!-- 	
	 	<view class="padding" v-if="item.status === 9">
	 		<view class="flex-row align-center" >
	 			<view class="flex-1 text-gray flex-col">
	 				<view>报备时间： {{ this.timeText(item.createTime)}}</view>
	 				<view class="margin-top-sm">到访时间： {{ this.timeText(item.acceptTime)}}</view>
	 			</view>
	 	
	 		</view>
	 	</view> -->
	 </view>
	<view  @click.stop="callPhone(item.houseManagerPhone)" class="margin-left my-bg-color-blue flex-col align-center justify-center text-white" style="width: 88rpx;">
		<image src="@/static/img/phone.png" style="width: 36rpx;height: 36rpx;margin-bottom: 10rpx;" mode=""></image>
		<view >项</br>目</br>掌</br>柜</view>
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
			fixedHour() {
				if (this.item && this.item.auditTime) {
					let cTime = new Date(this.item.auditTime.replace(/-/g, "/"));
					let vType = this.item.task.reportValidType; // 0=当天 1=24小时
					let endTime =
						vType === 0 ?
						new Date(
							this.formatDate(cTime).replace(/-/g, "/") +
							" 23:59:59"
						) :
						new Date(cTime.getTime() + 24 * 60 * 60 * 1000);

					let h = 60 * 60 * 1000;

					let left = endTime - new Date();

					return left <= 0 ? 0 : (left / h).toFixed(0);
				}
				return 0;
			},
			protectDays() {
				let rs = "-";
				if (this.item && this.item.acceptTime) {
					let aTime = new Date(this.item.acceptTime.replace(/-/g, "/"));
					let pDays = this.item.task.protectDays;

					let d = 24 * 60 * 60 * 1000;

					let left = aTime.getTime() + pDays * d - new Date().getTime();

					return (left / d).toFixed(0);
				}
				return rs;
			},
		},
		mounted() {},
		methods: {
			toDetail() {
				this.navTo(
					`/pages/index/workbench/report/report-detail?reportId=${this.item.id}`
				);
			},
			showSheet() {
				uni.showActionSheet({
					itemList: ['复制报备信息'],
					success: (res) => {
						this.copyInfo();
					},
					fail: (res) => {
						console.log(res.errMsg);
					}
				});
			},
			copyInfo() {

				let arr = [];

				let {
					houseName,
					client,
					broker,
					clientPhone,
					appointment,
					remark
				} = this.item;
				let {
					name,
					phone
				} = client
				let {
					name: bname,
					phone: bphone
				} = broker


				arr.push({
					title: '报备楼盘',
					value: houseName || '-'
				})
				arr.push({
					title: '客户姓名',
					value: name || '-'
				})
				arr.push({
					title: '客户手机号',
					value: phone || '-'
				})
				arr.push({
					title: '经纪人姓名',
					value: bname || '-'
				})
				arr.push({
					title: '经纪人手机号',
					value: bphone || '-'
				})
				arr.push({
					title: '预计到访时间',
					value: this.timeText(appointment)
				})
				arr.push({
					title: '备注信息',
					value: remark || '-'
				})

				let info = arr.map(i => `${i.title}：${i.value}`).join('\n');
				this.copy(info);
			},
		},
	};
</script>
<style>
	.mybg {
		background-color: #E5F9EF;
	}
</style>
