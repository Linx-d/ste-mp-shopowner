<template>
  <view>
      <!-- 导航 -->
		<view class="padding-tb margin-top margin-left margin-right radius bg-white">
			<view class="grid col-3 text-center">
				<view class="flex-col align-center" @click="toReport()">
					<image src="@/static/img/task4.svg" style="width: 104rpx;height: 104rpx;"></image>
					<view class="">报备数据</view>
				</view>
				<view class="flex-col align-center" @click="toContract">
					<image src="@/static/img/task5.svg" style="width: 104rpx;height: 104rpx;"></image>
					<view class="">签约数据</view>
				</view>
				<view class="flex-col align-center" @click="navTo('/pages/index/workbench/calculators/index')">
					<image src="@/static/img/task6.svg" style="width: 104rpx;height: 104rpx;"></image>
					<view class="">房贷计算器</view>
				</view>
			</view>
		</view>
  </view>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        toReport() {
            this.navTo('/pages/index/workbench/report/report');
        },
        toContract() {
            this.navTo('/pages/index/workbench/contract/contract');
        }
    }
}
</script>
