<template>
    <view class="flex-col margin-bottom-sm">
        <view v-for="(line,index) in rows" :key="index">{{line}}</view>
    </view>
</template>

<script>
export default {
    props: {
        text: { type: String, default: () => "-" },
    },
    computed: {
        rows() {
            return (this.text || "-").split("\n");
        },
    },
};
</script>