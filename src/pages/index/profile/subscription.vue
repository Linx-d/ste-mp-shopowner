<template>
    <view>
        <cu-custom bg-color="bg-white" is-back="true">
           <block slot="content"  class="my-text-color-black text-bold">已订阅楼盘</block>
        </cu-custom>
		<view class="cu-bar bg-white search margin-bottom fixed" :style="{'top':Custom+'px'}">
		    <view class="search-form round">
		        <text class="cuIcon-search"></text>
		        <input type="text" placeholder="输入搜索的关键词" confirm-type="search" v-model="keyword" @confirm="doSearch"/>
		    </view>
		    <view class="action">
		        <button class="cu-btn bg-gradual-green shadow-blur round" @click="doSearch">搜索</button>
		    </view>
		</view>
        <view style="margin-top: 60upx;">
			<view class="margin-top padding-top">
				<app-subscribers-list  :keyword="keyword" ref="list" />
			</view>
        </view>
    </view>
</template>

<script>
import HouseService from "@/apis/house";
export default {
	data() {
		return {
			keyword:''
		}
	},
	components: {},
	onLoad() {
	},
	onShow() {
		this.init();
	},
	methods:{
		init(){
			let _this=this
			this.$nextTick(()=>{
				_this.$refs.list.load();
			})
		},
		// 上拉到底部
		onReachBottom() {
			this.$refs.list.loadmore();
		},
		//下拉刷新
		 onPullDownRefresh() {
			this.$refs.list.load();
		},
		doSearch(){
			this.$refs.list.load();
		}
	},
	computed:{
		Custom(){
			return this.CustomBar
		},
	}
};
</script>