<template>
	<view>
		<cu-custom bg-color="bg-white" :is-back="true">
			<block slot="content" class="my-text-color-black text-bold">选择城市</block>
		</cu-custom>

		<view class="padding bg-white">

			<view class="text-gray text-sm">定位城市</view>

			<view class="cu-bar solids-bottom">
				<view class="action" style="margin-left:0" @click="toLocate">{{present.city?present.city:location.city}}</view>
				<view class="action text-sm align-center" @click="getlocation">
					<text class="cuIcon-locationfill my-text-color-blue"></text>
					<text class="my-text-color-blue" v-if="load">重新定位
					</text>
					<text v-else class="cuIcon-loading2 cuIconfont-spin" style="margin-left: 60upx;"></text>
				</view>
			</view>

			<view class="text-gray text-sm margin-top">已开通城市</view>

			<view class="cu-list margin-top menu">
				<app-loading v-if="loading" />
				<template v-else>
					<view class="cu-item padding-tb" v-for="item in rows" :key="item" @click="click(item)" style="padding-left:0;padding-right:0">
						<text class="content">{{item.city}}</text>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import AddrService from '@/apis/addr'

	export default {
		data() {
			return {
				loading: true,
				load:true,
				present: {
					city:'',
					adcode:''
				},
				rows: [],
			};
		},
		computed: {
			location() {
				return this.$store.state.location;
			},
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.getlocation();
				this.loading = true;
				let data = {
					level: 'city',
					opened: true
				}
				AddrService.addrQuery(data, res => {
					if (res.data && res.data.data.content) {
						console.log(res.data.data.content);
						this.rows = res.data.data.content.map(i => {
							if (i.name === '市辖区') {
								return {
									city:i.fullname.replace(i.name, ''),
									adcode:i.id
								};
							}
							return {
								city:i.name,
								adcode:i.id
							};
						})
					}
					this.loading = false;
				})
			},
			click(item) {
				this.$store.commit('setLocation', item);
				this.navBack();
			},
			getlocation() {
				this.load=false;
					this.getLocation(res => {
						this.hideLoading();
						this.load=true;
						if (res) {
							this.present = res
						} else {
							this.present.city = '定位失败'
						}
					});
			},
			toLocate() {
				this.$store.commit('setLocation', this.present);
				this.navBack();
			},
		},
	};
</script>
