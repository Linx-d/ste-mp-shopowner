<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <text slot="content"  class="my-text-color-black text-bold">佣金列表</text>
        </cu-custom>
        <scroll-view
            scroll-x
            class="bg-white nav fixed shadow"
            :style="tabStyle"
            :scroll-left="scrollLeft"
        >
            <view class="flex text-center ">
                <view
                    class="cu-item flex-sub"
                    :class="item.status === tab ? 'cur my-text-color-blue' : ''"
                    v-for="(item, index) in tabs"
                    :key="index"
                    @click="tabSelect(item.status,index)"
                >{{ item.title }}</view>
            </view>
        </scroll-view>

        <view class="" :style="contentStyle">
            <view v-for="(item, index) in tabs" :key="index">
                <app-commission-list
                    :status="item.status"
                    :ref="'list'+item.status"
                    v-if="tab === item.status"
                />
            </view>
        </view>
    </view>
</template>

<script>
import OrderService from "@/apis/order";
export default {
    props: {
        status: {
            type: Number,
            default: () => 1,
        },
    },
    data() {
        return {
            index: 0,
            tab: 1,
            tabs: [
                // {
                //     title: "全部",
                //     status: 100,
                //     count: 0,
                // },
                {
                    title: "待结佣",
                    status: 1,
                    count: 0,
                },
                // {
                //     title: "回款中",
                //     status: 2,
                //     count: 0,
                // },
                {
                    title: "可结佣",
                    status: 3,
                    count: 0,
                },
                {
                    title: "结佣中",
                    status: 4,
                    count: 0,
                },
                {
                    title: "已结佣",
                    status: 5,
                    count: 0,
                },
                {
                    title: "结佣异议",
                    status: -2,
                    count: 0,
                },
            ],
        };
    },
    computed: {
        tabStyle() {
            return `top:${this.CustomBar}px`;
        },
        contentStyle() {
            return `margin-top:${this.CustomBar}px;`;
        },
        scrollLeft() {
            return this.index ? (this.index - 1) * 60 : 0;
        },
        id() {
            return this.$store.state.user.id;
        },
        crtList(){
            return `list${this.tab}`;
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.tabSelect(parseInt(this.status));

            this.loadStat();
        },
        loadStat() {
            OrderService.getStat(this.id, (res) => {
                if (res.data && res.data.data) {
                    this.setCount(res.data.data);
                }
            });
        },
        setCount(st) {
            let arr = this.tabs;
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                arr[i].count = this.getCount(st, item.status);
            }
            this.tabs = [...arr];
        },
        getCount(st, status) {
            let key =
                status === 1
                    ? "moneyWait"
                    : status === 2
                    ? "money"
                    : status === 3
                    ? "moneyFinish"
                    : status === 4
                    ? "commissionApply"
                    : status === 5
                    ? "commissionFinish"
                    : status === -2
                    ? "commissionFail"
                    : "";
            return st[key] || 0;
        },
        tabSelect(status) {
            this.tab = status;
            let idx = this.findIdxInArr(this.tabs, "status", { status });
            this.index = idx;
        },
        reload() {
            this.loadStat();
            this.$refs[this.crtList][0].reload();
        },
        loadmore() {
            this.$refs[this.crtList][0].loadmore();
        },
    },
    onPullDownRefresh() {
        this.reload();
    },
    onReachBottom() {
        this.loadmore();
    },
};
</script>