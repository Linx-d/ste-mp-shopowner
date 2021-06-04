<template>
    <view class="bg-white padding" v-if="item">
        <view class="text-bold text-lg margin-bottom">结佣信息</view>
        <view class="flex-row margin-top-sm">
            <view class="flex-1 text-gray">订单号</view>
            <view class="flex-2 flex-row">
                <text class="flex-1">{{item.id}}</text>
               <!-- <text class="cuIcon-copy margin-left text-blue text-lg" @click="copy(item.id)"></text> -->
            </view>
        </view>
        <view class="flex-row margin-top-sm">
            <view class="flex-1 text-gray">签约时间</view>
            <view class="flex-2">{{item.contractTime}}</view>
        </view>
        <view class="flex-row margin-top-sm">
            <view class="flex-1 text-gray">认购时间</view>
            <view class="flex-2">{{item.createTime}}</view>
        </view>
        <view class="flex-row margin-top-sm">
            <view class="flex-1 text-gray">置业顾问</view>
            <view class="flex-2">{{item.consultantName || '-'}}</view>
        </view>
        <view class="flex-row margin-top-sm">
            <view class="flex-1 text-gray">成交价</view>
            <view class="flex-2 my-text-color-red text-bold">￥{{numberWithCommas(item.contractPrice)}}</view>
        </view>
        <view class="flex-row margin-top-sm">
            <view class="flex-1 text-gray">佣金</view>
            <view class="flex-2 text-bold my-text-color-black">￥{{numberWithCommas(item.commission)}}</view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        item: { type: Object, default: () => null },
    },
};
</script>
