<template>
    <view
        class="bg-white margin-left margin-right shadow margin-bottom flex-col radius"
        v-if="item"
        @click.stop="toDetail"
    >
        <view class="flex padding-lr align-center  solids-bottom">
            <view class="text-bold my-text-color-black">单号：{{item.id}}</view>
			<view class="cuIcon-copy padding" @click.stop="copy(item.id)"></view>
			<view class="cu-tag my-text-color-blue" style="margin-left: auto; background-color: #E6F0FC;" v-if="item.commissionStatus==1||item.commissionStatus==4"> {{ commissionLabel(item.commissionStatus) }} </view>
			<view class="cu-tag text-green" style="margin-left: auto; background-color: #E5F9EF;" v-if="item.commissionStatus==3"> {{ commissionLabel(item.commissionStatus) }} </view>
			<view class="cu-tag text-red" style="margin-left: auto; background-color: #FFEDED;" v-if="item.commissionStatus==5"> {{ commissionLabel(item.commissionStatus) }} </view>
			<view class="cu-tag text-orange" style="margin-left: auto; background-color: #FEF1E8;" v-if="item.commissionStatus==-2"> {{ commissionLabel(item.commissionStatus) }} </view>
        </view>
        <view class="flex-col padding solids-bottom">
			<view class="flex align-center">
				<text class="text-black text-bold text-lg"> {{item.houseName + "-" + item.room}} </text>
				<view class="cu-tag bg-green radius margin-left-sm">
					{{item.housePropertyType}}
				</view>
			</view>
			<view class="flex align-center margin-top-sm">
				<text class="my-text-color-black text-lg"> {{item.room}} </text>
			</view>
            <view class="flex align-center margin-top-sm">
                <view class="margin-right-sm"> {{item.clientName}} </view>
				<image v-if="item.clientSex==0" src="@/static/img/nan.png" style="width: 36rpx; height: 36rpx;" mode=""></image>
				<image v-else src="@/static/img/nv.png" style="width: 36rpx; height: 36rpx;" mode=""></image>
				<text class="margin-left"> {{item.clientPhone}} </text>
            </view>
            
        </view>
        <view class="flex-row padding align-center">
            <view class="flex-1">
                <text class="text-black">{{item.commission ? '佣金':'暂定佣金' }} : </text>
                <text class="text-red text-bold">￥{{item.commission ?item.commission.toFixed(2)  : item.earnest.toFixed(2) }}</text>
            </view>
            <view class="flex-1 text-right ">
                <button class="cu-btn bg-blue  margin-left" v-if="item.commissionStatus === 3" @click.stop="toApply">申请结佣</button>
                <!-- <view class="cu-tag"> {{ commissionLabel(item.commissionStatus) }} </view> -->
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        item: { type: Object, default: () => null },
    },
    methods:{
        toApply(){
            this.navTo('/pages/index/workbench/commission/apply?id='+this.item.id);
        },
        toDetail(){
            this.navTo('/pages/index/workbench/commission/detail?id='+this.item.id);
        },
    },
};
</script>