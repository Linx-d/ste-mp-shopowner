<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <block slot="content"  class="my-text-color-black text-bold">搜索结果</block>
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
				<app-task-list  :keyword="keyword" ref="list" />
			</view>
        </view>
    </view>
</template>

<script>
export default {
	data() {
		return {
			keyword:''
		}
	},
	components: {},
	onLoad(option) {
		this.keyword=option.keyword;
	},
	methods:{
		// 上拉到底部
		onReachBottom() {
			this.$refs.list.loadmore();
		},
		//下拉刷新
		 onPullDownRefresh() {
			this.$refs.list.reload();
		},
		doSearch(){
			this.$refs.list.reload();
		}
	},
	computed:{
		Custom(){
			return this.CustomBar
		},
	}
};
</script>