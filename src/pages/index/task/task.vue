<template>
	<view>
		<!-- 头部 -->
		<cu-custom bg-color="bg-white" >
		    <block slot="content" class="my-text-color-black text-bold">屋掌柜</block>
		</cu-custom>
		
		<view class="bg-white" id="nav" style="width: 100%;position: fixed;z-index: 99999;border-top: 1rpx solid #EDEFF2;" :style="{'top':Custom+'px'}">
			<view class="cu-bar search bg-white">
				<view class="flex align-center"  style="height: 64rpx;background-color: #f5f5f5;margin-left: 30rpx;" @click="toChoose">
					<view class="" style="border-right: 1rpx solid #C2C2C2;padding: 0 30upx;">
						<text class="text-bold">{{location.city}}</text>
						<text class="cuIcon-triangledownfill"></text>
					</view>
				</view>
				<view class="search-form" style="margin-left: 0;">
					<text class="cuIcon-search"></text>
					<input @click="toSearch" :adjust-position="false" disabled type="text" placeholder="搜索楼盘名称" confirm-type="search"></input>
				</view>
			</view>
			<!-- <view class="flex flex-row justify-around padding-sm" style="width: 100%;">
				<view class="action" @click="tabClick(0)" :class="tabIndex==0?'color':''">
					<text>{{params.city?params.city:'区域'}}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
				<view class="action" @click="tabClick(1)" :class="tabIndex==1?'color':''">
					<text>价格</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
				<view class="action" @click="tabClick(2)" :class="tabIndex==2?'color':''">
					<text>{{params.maxRoom?params.maxRoom=='不限'?params.maxRoom:params.maxRoom+'居':'户型'}}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
				<view class="action" @click="tabClick(3)" :class="tabIndex==3?'color':''">
					<text>排序</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</view> -->
		</view>
		<view class="cu-modal" :class="popup?'show':''" @tap="hideModal">
			<view @tap.stop="" class="bg-white" style="position: absolute;width: 100%;" :style="{'top':Custom+navHeight+'px'}"
			 >
				<!-- 区域选择 -->
				<ehPicker @cancel="cancel" @areaConfirm="areaConfirm" :areaRows="areaRows" v-show="tabIndex==0" />
				<!-- 价格选择 -->
				<price-picker @cancel="cancel" :pickerTitle="pickerTitle" @priceConfirm="priceConfirm" v-show="tabIndex==1"></price-picker>
				<!-- 户型选择 -->
				<house-picker @cancel="cancel" :pickerTitle="params.maxRoom" @houseConfirm="houseConfirm" v-show="tabIndex==2"></house-picker>
				<!-- 排序 -->
				<sort-picker @cancel="cancel"  @sortConfirm="sortConfirm" v-show="tabIndex==3"></sort-picker>
			</view>
		</view>
		
		<!-- <view :style="topStyle"> -->
		<view style="margin-top: 65rpx;">
			<view class="margin-top padding-top">
				<app-task-list :params="params" ref="list" />
			</view>

			
		</view>
		<!-- 邀请码弹框 -->
		<app-modal></app-modal>
	</view>
</template>

<script>
	// props,components,data,computed,watch,
	// created, mounted,
	// methods
	import AddrService from '@/apis/addr';
	import Service from "@/apis/service.js";
	import ehPicker from '@/components/erha-picker/erha-picker.vue';
	import pricePicker from '@/components/erha-picker/price-picker.vue';
	import housePicker from '@/components/erha-picker/house-picker.vue';
	import sortPicker from '@/components/erha-picker/sort-picker.vue';
	export default {
		components: {
			ehPicker,
			pricePicker,
			housePicker,
			sortPicker
		},
		data() {
			return {
				areaRows: [],
				tabIndex: 0,
				popup: false,
				StatusBar: this.StatusBar,


				modalName: '',
				navHeight:'',
				// 筛选
				params: {
					city: '',
					sign: 1,
					sortType:'',
					maxPrice: '',
					maxRoom: '',
					maxUnitPrice: '',
					minPrice: '',
					minRoom: '',
					minUnitPrice: ''
				},
				pickerTitle:{}
			};
		},
		computed: {
			style() {
				return `height:${this.CustomBar}px;padding-top:${
                this.StatusBar 
            }px;`;
			},
			location() {
				return this.$store.state.location;
			},
			Custom() {
				return this.CustomBar
			},
			topStyle() {
				return `margin-top:${this.CustomBar}px`;
			},
		},
		onShow() {
			
		},
		watch: {
			location() {
				this.$nextTick(() => {
					this.params.city='';
					this.params.sign=1;
					this.pullDownRefresh();
					this.addrQuery();
				})
			},
		},
		created() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#nav').boundingClientRect(data => {
			  this.navHeight=data.height
			}).exec();
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				if (this.location.city == '定位中...') {
					let location = uni.getStorageSync('location' + Service.KEY_SUFFIX)
					if (location) {
						this.$store.commit('setLocation', location)
					} else {
						this.getLocation((res) => {
							if (res) {
								this.$store.commit('setLocation', res)
							} else {
								this.toast("定位失败~");
							}
						});
					}
				}

				if (this.location.city !== '定位中...') {
					this.addrQuery();
				}
			},

			addrQuery() {
				let data = {
					size: 100,
					level: 'district',
					// opened: true,
					parentId: this.location.adcode
				}
				AddrService.addrQuery(data, res => {
					if (res.data && res.data.data.content) {
						this.areaRows = [{
							children: '',
							name: '不限'
						}, ...res.data.data.content]
					}
				})
			},
			toChoose() {
				this.navTo("/pages/index/task/location/location");
			},
			toSearch() {
				this.navTo("/pages/index/task/search/search");
			},
			// 上拉到底部
			reachBottom() {
				this.$refs.list.loadmore();
			},
			//下拉刷新
			pullDownRefresh() {
				this.$refs.list.reload();

			},
			hideModal() {
				this.popup = false;
			},
			tabClick(index) {
				if(this.tabIndex == index&&this.popup){
					this.popup = false;
					return
				}
				this.modalName = 'RadioModal';
				this.popup = true;
				this.tabIndex = index;
				
			},
			//取消
			cancel() {
				this.popup = false
			},
			//区域选择确定
			areaConfirm(city, sign) {
				this.popup = false
				this.params.city = city == '不限' ? '' : city;
				this.params.sign = sign;
			},
			//价格选择确认
			priceConfirm(maxPrice, minPrice, maxUnitPrice, minUnitPrice,pickerTitle) {
				this.popup = false;
				this.params.maxPrice = maxPrice;
				this.params.minPrice = minPrice;
				this.params.maxUnitPrice = maxUnitPrice;
				this.params.minUnitPrice = minUnitPrice;
				this.pickerTitle=pickerTitle;
			},
			houseConfirm(houseType){
				this.popup = false;
				this.params.maxRoom=houseType;
				this.params.minRoom=houseType;
			},
			sortConfirm(sortType){
				this.popup = false;
				this.params.sortType=sortType;
			}
			
		},
	};
</script>


<style scoped>
	.color{
		color: #0464E0;
		font-weight: 700;
	}
</style>
