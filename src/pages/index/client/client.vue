<template>
	<view class="container">
		<cu-custom bg-color="bg-white" >
		    <block slot="content" class="my-text-color-black text-bold">通讯录</block>
		</cu-custom>
		<!-- <view class="cu-bar bg-white search margin-bottom">
			<view class="search-form">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="请输入你需要查找的同事" confirm-type="search" v-model="keyword" @input="inputSearch" />
			</view>
		</view> -->

		<apply ref="apply" />
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
			<text class="cuIcon-title text-orange"></text> 门店同事({{ agreenTotal }})人
			</view>
		</view>
		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:'calc(100vh - '+ CustomBar + 'px - 138px)'}]"
		:scroll-with-animation="true" :enable-back-to-top="true">
			<block v-for="(item,key) in rows" :key="key">
				<view :class="'indexItem-' + key" :id="'indexes-' + key" :data-index="key">
					<view class="padding">{{key}}</view>
					<view class="cu-list menu-avatar no-padding">
						<view class="cu-item" style="transition: all .3s ease-in-out 0s;" :class="modalName=='move-box-'+ items.id?'move-cur':''"
						v-for="(items,sub) in rows[key]" :key="items.id" @click="checkClient(items)" @touchstart="ListTouchStart"
						@touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + items.id" @longpress="brokerLongpress(items)">
							<view class="cu-avatar round lg " :class="items.sex==0?'bg-blue':'bg-red'">
							<text class="avatar-text" style="font-size: 40upx;">{{items.name.substring(0,1)}}</text></view>
							<view class="content">
								<view class="text-black">{{items.name}}</view>
								<view class="text-gray text-sm">
									{{items.phone}}
								</view>
							</view>
							<view class="move">
								<view class="bg-red" @click.stop="delect(items.id)">删除</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<!-- <app-nomore v-show="rows.length === 0"></app-nomore> -->
		<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px - 138px)'}]">
			<view class="indexBar-box" id='indexBar-box' @touchstart="tStart" @touchend="tEnd">
				<view class="indexBar-item" v-for="(item,key) in rows" :key="key" :id="key" @touchstart="getCur" @touchend="setCur">
					{{key}}</view>
			</view>
		</view>
		<view v-show="!hidden" class="indexToast">
			{{listCur}}
		</view>

		<app-loading v-if="loading" />
		<app-nomore v-if="nomore" />
		<app-empty v-if="!loading && rows.length === 0" />

		<!-- 邀请码弹框 -->
		<app-modal></app-modal>
		<u-action-sheet :cancel-btn="cancel" :mask-close-able="maskClick" @click="actionClick" :list="actionList" v-model="show" :safe-area-inset-bottom="true"></u-action-sheet>
	</view>
</template>

<script>
	import shopBrokerService from "@/apis/shopBroker";
	import getPinyin from '@/common/getPingyin.js'
	import Apply from './Client/Apply'
	import Service from '../../../apis/service';
import { records } from '../workbench/js/work';
	export default {
		components: {
			Apply
		},
		data() {
			return {
				broker: {},
				show: false,
				cancel: true,
				maskClick: true,
				actionList: [
					{ text: '复制电话' },
					{ text: '拨打电话' }
				],
				// 右边筛选
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				hidden: true,
				listCur: '',
				listCurID: '',
				barTop: '',
				barTop: '',

				loading: false,
				nomore: false,

				keyword: '',

				page: 0,
				size: 1000,
				total: 0,
				rows: [],
				agreenTotal: 0,
				
				
				// 滑动删除
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
			};
		},
		computed: {
			shopId() {
				return this.$store.state.shop.id
			}
		},
		created() {
			let that = this;
			const query = uni.createSelectorQuery().in(this);
			query.select('#indexBar-box').boundingClientRect(data => {
				that.boxTop = data.top
			}).exec();
			query.select('.indexes').boundingClientRect(data => {
				that.barTop = data.top
			}).exec();
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.reload();
			},
			reload() {
				this.$refs.apply.reload()
				this.load(0);
			},
			inputSearch(e) {
				this.keyword = e.detail.value
				this.reload();
			},
			load(page) {
				this.agreenTotal = 0
				if (this.loading) return;
				//获取数据
				let params = {
					page: page,
					size: this.size,
					sort: "updateTime,desc",
					shopId: this.shopId,
					keyword: this.keyword
				};
				this.loading = true;
				this.agreenTotal = 0;
				shopBrokerService.query(params, (res) => {
					this.loading = false;
					if (res.data && res.data.data) {
						let data = res.data.data;
						let arr = []
						data.content.forEach(item => {
							if (item.status === 1) {
								arr.push(item.broker) 
								this.agreenTotal ++
							}
						}) || [];
						let rows = page === 0 ? arr : [...this.rows, ...arr];
						this.page = page;
						this.total = data.totalElements || 0;
						this.serialization(rows)
					}
					uni.stopPullDownRefresh();
				});
			},
			pullDownRefresh() {
				this.reload()
			},
			// 格式化
			serialization(list) {
				let obj={}
				let newObj={}
				list.forEach(res => {
					let letter = getPinyin.getCamelChars(res.name.substring(0, 1))
					if (obj[letter] == undefined) {
						obj[letter] = [res]
					} else {
						obj[letter].push(res)
					}
				})
				let keysSorted = Object.keys(obj).sort((a,b)=>a.localeCompare(b))
				for(let i=0;i<keysSorted.length;i++){
					newObj[keysSorted[i]]=obj[keysSorted[i]];
				}
				this.rows = newObj
			},
			// 上拉到底部
			// reachBottom() {
			// 	this.loadmore();
			// },
			// //下拉刷新
			// pullDownRefresh() {
			// 	this.reload();
			// },
			checkClient(items) {
				// this.navTo(
				// 	`/pages/index/client/detail?clientId=${items.id}`
				// );
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			delect(id) {
				const param = {
					brokerId: id,
					shopId: this.shopId
				}
				this.confirm("您确定要删除吗？", (ok) => {
					if (ok) {
						shopBrokerService.delete(param, res => {
							console.log(res);
							if (res.statusCode == 200) {
								this.toast('删除成功!', 'succeed')
							} else {
								this.toast('删除失败!')
							}
							this.reload();
						})
					}
				})
			},

			//触发全部开始选择
			tStart() {
				this.hidden = false
			},
			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur
			},
			//滑动选择Item
			// tMove(e) {
			// 	console.log(1111111,e);
			// 	let y = e.touches[0].clientY,
			// 		offsettop = this.boxTop,
			// 		that = this;
			// 	//判断选择区域,只有在选择区才会生效
			// 	if (y > offsettop) {
			// 		let num = parseInt((y - offsettop) / 20);
			// 		console.log(num);
			// 		this.listCur = num
			// 	};
			// },
			//获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = e.target.id;
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur
			},

			brokerLongpress(record) {
				this.broker = record
				this.show = true
			},
			actionClick(index) {
				if (index === 0) this.copy(this.broker.phone)
				if (index === 1) this.callPhone(this.broker.phone)
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


	page {
		padding-top: 100upx;
	}

	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>
