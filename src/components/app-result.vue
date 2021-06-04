<template>
    <view class="cu-modal show">
        <view class="cu-dialog bg-white padding">
            <view
                class="cuIcon-roundcheckfill text-green"
                style="font-size:4em"
                v-if="result.type === 'success'"
            ></view>
            <view
                class="cuIcon-roundclosefill text-red"
                style="font-size:4em"
                v-else-if="result.type === 'error'"
            ></view>
            <view
                class="text-center margin-top-sm"
                v-if="result.title"
                :class="result.type === 'success'  ?'text-green' :'text-red' "
                style="font-size:2em"
            >{{result.title}}</view>
            <app-rich-text class="text-center margin-top-sm" v-if="result.text" :text="result.text" />
            <view class="text-center padding-xl">
                <button class="cu-btn bg-blue lg" @click="ok">完成</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        result: {
            type: Object,
            default: () => {
                return { type: "success", title: "操作成功" };
            },
        },
    },
    methods: {
        ok() {
            this.$emit("ok");
        },
    },
};
</script>