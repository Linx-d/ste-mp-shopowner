import Vue from 'vue'
import Vuex from 'vuex'

import Service from '../apis/service'

Vue.use(Vuex)

const state = {
	token: null,
	me: null, // {openId,nickName}
	user: null,

	shop: null,
	shops: [],
	phone: null,

	openid: null,
	unionId:null,
	
	
	location:{
		city: '定位中...',
		adcode:'',//区域代码
	},
	
	
	dicts: [],
	taskIds: [],


	house: null,
	houses: null,
	task: null,
	tasks: null,

	serial: null,
	redirect: null,

	clipboardContent: '', //剪贴板内容

};

const setOpenId = (id) => {
	uni.setStorageSync('openid' + Service.KEY_SUFFIX, id);
}

const store = new Vuex.Store({
	state,
	actions: {},
	mutations: {
		setclipboardContent(state, payload) {
			state.clipboardContent = payload
		},
		setLocation(state, payload){
			uni.setStorageSync('location' + Service.KEY_SUFFIX, payload);
			state.location = payload
		},
		setUnionId(state,payload){
			state.unionId = payload;
			uni.setStorageSync('unionId' + Service.KEY_SUFFIX, payload);
		},
		setOpenid(state, payload) {
			state.openid = payload;
			setOpenId(payload);
		},
		setMe(state, payload) {
			state.me = payload;
			let openid = payload.openId;
			// uni.setStorageSync('me' + Service.KEY_SUFFIX, payload);
			if (openid) {
				state.openid = openid
				setOpenId(openid);
			}
		},
		setUser(state, payload) {
			state.user = payload;

			uni.setStorageSync('user' + Service.KEY_SUFFIX, payload);

			// if (payload.wx) {

			// 	state.me = { ...state.me,
			// 		...payload.wx
			// 	};
			// 	let openid = payload.wx.openId;
			// 	state.openid = openid;

			// 	setOpenId(openid);

			// }
		},
		setPhone(state, payload) {
			state.phone = payload
			uni.setStorageSync('phone' + Service.KEY_SUFFIX, payload)
		},
		setShop(state, payload) {
			state.shop = payload
			uni.setStorageSync('shop' + Service.KEY_SUFFIX, payload)
		},
		setShops(state, payload) {
			state.shops = payload
			uni.setStorageSync('shops' + Service.KEY_SUFFIX, payload)
		},
		setCode(state, payload) {
			state.code = payload;
		},
		setToken(state, payload) {
			state.token = payload;
			uni.setStorageSync('token' + Service.KEY_SUFFIX, payload);
		},
		setDicts(state, payload) {
			state.dicts = payload;
		},
		setSerial(state, payload) {
			state.serial = payload;
		},
		putTaskId(state, payload) {
			state.taskIds = [...state.taskIds, ...payload];
		},
		setRedirect(state, payload) {
			state.redirect = payload;
		},
	},
	getters: {}
})

export default store
