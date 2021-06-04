<template>
    <view>
        <cu-custom bg-color="bg-white">
            <block slot="content" class="my-text-color-black text-bold">报备提交完成</block>
        </cu-custom>
        <view class="text-center ">
            <view class="cuIcon-roundcheckfill text-green margin-top-sm"></view>
            <view class="margin-top-sm text-lg text-content text-bold my-text-color-black">您的报备已提交审核，请等待驻场审核</view>
            <!-- <view class="text-gray text-content margin-bottom-lg" v-if="report">提交时间：{{ report.createTime || '-'}}</view> -->
        </view>
        <view class="cu-card article">
            <view class="cu-item padding" v-if="report">
				<view class="flex justify-between padding-lr text-lg text-bold my-text-color-black">
					<text>报备信息</text>
					<view class="cuIcon-copy" @click="toCopyAll"></view>
				</view>
                <view class="flex-row padding" v-for="item in infos" :key="item.title">
                    <view class="margin-right-sm text-right">{{item.title}}</view>
                    <view class="text-warp flex-1" style="word-break: break-word;">{{item.value}}</view>
                    <view class="text-center text-blue margin-left-sm" @click="copy(item.value)">复制</view>
                </view>
            </view>
        </view>
        <view class="text-center padding flex justify-between text-lg">
           <button class="cu-btn line-blue flex-1" style="margin-right: 80rpx;" @click="navTo('/pages/index/index?tab=workbench')">返回工作台</button>
            <!-- <button class="cu-btn margin-lr line-blue" @click="toCopyAll">全部复制</button>            -->
            <button class="cu-btn bg-blue flex-1" @click="toContinue">继续报备</button>
        </view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">报备失败列表</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view class="flex justify-between margin-bottom" v-for="(item,index) in errorMsgList" :key="index">
						<view class="text-sm">{{item.houseName}}</view>
						<view class="text-sm">{{item.msg}}</view>
					</view>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
import ReportService from "@/apis/report";
import ClientService from "@/apis/client";
import TaskService from "@/apis/task";

export default {
    data() {
        return {
            report: null,
            client: null,
			reportId:[],//报备成功id
			houseName:'',
			errorTasks:[],//报备失败任务id
			errorMsgList:[],
            infos:[],
			count:0,
			modalName:''//弹框
        };
    },
    onLoad(options) {
        // this.clientId = options.clientId;
		if(JSON.parse(options.reportId).length>0){
			this.reportId = JSON.parse(options.reportId);
		}
		if(JSON.parse(options.errorTasks).length>0){
			this.errorTasks = JSON.parse(options.errorTasks);
			this.$nextTick(()=>{
				this.showModal()
			})
		}
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
			for (let i = 0; i < this.reportId.length; i++) {
				this.ReportService(this.reportId[i])
			}
			
           for (let i = 0; i < this.errorTasks.length; i++) {
           	this.tasksById(this.errorTasks[i].id,this.errorTasks[i].msg)
           }
        },
		 ReportService(reportId){
			ReportService.byId(reportId, (res) => {
			    if (res.data) {
			        this.report = res.data;
			        this.client = this.report.client;
					this.houseName=this.houseName==''?res.data.houseName:this.houseName+','+res.data.houseName
			        this.parseInfo();
			    } else {
			        this.toast("加载报备信息失败");
			    }
				this.count++
			});
		},
        parseInfo(){
			if(this.infos.length>0) return
            let arr = [];

            let {houseName,client,broker,clientPhone,appointment,remark} = this.report;
            let {name,phone} = client
            let {name:bname,phone:bphone} = broker


            // arr.push({ title:'报备楼盘',value:houseName||'-' })
            arr.push({ title:'客户姓名',value:name||'-' })
            arr.push({ title:'联系方式',value:phone||'-' })
			arr.push({ title:'预计到访时间',value:this.timeText(appointment) })
			arr.push({ title:'备注信息',value:remark ||'-'})
            arr.push({ title:'经纪人',value:bname||'-' })
            arr.push({ title:'联系方式',value:bphone||'-' })
            
            

            this.infos = arr;
        },
		tasksById(id,msg){
			TaskService.byId(id,res=>{
				if(res.data){
					this.errorMsgList.push({houseName:res.data.houseName,msg})
				}
			})
		},
       toCopyAll(){
           let info = this.infos.map(i=>`${i.title}：${i.value}`).join('\n');
           this.copy(info);
       },
        reback() {
            this.redirectTo(`/pages/index/workbench/workbench`);
        },
        toContinue() {
            let pages = getCurrentPages();
            let pre = pages[pages.length - 2]; //当前页面
            pre.$vm.name = ''
            pre.$vm.phone = ''
            
            this.navBack();
        },
		showModal() {
			this.modalName = 'Modal'
		},
		hideModal(){
			this.modalName = ''
		}
    },
	watch:{
		count(val){
			if(val==this.reportId.length){
				this.infos.unshift({ title:'报备楼盘',value:this.houseName||'-' })
			}
		}
	}
};
</script>
<style lang="less" scoped>

.cuIcon-roundcheckfill {
    font-size: 100px;
}
.cu-item {
    background-color: #fff !important;
}
</style>