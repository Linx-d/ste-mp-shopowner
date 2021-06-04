<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <!-- <block slot="backText">返回</block> -->
            <block slot="content" class="my-text-color-black text-bold">签约数据</block>
        </cu-custom>
		
		<view class=" nav fixed" :style="tabStyle">
			<!-- <view class="cu-bar bg-white search">
				<view class="search-form">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="请输入姓名和手机号后四位" disabled  @click="navTo('/pages/index/workbench/contract/contract-search')" />
				</view>
			</view> -->
			<scroll-view scroll-x class="bg-white shadow" >
			    <view class="flex text-center">
			        <view
			            class="cu-item flex-sub"
			            :class="index == status ? 'my-text-color-blue cur' : ''"
			            v-for="(item, index) in tabList"
			            :key="index"
			            @click="tabSelect(item.status)"
			        >{{ item.name + (item.number > 0 ? ` (${item.number})`:'') }}</view>
			    </view>
			</scroll-view>
		</view>
        

        <view class="orderList margin-top" @touchstart="touchstart"  @touchend="touchend" :style="contentStyle">
            <view v-if="status === 0">
                <app-order-list :status="status" :keyword="keyword" ref="list0" />
            </view>
            <view v-if="status === 1">
                <app-order-list :status="status" :keyword="keyword" ref="list1" />
            </view>
            <view v-if="status === 2">
                <app-order-list :status="status" :keyword="keyword" ref="list-1" />
            </view>
        </view>
    </view>
</template>

<script>
import OrderService from "@/apis/order";
export default {
    data() {
        return {
            status: 0,
			
			keyword:'',
            tabList: [
                {
                    status: 0,
                    name: "认购",
                    number: 0,
                },
                {
                    status: 1,
                    name: "签约",
                    number: 0,
                },
                {
                    status: 2,
                    name: "退房",
                    number: 0,
                },
            ],
			
			// 左滑
			startX:0,
			endX:0,
			divHeight:0
        };
    },
    computed: {
         tabStyle() {
            return `top:${this.CustomBar}px`;
        },
         contentStyle() {
            return `margin-top:${this.CustomBar+50}px;min-height: ${this.divHeight}px`;
        },
        brokerId() {
            return this.$store.state.user.id;
        },
    },
    onLoad(options) {
        if (options.status) {
            this.status = parseInt(options.status)
        }
    },
    mounted() {
		const e= uni.getSystemInfoSync();
		this.divHeight=e.screenHeight-this.CustomBar-130;
        this.init();
    },
    methods: {
        init() {
            // this.getStat();
        },
        getStat() {
            OrderService.getStat(this.brokerId, (res) => {
                if (res.data && res.data.data) {
                    let st = res.data.data;
                    this.$set(this.tabList, 0, {
                        ...this.tabList[0],
                        number: st.booked,
                    });
                    this.$set(this.tabList, 1, {
                        ...this.tabList[1],
                        number: st.signed,
                    });
                    this.$set(this.tabList, 2, {
                        ...this.tabList[2],
                        number: st.returned,
                    });
                }
            });
        },
       
        tabSelect(status) {
			this.keyword='';
            this.status = status;
        },
         reload() {
            this.getStat();
            this.$refs[`list${this.status}`].reload();
        },
        loadmore() {
            this.$refs[`list${this.status}`].loadmore();
        },
		doSearch(){
			this.getStat();
			 this.$refs[`list${this.status}`].reload();
		},
		touchstart(e){
			this.startX=e.changedTouches[0].clientX
			
		},
		touchend(e){
			let status=[0,1,2];
			this.endX=e.changedTouches[0].clientX
			if(this.endX-this.startX<-100){
				let indx=status.indexOf(this.status);
				if(indx==status.length-1) return
				this.keyword='';
				this.status = status[indx+1];
			}else if(this.endX-this.startX>100){
				let indx=status.indexOf(this.status);
				if(indx==0) return
				this.keyword='';
				this.status = status[indx-1];
			}
			
		}
    },
    onPullDownRefresh() {
        this.reload();
    },
    onReachBottom() {
        this.loadmore();
    }
	
};
</script>
<style lang="less" scoped>
    .orderList {
        margin-top: 135rpx !important;
    }
</style>