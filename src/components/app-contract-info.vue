<template>
    <view class="margin-top bg-white padding">
        <view class="text-bold text-lg">签约信息</view>
        <view class="margin-top" v-if="item">
            <!-- <view class="flex-row">
                <view class="flex-1 text-gray">驻场</view>
                <view class="flex-2">
                    <view class="flex-row">
                        <view
                            class="flex-1"
                        >{{ item._embedded.contractResident ? item._embedded.contractResident.name : '-'}}</view>
                        <view
                            class="cuIcon-phone text-blue margin-lr"
                            style="font-size:1.6em;"
                            v-if="item._embedded.contractResident"
                            @click="callPhone(item._embedded.contractResident.phone)"
                        ></view>
                    </view>
                </view>
            </view> -->
            <view class="flex-row margin-top">
                <view class="flex-1 text-gray">置业顾问</view>
                <view class="flex-2">{{item.consultantName}}</view>
            </view>
            <view class="flex-row margin-top">
                <view class="flex-1 text-gray">签约房号</view>
                <view class="flex-2">{{item.contractRoom || '-'}}</view>
            </view>
            <view class="flex-row margin-top">
                <view class="flex-1 text-gray">签约总价</view>
                <view
                    class="flex-2"
                >{{item.contractPrice ? numberWithCommas(item.contractPrice) : '-'}}</view>
            </view>
           <!-- <view class="flex-row margin-top">
                <view class="flex-1 text-gray">签约时间</view>
                <view class="flex-2">{{ item.contractTime || '-' }}</view>
            </view> -->
            <view class="flex-row margin-top">
                <view class="flex-1 text-gray">暂定佣金</view>
                <view class="flex-2">{{ item.earnest || '-'}}</view>
            </view>
            <view class="flex-row margin-top">
                <view class="flex-1 text-gray">合同</view>
                <view class="flex-2">
                    <app-media-grid
                        :media="item.contractPhotos"
                        v-if="item.contractPhotos && item.contractPhotos.length > 0"
                    />
                    <text v-else>未上传</text>
                </view>
            </view>
            <view class="flex-row margin-top">
                <view class="flex-1 text-gray">签约备注</view>
                <view class="flex-2">{{ item.contractRemark || '-'}}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => null,
        },
    },
};
</script>