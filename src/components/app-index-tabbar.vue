<template>
	<view class="cu-bar foot tabbar shadow bg-white" style="z-index: 1000">
		<!-- <view class="action text-blue" v-if="value ===  'task'">
			<image src="@/static/img/tabbar1-2.png" class="tabber-wh"></image>
			<view class="tabbar-top" >任务</view>
		</view>
		<view class="action text-gray" v-else @click="swatchTab('task')">
			<image src="@/static/img/tabbar1-1.png" class="tabber-wh"></image>
			<view  class="tabbar-top">任务</view>
		</view> -->

		<view class="action text-blue" v-if="value ===  'workbench'">
			<image src="@/static/img/tabbar2-2.png" class="tabber-wh"></image>
			<view  class="tabbar-top">工作台</view>
		</view>
		<view class="action text-gray" v-else @click="swatchTab('workbench')">
			<image src="@/static/img/tabbar2-1.png" class="tabber-wh"></image>
			<view  class="tabbar-top">工作台</view>
		</view>

		<view class="action flex-row text-blue" v-if="value ===  'client'">
			<view class="cuIcon-cu-image">
				<image src="@/static/img/tabbar3-2.png" class="tabber-wh"></image>
				<view v-if="count !== 0" class="cu-tag badge">{{ count }}</view>
			</view>
			<view  class="tabbar-top">通讯录</view>
		</view>
		<view class="action text-gray" v-else @click="swatchTab('client')">
			<view class="cuIcon-cu-image">
				<image src="@/static/img/tabbar3-1.png" class="tabber-wh"></image>
				<view v-if="count !== 0" class="cu-tag badge">{{ count }}</view>
			</view>
			<view  class="tabbar-top">通讯录</view>
		</view>

		<view class="action text-blue" v-if="value ===  'profile'">
			<image src="@/static/img/tabbar4-2.png" class="tabber-wh"></image>
			<view  class="tabbar-top">我的</view>
		</view>
		<view class="action text-gray" v-else @click="swatchTab('profile')">
			<image src="@/static/img/tabbar4-1.png" class="tabber-wh"></image>
			<view  class="tabbar-top">我的</view>
		</view>
	</view>
</template>

<script>
	import Service from "@/apis/service.js";
	import shopService from '@/apis/shop'
	export default {

		props: ["value"],
		data() {
			return {
				count: 0
			}
		},
		methods: {
			reload(shopId) {
				const param = {
					shopId
				}
				shopService.conutAudit(param, res => {
					if (res.statusCode === 200) {
						if (res.data.success) {
							this.count = res.data.data
						}
					}
				})
			},
			swatchTab(key) {
				this.$emit("input", key);
			},
			target() {
				// let user = uni.getStorageSync('user' + Service.KEY_SUFFIX)
				// 判断是否有邀请码或入驻
				this.byIdCheckBroker(this.user.id,res=>{
					if(res.data==false){
						uni.$emit('showCodeModal')
						return
					}else{
						this.navTo(`/pages/report/report`)
					}
				});
			}
		},
		computed:{
			user(){
				return this.$store.state.user
			}
		}
	};
</script>
<style scoped>
	.tabber-wh{
		width: 45rpx;
		height: 45rpx;
	}
	.tabbar-top{
		margin-top: 7rpx;
	}
</style>
