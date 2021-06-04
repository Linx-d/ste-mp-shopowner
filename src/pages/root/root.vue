<template>
	<view class="h100 root-bg">
		<image src="@/static/yuanlogo.svg" mode=""></image>
	</view>
</template>
<script>
	import DictService from "@/apis/dict";
	import Service from '@/apis/service.js'
	import shopOwnerService from '@/apis/shopOwner'
	export default {
		data() {
			return {
				auth: false,
			};
		},
		onLoad(options) {
			let redirect = options.redirect;
			this.auth = options.auth;
			if (redirect) {
				redirect = decodeURIComponent(redirect);
				console.log("ROOT REDIRECT = " + redirect);
			}
			this.$store.commit("setRedirect", redirect);
		},
		mounted() {
			this.preLoad();
			this.init();
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			redirect() {
				return this.$store.state.redirect;
			},
		},
		methods: {
			preLoad() {
				DictService.getAll((res) => {
					this.hideLoading();
					if (res.statusCode === 200) {
						this.$store.commit("setDicts", res.data._embedded.dicts);
					}
				});
			},
			init() {
				// 正式
				this.showLoading(() => {
					this.weixinLogin((res) => {
						console.log('USER', res);
						this.hideLoading();
						if (res) {
							// this.showWelcome()
							this.$store.commit('setPhone', res.phone)
							this.showHome()
						} else {
							this.showWelcome()
						}
					})
				})
			},
			showWelcome() {
				this.hideLoading();
				this.redirectTo("/pages/register/register");
			},
			showHome() {
				shopOwnerService.phoneValidator(res => {
					if(res) {
						this.shopValidator(res.data.data.id, (res) => {
							if (!res) {
								this.to300();
							} else {
								this.hideLoading();
								this.redirectTo(this.redirect || "/pages/index/index");
							}
						})
					} else {
						this.to300()
					}
				})
			}
		},
	};
</script>
<style lang="less">
	.root-bg {
		background-color: #fff;
		display: flex;
		justify-content: center;

		image {
			width: 148rpx;
			height: 148rpx;
			margin-top: 500rpx;
		}
	}
</style>
