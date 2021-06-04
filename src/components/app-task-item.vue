<template>
    <view class="bg-white margin-left-sm margin-right-sm shadow margin-bottom flex-col radius">
		<!-- 上 -->
		<view class="flex-row  padding-sm align-center" style="border-bottom: 1rpx solid #F2F2F2;">
		    <text class="cu-tag margin-right" style="background-color: #FA5151;color: #fff;">佣</text>
		    <text
		        class="text-grey text-sm flex-1 nowrap"
		    >{{ task && task.ruleCommission ? task.ruleCommission.split('\n') :' - ' }}</text>
		
		    <!-- 按钮 -->
		    <view class="text-right margin-left">
				<text  v-if="!task.accepted" class="my-text-color-blue text-bold" @click="toAccept">接任务</text>
		        <text v-else class="cu-tab text-green text-sm">已接受</text>
		    </view>
			
		</view>
        <!-- 下 -->
        <view class="flex-row padding-sm" @click="goDetail(task)">
            <!-- 左 : 图片-->
			<!-- <image  style="width:210rpx ;height: 210rpx;"
                class="bg-img radius"
                :src="
                task.house.cover
                  ? `${URI_OSS + task.house.cover + _thumb}`
                  : `${DEFAULT_COVER}`
              "  mode=""></image> -->
			  <view class="" v-if='task.house.cover'>
			  	<app-img :imgUrl="task.house.cover" width="210" height="210"></app-img>
			  </view>
			
            <!-- 右 -->
            <view class="flex-1 padding-left-sm flex flex-col" v-if="task && task.house">
                <!-- 名字 天数 -->
                <view class="flex-row align-center">
					<!-- <view class="text-white cu-tag radius margin-right" style="background-color: #F5741D;" v-if="task.endTime">
					    {{
					    dateDiffInDays(new Date(task.endTime.replace(/-/g, '/')), new Date()) > 0
					    ? `剩${dateDiffInDays(new Date(task.endTime.replace(/-/g, '/')), new Date())}天`
					    : "已过期"
					    }}
					</view> -->
					<view
					    class="cu-tag bg-green radius text-sm margin-right"
					>{{ getHouseType(task.houseType,task.housePropertyType) }}</view>
                    <view class=" text-black text-bold text-lg">{{ task.house.name ? task.house.name : '-'}}</view>
                </view>
                
                <!-- 地点 建面 -->
                <view class="flex-row  margin-top-sm" style="font-size: 22rpx;">
                    <view class="">{{ task.house.district?task.house.district:''}} · {{task.house.street?task.house.street:''}}</view> <span style="margin: 0 6rpx;"> | </span>
					<view class="">套内 {{ roomArea }}m²</view>
                </view>
				<!--价格 -->
				<view class="flex-row text-sm" style="margin-top: 5rpx;">
					 <view class="text-lg text-bold" style="color: #FA5151;">{{ task.house.salePrice || '-' }}元/m²</view>
				    
				   
				</view>
				<!-- 类别 标签 -->
				<view class="text-sm margin-top-sm" style="height: 52rpx;overflow: hidden;"   v-if="label && label.length>0">
				
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
			// 判断是否有邀请码或入驻
			this.byIdCheckBroker(this.user.id,res=>{
				if(res.data==false){
					uni.$emit('showCodeModal')
					return
				}else{
					this.confirm("您确定要接此任务吗？", (ok) => {
					    if (ok) {
					        let params = {
					            task: Service.URI_API + "/rest/tasks/" + this.task.id,
					            broker: Service.URI_API + "/rest/brokers/" + this.brokerId,
					        };
					        this.showLoading(() => {
					            TaskService.acceptTask(params, (res) => {
					           
					                this.hideLoading();
					                if (res.statusCode === 201) {
					                    this.modal = null;
					                    this.task.accepted = true;
					                    this.$store.commit("putTaskId", [this.task.id]);
					                    this.toast("接收成功", "success");
					                }
					            });
					        });
					    }
					});
				}
			});
        },

        goDetail(task) {
            this.navTo(
                `/pages/task/detail?houseId=${task.house.id}&taskId=${task.id}`
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