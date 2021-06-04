<template>
    <view>
        <app-commission-item v-for="(item) in rows" :key="item.id" :item="item" />
        <app-empty v-if="!loading && rows.length === 0" />
        <app-loading v-if="loading" />
        <app-nomore v-if="nomore" />
    </view>
</template>

<script>
import OrderService from '@/apis/order'
export default {
    props: {
        status: { type: Number, default: () => 0 },
    },
    data() {
        return {
            rows: [],

            page: 0,
            size: 10,
            total: 0,
            loading: false,
            nomore: false,
        };
    },
    computed: {
        brokerId() {
            return this.$store.state.user.id;
        },
    },

    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.reload();
        },
        reload() {
            this.load(0);
        },

        load(page) {
            if (this.loading) return;

            let params = {
                page,
                size: this.size,
                brokerId: this.brokerId,
                commissionStatus: this.status,
                sort: "updateTime,desc",
            };

            this.loading = true;

            OrderService.query(params, (res) => {
                if (res.statusCode === 200) {
                    let rows = res.data.data.content || [];
                    let total = res.data.data.totalElements;
                    this.rows = page === 0 ? rows : [...this.rows, ...rows];
                    this.page = page;
                    this.total = total;
                } else {
                    this.toast("获取数据失败");
                }

                uni.stopPullDownRefresh();
                this.loading = false;
            });
        },

        loadmore() {
            if ((this.page + 1) * this.size < this.total) {
                this.load(this.page + 1);
            } else if (!this.nomore) {
                this.nomore = true;
                this.toast("没有更多数据啦~");
            }
        },
    },
};
</script>