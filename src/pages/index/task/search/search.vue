<template>
	<view>
		<cu-custom bg-color="bg-white" :is-back="true">
		</cu-custom>
		

		<view class="cu-bar bg-white search margin-bottom">
            <view class="search-form round">
                <text class="cuIcon-search"></text>
                <input type="text" placeholder="输入搜索的关键词" confirm-type="search" focus="true" v-model="keyword" @confirm="doSearch"/>
            </view>
            <view class="action">
                <button class="cu-btn bg-gradual-green shadow-blur round" @click="doSearch" v-if="!search">搜索</button>
                <button class="cu-btn line-red" @click="undoSearch" v-if="search">清除</button>
            </view>
        </view>

		<view class="margin-top bg-white">
			<view class="cu-bar">
				<view class="text-bold action">历史搜索</view>
				<view @click="toClearHistory" class="action">清空</view>
			</view>
			<view class="padding-lr padding-bottom">
				<view class="cu-tag margin-left" v-for="(item) in historyList" :key="item" @click="historySearch(item)">{{ item }}</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import Service from '../../../../apis/service.js'
	export default {
		data() {
			return {
				keyword:'',
				historyList:[]
			}
		},
		onShow() {
			if(uni.getStorageSync('history'+Service.KEY_SUFFIX)){
				this.historyList=uni.getStorageSync('history'+Service.KEY_SUFFIX)
			}
		},
		methods: {
			doSearch(){
				if(!this.keyword){
					this.toast('请输入关键字!')
					 return
				}
				if(this.historyList.indexOf(this.keyword) ==-1){
					uni.setStorageSync('history'+Service.KEY_SUFFIX,[this.keyword,...this.historyList]);
				}
				this.navTo('/pages/index/task/search/result?keyword='+this.keyword);
				this.keyword='';
			},
			historySearch(keyword){
				this.navTo('/pages/index/task/search/result?keyword='+keyword);
				this.keyword='';
			},
			toClearHistory(){
				this.confirm('是否清空历史记录',res=>{
					if(res){
						uni.removeStorageSync('history'+Service.KEY_SUFFIX);
						this.historyList=uni.getStorageSync('history'+Service.KEY_SUFFIX);
					}
				})
			}
		}
	}
</script>
