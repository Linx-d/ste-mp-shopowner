<template>
    <view class="flex-row text-center filter-bar bg-white">
        <view class="flex-1">
            <view>区域</view>
        </view>
        <view class="flex-1">
            <view>价格</view>
        </view>
        <view class="flex-1">
            <view>户型</view>
        </view>
        <view class="flex-1">
            <view>排序</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    
};
</script>
<style lang="less" scoped>
.filter-bar {
    .flex-1 {
        padding: 20rpx 0;
    }
}
</style>