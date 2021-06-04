<template>
    <view>
        <app-loading v-if="loading" />
        <view v-else-if="rows.length > 0">
            <app-task-item v-for="(item, index) in rows" :key="index" :item="item" />
        </view>
    </view>
</template>

<script>
import TaskService from "@/apis/task";

export default {
    props: {
        size: {
            type: Number,
            default: () => 3,
        },
    },
    data() {
        return {
            loading: false,
            rows: [],
        };
    },
    computed: {
        userId() {
            return this.$store.state.user.id;
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.loading = true;
            TaskService.getRecommend({brokerId:this.userId,size:this.size}, (res) => {
                this.loading = false;
                if (res.statusCode === 200) {
                    let { data } = res.data;
                    this.rows = data || [];
                }
            });
        },
    },
};
</script>
