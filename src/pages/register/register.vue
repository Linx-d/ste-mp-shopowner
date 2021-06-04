<template>
	<view class="register">
		<view class="reg-head flex-col align-center justify-center">
			<view class="reg-welcome text-bold flex align-center">
				<image src="@/static/yuanlogo.svg" mode="" style="width: 56rpx;height: 56rpx;"></image>
				<text class="margin-left-sm">屋掌柜门店端</text>
			</view>
			<view class="reg-title margin-top">买房就找屋掌柜</view>
		</view>
		<view class="reg-text flex-col align-center">
			<view class="solids reg-text-border margin-top text-left flex align-center">
				<image src="@/static/img/res3.png" mode=""></image>
				<view class="flex-1 padding-right-sm">屋掌柜是一款服务房产经纪人的赚钱神器。</view>
			</view>
			<view class="solids reg-text-border margin-top text-left flex align-center">
				<image src="@/static/img/res4.png" mode=""></image>
				<view class="flex-1 padding-right-sm">
					屋掌柜与全国知名开发商合作，拥有优质独家项目和海量房源，网签7日超快速结佣。
				</view>
			</view>
			<view class="solids reg-text-border margin-top text-left flex align-center">
				<image src="@/static/img/res5.png" mode=""></image>
				<view class="flex-1 padding-right-sm">
					经纪人能够使用屋掌柜进行客户在线报备、扫码确客、到访证据链上传、认购及签约、结佣的完整流程。
				</view>
			</view>
		</view>

		<view class="reg-bottom">
			<view class="reg-bottom-bg">
			</view>
			<view class="reg-bottom-btnBox">
				<view class="text-center">
					<button class="cu-btn reg-btn lg  bg-blue shadow" style="border-radius: 100rpx;" v-if="step === 0" @click="btnClick" lang="zh_CN">微信授权</button>
				</view>
				<view class="text-center">
					<button class="cu-btn reg-btn lg  bg-blue shadow" style="border-radius: 100rpx;" v-if="step==1" @getphonenumber="onPhoneNumber" open-type="getPhoneNumber"
					 lang="zh_CN">获取手机号注册</button>
					 <account v-if="step === 0" @accountLogin="accountLogin" />
				</view>
				<view class="reg-agreement text-gray">小程序仅限门店管理员登录使用</view>
				<view class="reg-agreement text-gray">
					注册就代表自动同意<navigator url="#" @click="navTo('/pages/register/agreement')" class="my-text-color-blue">《屋掌柜》隐私政策</navigator>
				</view> 
			</view>
		</view>
	</view>
</template>

