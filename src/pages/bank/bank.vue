<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <text slot="content" class="my-text-color-black text-bold">银行卡</text>
        </cu-custom>
        <view class="margin-top padding">
            <app-bank-card
                v-for="(item, index) in cards"
                :key="index"
                :item="item"
                @click="toClick"
            />
            <app-loading v-if="loading" />
            <button
                class="margin-top shadow my-bg-color-blue flex align-center justify-center text-white"
                @click="navTo('/pages/bank/create')"
            >
			<view class="cuIcon-add text-lg text-bold">
				
			</view>
			添加银行卡</button>
        </view>
    </view>
</template>

<script>
import BankService from "@/apis/bank";
export default {
    data() {
        return {
            cards: [],
            callback: null,
            loading: false,
        };
    },
    computed: {
        id() {
            return this.$store.state.user.id;
        },
    },
    onLoad(options) {
        this.callback = options.callback;
    },
    mounted() {
        this.init();
    },
    onShow() {
        this.load();
    },
    methods: {
        init() {
            //this.load();
        },
        load() {
            this.loading = false;
            BankService.getMe((res) => {
                if (res.data && res.data.data) {
                    this.cards = res.data.data || [];
                }
                this.loading = false;
            });
        },
        toClick(item) {
            if (this.callback) {
                let pages = getCurrentPages();
                let pre = pages[pages.length - 2];
                let func = pre.$vm[this.callback];
                if(func){
                    func(item);
                }

                this.navBack();
            }
        },
    },
};
</script>

<style lang="less" scoped>
.add-btn {
    padding: 40rpx;
    border-radius: 20rpx;
    text-align: center;
    color: #aaa;
    border: 2px dashed #aaa;
}
</style>