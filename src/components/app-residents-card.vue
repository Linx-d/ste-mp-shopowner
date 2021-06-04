<template>
    <view class="margin-top bg-white">
        <view class="padding text-bold text-lg solids-bottom">驻场人员</view>
        <view class="cu-list menu-avatar" v-if="items.length > 0">
            <view class="cu-item" v-for="item in items" :key="item.id">
                <view class="cu-avatar">
                    <app-user-avatar :user="item"/>
                </view>
                <view class="content">
                    <view class="text-grey">{{ item.name }}</view>
                </view>
                <view class="action" style="width:200rpx;">
                    <button
                        class="cu-btn line-blue"
                        v-if="item.phone"
                        @click.stop="callPhone(item.phone)"
                    >打电话</button>
                </view>
            </view>
        </view>
        <app-empty v-else />
    </view>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },
};
</script>