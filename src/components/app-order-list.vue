<template>
    <view>
        <app-order-item v-for="(item, index) in rows" :key="index" :item="item"/>
        <app-loading v-if="loading" />
        <app-empty v-else-if="rows.length === 0" />
        <app-nomore v-if="nomore" />
    </view>
</template>

<script>
import OrderService from "@/apis/order";
import { DEFAULT_COVER } from "@/common/const";

export default {
    props: {
        status: {
            type: Number,
            default: () => 0,
        },
		keyword: {
		    type: String,
		    default: () => '',
		},
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

            DEFAULT_COVER,
        };
    },
    computed: {
        shopId() {
            return this.$store.state.shop.id;
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
                page: page,
                size: this.size,
				keyword:this.keyword,
                status: this.status==2?-1:this.status,
                sort: "updateTime,desc",
                shopId: this.shopId,
            };
			 
			 if(this.status==200){
				 params.status='0,1,-1'
			 }
            this.loading = true;
			OrderService.query(params, (res) => {
			    if (res.statusCode === 200) {
			        let { data } = res;
			        let arr = data.data.content || [];
			        let total = data.data.totalElements;
			
			        this.rows = page === 0 ? arr : [...this.rows, ...arr];
			
			        this.total = total;
			        this.page = page;
					if(isSearch){
						this.toast(`查找到${total==undefined?0:total}条数据`);
					}
			    } else {
			        this.toast("获取数据失败");
			    }
			    this.loading = false;
			    uni.stopPullDownRefresh();
			});
            // OrderService.byStatusAndBrokerId(params, (res) => {
            //     if (res.statusCode === 200) {
            //         let { data } = res;
            //         let arr = data._embedded.orders || [];
            //         let total = data.page.totalElement;

            //         this.rows = page === 0 ? arr : [...this.rows, ...arr];

            //         this.total = total;
            //         this.page = page;
            //     } else {
            //         this.toast("获取数据失败");
            //     }
            //     this.loading = false;
            //     uni.stopPullDownRefresh();
            // });
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
