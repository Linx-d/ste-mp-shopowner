import Vue from 'vue'
import App from './App'

import store from './store'

import "@/assets/less/common.less"

import './plugins/mixin'


//下拉框全局注册
import xflSelect from './components/xfl-select/xfl-select.vue'
Vue.component('xfl-select', xflSelect);

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

import uView from 'uview-ui';
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
