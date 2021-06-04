<template>
	<view class="container">
		<cu-custom bg-color="bg-white" :is-back="true">
			<block slot="content" class="my-text-color-black text-bold">客户通讯录</block>
		</cu-custom>
		<view class="cu-bar bg-white search margin-bottom">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" confirm-type="search" v-model="keyword" @confirm="doSearch" />
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-green shadow-blur round" @click="doSearch" v-if="!search">搜索</button>
				<button class="cu-btn line-red" @click="undoSearch" v-if="search">清除</button>
			</view>
		</view>

		<view class="cu-list menu-avatar no-padding">
			<view class="cu-item" @click="checkClient(item)" v-for="(item) in rows" :key="item.id">
				<view class="cu-avatar round lg" :class="item.sex==0?'bg-blue':'bg-red'">
					<view class="">{{ item.name.substring(0,1) }}</view>
				</view>
				<view class="content">
					<view class="text-grey">{{ item.name }}</view>
					<view class="text-gray text-sm">{{item.phone || '' }} {{item.remark || '' }}</view>
				</view>
			<!-- 	<view class="action text-blue text-xl"><text class="cuIcon-phone"></text></view> -->
			</view>
		</view>
		<app-loading v-if="loading" />
		<app-nomore v-if="nomore" />
		<app-empty v-if="!loading && rows.length === 0" />
	</view>
</template>

<script>
	import ClientService from "@/apis/client";
	export default {
		data() {
			return {
				loading: false,
				nomore: false,
				search: false,

				keyword: null,

				page: 0,
				size: 10,
				total: 0,
				rows: [],

				// 滑动
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
			};
		},
		computed: {
			brokerId() {
				return this.$store.state.user.id;
			},
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.reload();
			},
			reload() {
				this.load(0);
			},
			loadmore() {
				if ((this.page + 1) * this.size < this.total) {
					this.load(this.page + 1);
				} else if (!this.nomore) {
					this.nomore = true;
					this.toast("没有更多数据啦~");
				}
			},
			doSearch() {
				this.search = true;
				this.reload();
			},
			undoSearch() {
				this.search = false;
				this.keyword = null;
				this.reload();
			},
			load(page) {
				if (this.loading) return;

				//获取数据
				let params = {
					page: page,
					size: this.size,
					sort: "updateTime,desc",
					brokerId: this.brokerId,
				};
				if (this.search && this.keyword) {
					params.keyword = this.keyword
				}
				this.loading = true;
				ClientService.query(params, (res) => {
					this.loading = false;
					if (res.data && res.data.data) {
						let data = res.data.data;
						let arr = data.content || [];

						this.rows = page === 0 ? arr : [...this.rows, ...arr];
						this.page = page;
						this.total = data.totalElements || 0;
					}
					uni.stopPullDownRefresh();
				});
			},
			// 上拉到底部
			onReachBottom() {
				this.loadmore();
			},
			//下拉刷新
			onPullDownRefresh() {
				this.reload();
				// uni.stopPullDownRefresh();
			},
			checkClient(items) {
				uni.setStorageSync('clients', items)
				uni.navigateBack(-1)

			}
		},
	};
</script>

<style scoped>
	.addBut {
		position: fixed;
		bottom: 170upx;
		right: 60upx;
	}
</style>
