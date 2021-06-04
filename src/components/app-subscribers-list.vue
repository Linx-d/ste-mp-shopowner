<template>
    <view class="task-list">
        <view class="margin-top" v-if="rows.length > 0">
            <app-subscribers-item v-for="item in rows" @cancelSubscribe="cancelSubscribe" :key="item.id" :item="item" />
        </view>
        <app-empty v-else-if="!loading" />

        <app-loading v-if="loading" />

        <app-nomore v-if="nomore" />
    </view>
</template>

<script>
import Service from "@/apis/service.js";
import TaskService from "@/apis/task";
import UserService from "@/apis/user";
import HouseService from "@/apis/house";
export default {
    props: {
        keyword: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            modalName: null,

            nomore: false,

            page: 0,
            size: 10,
            total: 0,
            loading: false,
            rows: [],

            brokerId: "",
            taskId: "",
			
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        taskIds() {
            return this.$store.state.taskIds;
        },
		location() {
			return this.$store.state.location;
		}
    },
    watch: {
		
    },
    mounted() {
        this.init();
		// this.aa()
    },
    methods: {
        init() {
			this.load(0);
        },
        loadmore() {
            if ((this.page + 1) * this.size < this.total) {
                this.load(this.page + 1);
            } else if (!this.nomore) {
                this.nomore = true;
                this.toast("没有更多数据啦~");
            }
        },
        load(page=0) {
			if (this.loading) return;
			
			let { size,keyword} = this;
			let query = {
				brokerId:this.user.id,
			    page,
			    size,
				keyword,
			};
			this.loading = true;
			if (page === 0) {
			    this.nomore = false;
			}
			
			HouseService.findSubscribeHouse(query, (res) => {
			    this.loading = false;
			    if (res.data && res.data.data.hosues) {
			        let content  = res.data.data.hosues;
					console.log(content);
			        this.total = res.data.data.page.totalElements;
					
			        this.rows = page === 0 ? content : [...this.rows, ...content];
			    } else {
			        this.toast("加载任务列表失败");
			    }
			    // 下拉刷新关闭
			    uni.stopPullDownRefresh();
			});
        },
		cancelSubscribe(){
			this.init();
		}
    },
};
</script>