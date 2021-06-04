<template>
    <view  >
        <cu-custom bg-color="bg-white" :is-back="!isHome" :is-home="isHome">
            <!-- <block slot="backText">返回</block> -->
            <block slot="content"  class="my-text-color-black text-bold">报备数据</block>
        </cu-custom>
		<view class="fixed nav" :style="tabStyle">
			<!-- <view class="cu-bar bg-white search">
				<view class="search-form">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="请输入姓名和手机号后四位" disabled @click="navTo('/pages/index/workbench/report/report-search')" />
				</view>
			</view> -->
			<scroll-view scroll-x class="bg-white  shadow" >
			    <view class="flex text-center">
			        <view
			            class="cu-item flex-sub"
			            :class="item.status == status ? 'my-text-color-blue cur' : ''"
			            v-for="(item, index) in tabList"
			            :key="index"
			            @click="changeTab(item)"
			        >{{ item.name + (item.number > 0 ?` (${item.number})` : '') }}</view>
			    </view>
			</scroll-view>
		</view>
		
        <view class="reportList margin-top" @touchstart="touchstart"  @touchend="touchend" :style="contentStyle">
            <view v-if="status ===0">
                <app-report-list :status="0" :keyword="keyword" ref="list0" />
            </view>
            <view v-if="status === 1">
                <app-report-list :status="1" :keyword="keyword" ref="list1" />
            </view>
            <view v-if="status === 9">
                <app-report-list :status="9" :keyword="keyword" ref="list9" />
            </view>
            <view v-if="status === -1">
                <app-report-list :status="-1" :keyword="keyword" ref="list-1" />
            </view>
            <view v-if="status === -2">
                <app-report-list :status="-2" :keyword="keyword" ref="list-2" />
            </view>
        </view>
    </view>
</template>

<script>
import ReportService from "@/apis/report";
export default {
    data() {
        return {
            status: 0,
			keyword:'',
            tabList: [
                {
                    status: 0,
                    name: "待审批",
                    number: 0,
                },
                {
                    status: 1,
                    name: "报备",
                    number: 0,
                },
                {
                    status: 9,
                    name: "到访",
                    number: 0,
                },
                {
                    status: -1,
                    name: "已否决",
                    number: 0,
                },
                {
                    status: -2,
                    name: "失效",
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
        user() {
            return this.$store.state.user;
        },
        isHome(){
            let  pages = getCurrentPages();

            return pages.length === 1;
        },
    },
    onLoad(options) {
        console.log(options, 'options');
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
            this.load();
        },
        load() {
            ReportService.getStat({brokerId:this.user.id}, (res) => {
                if (res.data && res.data.data) {
                    let st = res.data.data;
                    this.$set(this.tabList, 0, {
                        ...this.tabList[0],
                        number: st.committed,
                    });
                    this.$set(this.tabList, 1, {
                        ...this.tabList[1],
                        number: st.accepted,
                    });
                    this.$set(this.tabList, 2, {
                        ...this.tabList[2],
                        number: st.expired,
                    });
                }
            });
        },
        changeTab(item) {
			this.keyword='';
            this.status = item.status;
        },
        loadmore() {
            this.$refs[`list` + this.status].loadmore();
        },
        
        reload() {
            this.load();
            this.$refs[`list${this.status}`].reload();
        },
		toSearch(){
			
		},
		doSearch(){
			this.load();
			this.$refs[`list` + this.status].reload();
		},
		touchstart(e){
			this.startX=e.changedTouches[0].clientX
		},
		touchend(e){
			let status=[0, 1, 9, -1, -2];
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
    },
};
</script>

<style>
	page{
		height: 100%;
	}
    .reportList {
        margin-top: 135rpx !important;
    }
</style>