<script>
	// props,components,data,computed,watch,
	// created, mounted,
	// methods

	import UserService from "@/apis/user";
	import shopOwnerService from "@/apis/shopOwner"
	import shopService from "@/apis/shop"
	import Service from '../../apis/service';

	import Account from './account.vue'
	export default {
		components: {
			Account
		},
		data() {
			return {
				// checked: true
				timeout: 1000,
				immediate: true,
				phone: '',
				step: 0,
				id: null
			};
		},
		computed: {
			me() {
				return this.$store.state.me;
			},
			unionId(){
				return this.$store.state.unionId;
			},
			user(){
				return this.$store.state.user;
			},
			redirect() {
				return this.$store.state.redirect;
			},
		},
		mounted() {},
		methods: {
			btnClick() {
				this.$u.debounce(this.onUserProfile, this.timeout, this.immediate)
			},
			onUserProfile() {
				const that = this
				uni.getUserProfile(
					{
						desc: '微信授权',
						success(res) {
							const { userInfo } = res
							if (userInfo) {
								console.log(that.me, 'me');
								console.log(userInfo, 'me');
								if (that.user) {
									// 老用户验证权限
									that.ownerPhoneValidator(that.user.phone, 'registered')
								}
								 
								const param = Object.assign(that.me || {}, userInfo)
								console.log(param, 'param');
								that.saveWxUser(param)
							}
						},
						fail(error) {
							console.log(error, 'error');
							that.toast('请统一授权获取微信信息')
						}
					}
				)
			},
			//获取手机号
			onPhoneNumber(e) {
				// 测试
				// this.ownerPhoneValidator('19922297443')
				// return
				/* ------------ 正式 --------------- */
				console.log(e, 'eeeee');
				let {
					encryptedData,
					iv
				} = e.detail;

				let sessionKey = this.me.sessionKey;
				if (!encryptedData && !iv) {
					this.toast("手机号获取失败");
					return
				}
				if (sessionKey) {
					this.decryptPhone(sessionKey, encryptedData, iv);
				} else {
					this.showLoading(() => {
						this.wexinLogin((res) => {
							this.hideLoading();
							if (res) {
								sessionKey = me.sessionKey;
								this.decryptPhone(sessionKey, encryptedData, iv);
							} else {
								this.toast("获取失败", "error");
							}
						});
					});
				}
			},
			//解析手机号
			decryptPhone(key, raw, iv) {
				this.showLoading(() => {
					UserService.decryptPhone(key, raw, iv, (res) => {
						this.hideLoading();
						if (res.data.success) {
							let {
								phoneNumber
							} = res.data.data;
							this.ownerPhoneValidator(phoneNumber)
						} else {
							this.toast("获取失败", "error");
						}
					});
				});
			},
			ownerPhoneValidator(phone, type = 'login') {
				this.phone = phone
				this.$store.commit('setPhone', this.phone)
				shopOwnerService.phoneValidator((res) => {
					const data = res.data
					if (data.success) {
						this.$store.commit('setUser', res.data.data)
						this.id = data.data.id
						this.shopValidator(this.id, (res) => {
							if (res) {
								if (type === 'login') {
									this.toSave()
								} else {
									this.accountSave()
								}
							} else {
								this.to300()
							}
						})
					} else {
						this.to300()
					}
				})
			},
			accountLogin() {
				this.ownerPhoneValidator('19922297443', 'account')
			},
			toSave() {
				const {
					openId
				} = this.me;
				const param = {
					phone: this.phone,
					wx: this.me,
					id: this.id
				};
				this.saveUser(param, openId);
			},
			accountSave() {
				if (this.user.wx.openId) {
					const {
						openId
					} = this.user.wx;
					this.showHome(openId)
				} else {
					this.toast('账号尚未绑定微信')
				}
			},
			//注册
			saveUser(param, openId) {
				this.showLoading(() => {
					UserService.registerOwner(param, (res) => {
						this.hideLoading();
						if (res.data && res.data.success) {
							let user = res.data.data;
							console.log(user, 'save user');
							this.$store.commit("setUser", user);
							this.showHome(openId)
						} else {
							this.toast(res.data.message);
						}
					});
				});
			},
			showHome(openId) {
				UserService.getTokenByOpenId(openId, (res) => {
					this.hideLoading();
					if (res.data && res.data.data) {
						let token = res.data.data.token;
						this.$store.commit("setToken", token);
						this.toast("注册成功", "success");
						setTimeout(() => {
							if(this.redirect){
								this.redirectTo(this.redirect);
							}else{
								this.navTo("/pages/index/index");
							}
						}, 100);
					} else {
						this.toast("授权出错", "error");
					}
				});
			},
			//保存用户信息
			saveWxUser(wxUser) {
				this.showLoading(() => {
					UserService.saveWxUser(wxUser, (res) => {
						this.hideLoading();
						if (res.data.success) {
							console.log(res.data.data);
							this.$store.commit("setMe", wxUser);
							this.step = 1
						}
					});
				});
			}
		},
	};
</script>

<style>
	page{
		background-color: #fff;
	}
</style>

<style scoped lang="less">
	.register {
		//字体颜色
		text-align: center;
		height: 100%;
		box-sizing: border-box;


		.reg-head{
			width: 478rpx;
			height: 514rpx;
			background-image: url(@/static/img/res1.png);
			background-size: 100% 100%;
		}
		//欢迎使用
		.reg-welcome {
			font-size: 48rpx;
			margin-top: 180rpx;
			
		}

		//标题
		.reg-title {
			font-size: 24upx;
			margin-bottom: 20%;
			color: #999999;
			letter-spacing:10rpx;
		}

		.reg-text {
			width: 100%;
		}
		
		
		.reg-bottom{
			width: 100%;
			height: 525rpx;
			position: relative;
		}
		.reg-bottom-bg{
			margin-left: auto;
			width: 609rpx;
			height: 100%;
			background-image: url(@/static/img/res2.png);
			background-size: 100% 100%;
		}
		.reg-bottom-btnBox{
			position: absolute;
			top: 100rpx;
			width: 100%;
		}
		.reg-text-border{
			letter-spacing:4rpx;
			width: 85%;
			height: 160rpx;
			color: #666666;
			image{
				width: 80rpx;
				height: 80rpx;
				margin:  0 10rpx;
			}
		}

		//协议
		.reg-agreement {
			font-size: 14px;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			margin-top: 30rpx;
		}

		.reg-btn {
			width: 85%;
		}

	}
</style>
