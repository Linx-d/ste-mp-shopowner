<template>
    <view>
        <app-report-item v-for="(item) in rows" :key="item.id" :item="item" />
        <app-empty v-if="!loading && rows.length === 0" />
        <app-loading v-if="loading" />
        <app-nomore v-if="nomore" />
    </view>
</template>

<script>
import ReportService from "@/apis/report";

export default {
    props: {
        status: { type: Number, default: () => 0 },
		keyword:{ type: String, default: () => '' },
		isInit:{ type: Boolean, default: () => true }
    },
    data() {
        return {
            rows: [1],

            page: 0,
            size: 10,
            total: 0,
            loading: false,
            nomore: false,
        };
    },
    computed: {
        shop() {
            return this.$store.state.shop;
        },
    },

    mounted() {
        this.init();
    },
    methods: {
        init() {
			if(this.isInit==true){
				this.reload();
			}
        },
        reload(isSearch=false) {
            this.load(0,isSearch);
        },

        load(page,isSearch) {
            
            if(this.loading) return;

            let params = {
                page,
				keyword:this.keyword,
                size: this.size,
                shopId: this.shop.id,
                status: this.status,
                sort: "updateTime,desc",
            };
            console.log(params.status, 'status');
            this.loading = true;
            if (this.status == 100) {
                params.status = "0,1,-1";
            }
			if (this.status == 200) {
			    params.status = "0,1,-1,9,-2";
			}
			ReportService.query(params,res=>{
				    if (res.statusCode === 200) {
				        let rows = res.data.data.content;
				        let total = res.data.data.totalElements;
				        this.rows = page === 0 ? rows: [...this.rows,...rows];
				        this.page = page;
				        this.total = total;
						if(isSearch){
							this.toast(`查找到${total==undefined?0:total}条数据`);
						}
				    } else {
				        this.toast("获取数据失败");
				    }
				
				    uni.stopPullDownRefresh();
				    this.loading = false;
			})
        },

        loadmore() {
            if ((this.page + 1) * this.size < this.total) {
                this.load(this.page + 1);
            } else if (!this.nomore) {
                this.nomore = true;
                this.toast("没有更多数据啦~");
            }
        },
        getOrderInfo(item) {
            console.log(item, "item");
            switch (item.status) {
                case 0:
                    this.navTo(
                        `/pages/index/workbench/reported-management/approveInfo?reportId=${item.id}&clientId=${item.client.id}`
                    );
                    break;
                case 1:
                    this.navTo(
                        `/pages/index/workbench/reported-management/approveInfo?reportId=${item.id}&clientId=${item.client.id}`
                    );
                    break;
                case -1:
                    this.navTo(
                        `/pages/index/workbench/reported-management/approveInfo?reportId=${item.id}&clientId=${item.client.id}`
                    );
                    break;

                case -2:
                    this.navTo(
                        `/pages/index/workbench/reported-management/visitInfo?reportId=${item.id}`
                    );
                    break;
            }
        },
        evidence(item) {
            console.log(item, "clientId");
            this.navTo(
                `/pages/index/workbench/reported-management/subscription?reportId=${item.id}&clientId=${item.client.id}`
            );
        },
    },
};
</script>
