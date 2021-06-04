<template>
	<view>
		<cu-custom bg-color="bg-white" is-back="true">
			<!-- <block slot="backText">返回</block> -->
			<block slot="content" class="my-text-color-black text-bold">签约数据</block>
		</cu-custom>
		<view class="fixed nav" :style="tabStyle">
			<view class="cu-bar bg-white search">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<!-- <input type="text" placeholder="输入姓名、手机号后四位搜索"  @click="navTo('/pages/index/workbench/report/searchReport')" /> -->
					<input type="text" placeholder="输入姓名、手机号后四位搜索" confirm-type="search" focus="true" v-model="keyword" @confirm="doSearch" />
				</view>
				<view class="action">
					<button class="cu-btn bg-gradual-green shadow-blur round" @click="doSearch">搜索</button>
				</view>
			</view>
		</view>
		<view style="margin-top: 120rpx;">
			<app-order-list :status="200" :isInit="false" :keyword="keyword" ref="list" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: ''
			}
		},
		computed: {
			tabStyle() {
				return `top:${this.CustomBar}px`;
			}
		},
		methods: {
			doSearch() {
				if(this.keyword==''){
					this.toast('请输入关键字')
					return
				}
				this.$refs.list.reload(true);
			}
		},
		onPullDownRefresh() {
			this.$refs.list.reload();
		},
		onReachBottom() {
			this.$refs.list.loadmore();
		},
	}
</script>

<style>
</style>
