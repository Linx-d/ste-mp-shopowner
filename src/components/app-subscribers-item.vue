<template>
   <view class="bg-white margin-left-sm margin-right-sm shadow margin-bottom flex-col radius">
   	<!-- 上 -->
 <!--  	<view class="flex-row  padding align-center">
   	   <text class="cu-tag margin-right" style="background-color: #FA5151;color: #fff;">佣</text>
   	    <text
   	        class="text-grey text-sm flex-1 nowrap"
   	    >{{ task && task.ruleCommission ? task.ruleCommission.split('\n') :' - ' }}</text>
		
   	   <view class="text-right margin-left">
   			<text  class="my-text-color-blue text-bold" @click="toAccept">取消订阅</text>
   	    </view>
   		
   	</view> -->
       <!-- 下 -->
       <view class="flex-row padding" @click="goDetail(task)">
           <!-- 左 : 图片-->
   
           <view
               style="width:210rpx ;height: 210rpx;"
               class="bg-img"
               :style="
               task.house.cover
                 ? `background-image:url(${URI_OSS + task.house.cover + _thumb})`
                 : `background-image:url(${DEFAULT_COVER})`
             "
           ></view>
   
           <!-- 右 -->
           <view class="flex-1 padding-left-sm flex flex-col" v-if="task && task.house">
               <!-- 名字 天数 -->
               <view class="flex-row align-center">
   				<view class="text-white cu-tag radius margin-right" style="background-color: #F5741D;" v-if="task.endTime">
   				    {{
   				    dateDiffInDays(new Date(task.endTime.replace(/-/g, '/')), new Date()) > 0
   				    ? `剩${dateDiffInDays(new Date(task.endTime.replace(/-/g, '/')), new Date())}天`
   				    : "已过期"
   				    }}
   				</view>
                   <view class=" text-black text-bold text-lg">{{ task.house.name ? task.house.name : '-'}}</view>
               </view>
               
               <!-- 地点 建面 -->
               <view class="flex-row text-sm margin-top-sm">
                   <view class="">{{ task.house.district?task.house.district:''}} · {{task.house.street?task.house.street:''}}</view> <span style="margin: 0 6rpx;"> | </span>
   				<view class="">套内 {{ roomArea }}m²</view>
               </view>
   			<!--价格 -->
   			<view class="flex-row text-sm">
   				 <view class="text-lg text-bold" style="color: #FA5151;">{{ task.house.salePrice || '-' }}元/m²</view>
   			    
   			   
   			</view>
   			<!-- 类别 标签 -->
   			<view class="text-sm margin-top-sm" style="height: 52rpx;overflow: hidden;"   v-if="label && label.length>0">
   			<view
   			    class="cu-tag bg-green radius"
   			>{{ getHouseType(task.houseType,task.housePropertyType) }}</view>
   			    <view class='cu-tag radius my-text-color-blue' style="margin-top: 4rpx; background-color: #E6F0FC;"  v-for="(item,index) in label" :key="index">{{item}}</view>
   			</view>
           </view>
       </view>
   
       
   </view>
</template>

<script>
import TaskService from "@/apis/task";
import UserService from "@/apis/user";
import Service from "@/apis/service";
import HouseService from "@/apis/house";
import {  DEFAULT_COVER } from "@/common/const";

export default {
    props: {
        item: {
            type: Object,
            default: () => null,
        },
    },
    data() {
        return {
            task: {},

            URI_OSS:Service.URI_OSS,
            DEFAULT_COVER,
        };
    },
    computed: {
        brokerId() {
            return this.$store.state.user.id;
        },
        roomArea(){
            let rs = '-';
            if(this.task && this.task.house && this.task.house.roomAreaAll){
                rs = this.getHeadTail(this.task.house.roomAreaAll);
            }
            return rs;
        },
		label(){
			if(this.item.house.label){
				return this.item.house.label.split(',')
			}else{
				return []
			}
		},
		user(){
			return this.$store.state.user
		}

    },
    watch:{
        item:{
            deep:true,
            handler(v) {
                if(v){
                    this.$nextTick(()=>{
                        this.task = {...v };
                    })
                }
            },
        }
    },
    mounted() {
        this.task = { ...this.item };
    },
    methods: {
        toAccept() {
			this.confirm("是否取消订阅楼盘信息？", (ok) => {
				if (ok) {
					HouseService.delectBrokerHouses(this.item.brokerHouseId,res=>{
						this.$emit('cancelSubscribe')
						if(res.statusCode==204){
							this.toast("取消订阅!", true);
							this.$emit('cancelSubscribe')
						}
					})
				}
			})
        },

        goDetail(task) {
            this.navTo(
                `/pages/task/detail?houseId=${task.house.id}&taskId=${task.house.taskId}`
            );
        },
    },
};
</script>
<style>
	.aa{
		height: 60rpx;
		overflow: hidden;
	}
</style>