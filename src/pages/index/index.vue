<template>
    <view>
        <view v-if="token">
            <workbench ref="workbench" v-if="tab === 'workbench'" />
            <client ref="client" v-if="tab === 'client'" />
            <profile ref="profile" v-if="tab === 'profile'" />
			
        </view>
        <view class="cu-tabbar-height"></view>
		
        <app-index-tabbar ref="bar" v-model="tab" @reload="reload" />
    </view>
</template>

<script>
// props,components,data,computed,watch,
// created, mounted,
// methods

import client from "./client/client";
import workbench from "./workbench/workbench";
import profile from "./profile/profile";

import UserService from "@/apis/user";
import shopOwnerService from '@/apis/shopOwner'
import Service from "@/apis/service";
import DictService from "@/apis/dict";

export default {
    components: {
        client,
        workbench,
        profile,
    },
    data() {
        return {
            tab: "workbench",
        };
    },
	onLoad(option) {
		if(option.tab){
			this.tab=option.tab
		}
	},
    computed: {
        user() {
            return this.$store.state.user
        },
        token() {
            return this.$store.state.token;
        },
        openid() {
            return this.$store.state.openid;
        },
        shopId() {
            return this.$store.state.shop.id
        }
    },
	onShow() {
        this.pullDownRefresh()
	},
    mounted() {
        this.init();
    },
    onPullDownRefresh() {
        this.pullDownRefresh()
    },
    onReachBottom() {
        let crt = this.$refs[this.tab];
        if (crt.reachBottom) {
            crt.reachBottom();
        }
    },
    methods: {
        init() {
            if (this.token) {
                this.load();
            } else {
                this.getTokenByOpenId(this.openid, (token) => {
                    if (token) {
                        this.load();
                    } else {
                        this.toast("授权失败，请重新启动小程序");
                    }
                });
            }

            this.$nextTick(() => {
                this.checkUpdate();
                // this.checkSubscribe();
            });
        },
		load(){
            if(this.tab==='workbench'){
				this.$refs.workbench.reload()
                this.$refs.bar.reload(this.shopId)
			}
		},
        pullDownRefresh() {
            this.$refs.bar.reload(this.shopId)
            let crt = this.$refs[this.tab];
            if (crt.pullDownRefresh) {
                crt.pullDownRefresh();
            } else {
                uni.stopPullDownRefresh();
            }
        }
    }
};
</script>