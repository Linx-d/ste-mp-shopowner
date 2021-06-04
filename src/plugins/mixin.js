import Vue from 'vue';
import utils from './utils.js'

import UserService from '../apis/user.js'
import shopService from '@/apis/shop'
import shopOwnerService from '@/apis/shopOwner'
import {
	SUBSCRIBE_TPS,
	THUMBNAIL,
	THUMBNAIL_MAX,
	THUMBNAIL_VIDEO,
	THUMBNAIL_ORIGIN,
	DEFAULT_COVER
} from '../common/const'
import Service from '../apis/service.js';
import LocationService from "../apis/analysisLocation.js";
const methods = Object.assign(utils, {
	/* 跳转 */
	navTo(url, options) {
		let params = {
			...options,
			url,
			fail: (e) => {
				console.log('navigate to ', url, e);
			}
		};
		console.log('navTo', params);
		uni.navigateTo(params)
	},
	to300() {
		this.navTo('/pages/root/300')
	},
	to500() {
		this.navTo('/pages/root/500')
	},
	navBack() {
		uni.navigateBack({
			delta: 1
		});
	},
	redirectTo(url, options) {
		let params = Object.assign({}, options, {
			url,
			fail: e => {
				console.log('redirect to fail ', url, e);
			}
		})
		console.log('redirectTo', params);

		uni.redirectTo(params)
	},
	relaunch(url) {
		uni.reLaunch({
			url,
			fail: e => {
				console.log('redirect to fail ', url, e);
			}
		})
	},
	/* 消息弹窗 */
	toast(msg, icon, callback) {
		icon = icon || 'none'
		uni.showToast({
			icon,
			title: msg,
			duration: 2000,
			success: () => {
				callback && callback()
			}
		});
	},
	requestFormat(url, param) {
        if (param) {
            url += '?' + Object.keys(param).map(item => `${item}=${param[item]}`).join('&')
        }
        return url
    },
	/* 微信登陆 */
	weixinLogin(callback) {
		uni.login({
			provider: "weixin",
			success: (res) => {
				let {
					code
				} = res;
				console.log(res, 'wx login');
				if (code) {
					UserService.getWxInfo(code, res2 => {
						if (res2.data && res2.data.data) {
							// if(res2.data.data.wx.unionId==null){
							// 	let {sessionKey}=res2.data.data.wx;
							// 	this.getUserInfo(e => {
							// 		if (e) {
							// 			let {
							// 				encryptedData,
							// 				iv
							// 			} = e;
							// 			this.decryptUserInfo(sessionKey, encryptedData, iv, (res3)=>{
							// 				console.log(res3);
							// 			});
							// 		} else {
							// 			callback(false);
							// 		}
							// 	})
							// }
							let {
								wx,
								user,
								token
							} = res2.data.data;
							this.$store.commit("setMe", wx);
							this.$store.commit("setUnionId", wx.unionId);
							this.$store.commit("setUser", user);
							if (user) {
								callback(user)
								this.$store.commit("setToken", token.token);
							} else {
								callback(false);
							}
						} else {
							callback && callback(false);
						}
					});
				} else {
					callback && callback(false);
				}
			},
			fail(e) {
				console.log("weixin login fail", e);
				callback && callback(false);
			}
		});
	},
	showLoading(msg, callback) {
		uni.showLoading({
			title: msg,
			success: () => {
				callback && callback();
			}
		})
	},
	hideLoading() {
		uni.hideLoading();
	},
	shopValidator(id, cb) {
        const param = {
            shopOwnerId: id
        }
        shopService.findByShopOwnerId(param, (res) => {
            if (res.statusCode === 200) {
                const shops = res.data._embedded.shops || []
                if (shops.length === 0) {
                    cb(false)
                } else {
                    const shop = shops[0]
                    const storeShop = uni.getStorageSync('shop' + Service.KEY_SUFFIX)
                    this.$store.commit('setShops', shops)
                    if (storeShop) {
                        const id = storeShop.id
                        const ids = shops.map(item => item.id)
                        if (!ids.includes(id)) {
                            this.$store.commit('setShop', shop)
                        } else {
							this.$store.commit('setShop', storeShop)
						}
                    } else {
                        this.$store.commit('setShop', shop)
                    }
                    cb(res)
                }
            } else {
                this.to500()
            }
        })
    },
	authValidator() {
		shopOwnerService.phoneValidator(res => {
			if(res) {
				this.shopValidator(res.data.data.id, (res) => {
					if (!res) {
						this.to300();
					}
				})
			} else {
				this.to300()
			}
		})
	},
	/**
	 * 表单输入
	 * @param {*} e 
	 */
	iptChange(e) {
		let name = e.currentTarget.dataset.name;
		let value = e.detail.value;
		this.$set(this, name, value);
	},
	/**
	 * 获取配置信息
	 * @param {*} scope 
	 * @param {*} callback 
	 */
	checkSetting(scope, callback) {
		uni.getSetting({
			success: (res) => {
				console.log("setting", res);
				let auth = res.authSetting;
				if (auth[scope]) {
					callback(true)
				} else {
					console.log("get setting ", scope, false);
					callback(false)
				}
			},
			fail: (e) => {
				console.log("get setting fail", e);
				callback(false)
			},
		});
	},
	/**
	 * 尝试获取授权的用户信息
	 * @param {*} callback 
	 */
	tryGetUserInfo(callback) {
		this.fetchUserBySessionKey(me => {
			if (me) {
				callback(me)
			} else {
				let scope = 'scope.userInfo'
				this.checkSetting(scope, has => {
					if (has) {
						uni.authorize({
							scope,
							success: () => {
								this.loginToDecrypt(callback)
							},
							fail(e) {
								console.log("auth user info fail ", e);
								callback(false)
							}
						});
					} else {
						callback(false)
					}
				})

			}
		})
	},
	fetchUserBySessionKey(callback) {
		let key = uni.getStorageSync("sessionKey" + Service.KEY_SUFFIX);
		if (key) {
			UserService.geWxUserBySessionKey(key, res2 => {
				if (res2.success && res2.data) {
					let me = res2.data;
					this.$store.commit("setMe", me);
					callback(me);
				} else {
					callback(false);
				}
			})
		} else {
			callback(false);
		}
	},
	getUserInfo(callback) {
		uni.getUserInfo({
			provider: "weixin",
			lang: "zh_CN",
			success: (res) => {
				callback(res)
			},
			fail: (e) => {
				console.log("get user info", e);
				callback(false)
			}
		});
	},
	// 执行登录，然后再解密用户
	loginToDecrypt(callback) {
		this.weixinLogin(res2 => {
			if (res2) {
				let {
					sessionKey
				} = res2;
				console.log(`login to decrypt key : ${sessionKey}`)
				this.getUserInfo(e => {
					if (e) {
						let {
							encryptedData,
							iv
						} = e;
						this.decryptUserInfo(sessionKey, encryptedData, iv, callback);
					} else {
						callback(false);
					}
				})
			} else {
				callback(false)
			}
		})
	},
	/**
	 * 后台解析加密的微信用户
	 * @param {*} key 
	 * @param {*} raw 
	 * @param {*} iv 
	 * @param {*} callback 
	 */
	decryptUserInfo(key, raw, iv, callback) {
		UserService.decrypteUserInfo(key, raw, iv, res3 => {
			if (res3.statusCode==200) {
				let me = res3.data.data;
				this.$store.commit("setMe", me);
				callback(me);
			} else {
				callback(false)
			}
		});
	},
	/**
	 * 根据OPEN ID 获取绑定的用户
	 * @param {*} openid 
	 * @param {*} callback 
	 */
	getUserByOpenid(openid, callback) {
		UserService.getUserByOpenid(openid, res => {
			if (res.data) {
				let user = res.data;
				this.$store.commit('setUser', user);
				callback(user)
			} else {
				callback(false)
			}
		})
	},
	confirm(content, callback) {
		uni.showModal({
			title: '请确认',
			content,
			success: function(res) {
				if (res.confirm) {
					callback(true)
				} else if (res.cancel) {
					callback(false);
				}
			}
		});
	},
	showLoading(callback) {
		uni.showLoading({
			title: '请稍后...',
			mask: true,
			success: () => {
				callback && callback()
			},
		});
	},
	hideLoading() {
		uni.hideLoading();
	},

	//版本更新
	checkUpdate(callback) {
		const updateManager = uni.getUpdateManager();

		updateManager.onCheckForUpdate(function(res) {
			// 请求完新版本信息的回调
			console.log("update check", res.hasUpdate);
			if (!res.hasUpdate) {
				callback && callback();
			}
		});

		updateManager.onUpdateReady(function(res) {
			console.log("update ready", res);
			this.toast("新版本已经准备好,马上更新");
			updateManager.applyUpdate();

			uni.clearStorageSync();
		});

		updateManager.onUpdateFailed(function(res) {
			// 新的版本下载失败
			console.log("update fail", res);
			callback && callback();
		});
	},
	// 检测订阅
	checkSubscribe() {
		uni.requestSubscribeMessage({
			tmplIds: SUBSCRIBE_TPS,
			success: () => {
				this.toast('订阅成功', 'success');
			},
			fail: e => {
				console.log(e)
				this.toast('订阅失败');
			}
		});
	},
	// 判断房产类型
	getHouseType(type, pType) {
		return type === 1 ? '商业' : pType === '别墅' ? '别墅' : '住宅';
	},
	// 预览图片
	previewImage(urls, current) {
		uni.previewImage({
			current,
			urls: urls.map(i => i + THUMBNAIL_ORIGIN),
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success: function(data) {
					//console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				},
				fail: function(err) {
					console.log(err.errMsg);
				}
			}
		});
	},


	getTokenByOpenId(openid, callback) {
		UserService.getTokenByOpenId(openid, (res) => {
			if (res.data && res.data.data) {
				let {
					token
				} = res.data.data;

				uni.setStorageSync("token" + Service.KEY_SUFFIX, token);

				this.$store.commit('setToken', token);

				callback(token);
			} else {
				callback(false);
			}
		});
	},

	getAddrName(addr) {
		let rs = addr.city === "市辖区" ?
			addr.province :
			addr.city

		return rs || '';
	},

	openOnMap(latlng) {
	console.log('latlng',latlng);
		const openLoc = (params) => {
			uni.openLocation({
				latitude: params.latitude,
				longitude: params.longitude,
				fail: (e) => {
					console.log(e);
				}
			});
		}

		if (latlng.latitude && latlng.longitude) {
			openLoc(latlng)
		} else {
			uni.getLocation({
				type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				success: (res) => {
					openLoc(res);
				}
			});
		}
	},
	callPhone(val) {
		uni.makePhoneCall({
			phoneNumber: val,
			success: () => {},
			fail: (e) => {
				// this.toast("拨打电话失败");
				console.log(e);
			},
		});
	},
	copy(data) {
		uni.setClipboardData({
			data,
			success: () => {
				uni.showToast({
					title: "复制成功！",
					icon: "success",
				});
			},
		});
	},

	dev() {
		this.toast('功能暂未开放，敬请期待!');
	},
	daysAgo(date) {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

		const diffDays = Math.round(Math.abs((new Date() - date) / oneDay));

		return diffDays === 0 ? '今天' : diffDays + '天前';
	},

	// 获取地理位置 市
	getLocation(callback) {
		let province = '';
		uni.getLocation({
			type: 'gcj02',
			success: (re)=> {
				let latlng = re.longitude.toFixed(6) + ',' + re.latitude.toFixed(6)
				LocationService.analysisLocation(latlng, res => {
					if (res.infocode = 1000) {
						let setLocation={
							city:res.regeocode.addressComponent.province,
							adcode:res.regeocode.addressComponent.adcode.substring(0,4)
						}
						callback(setLocation)
					} else {
						callback(false)
						uni.showToast({
							title: "地址解析失败",
							icon: "none"
						});
					}
				})
			},
			fail: function(res) {
				console.log(res);
				uni.openSetting({
					success(res) {
						uni.showToast({
							title: "请重新获取定位",
							icon: "none"
						});
						callback(false)
					}
				});
			}
		});
	},
	// 检查经纪人是否已驻场
	byIdCheckBroker(brokerId,callback){
		UserService.byIdCheckBroker(brokerId,res=>{
			if(res.statusCode==200){
				callback(res.data)
			}
		})
	},
	formatPrice(price) {
		let arr = price
			.toString()
			.split("")
			.reverse();
		let count = 0;
		if (arr.length % 3 === 0) {
			count = parseInt(arr.length / 3) - 1;
		} else {
			count = parseInt(arr.length / 3);
		}
		let i = 0;
		let num = 3;
		for (i; i < count; i++) {
			arr.splice(num * (i + 1) + i, 0, ",");
		}
		return arr.reverse().join("");
	}
});

Vue.mixin({
	data() {
		return {
			DEFAULT_COVER,
			_thumb: THUMBNAIL,
			_thumb_max: THUMBNAIL_MAX,
			_origin: THUMBNAIL_ORIGIN,
			_snapshoot: THUMBNAIL_VIDEO,
			dateStart: '1967-01-01',
			dateEnd: methods.formatDate(),
			maxPagination: {
				page: 0,
				size: 999,
				sort: 'createTime,desc'
			},
			defaultPagination: {
				page: 0,
				size: 10,
				sort: 'createTime,desc'
			}
		}
	},
	methods,
});
