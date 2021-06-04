<template>
	<view>
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content" class="my-text-color-black text-bold">消息详情</block>
		</cu-custom>
		<view class="padding">
			<view class="shadow margin-top-xl" v-for="(item,index) in messageList" :key="index" @click="target(item)">
				<view class="text-center margin-bottom-sm">
					{{item.updateTime}}
				</view>
				<view class="bg-white padding radius">
					<view class="title">
						<view class="text-bold">{{title}}</view>
					</view>
					<view class="content">
						<view class="text-content">{{item.content}}</view>
					</view>
				</view>
			</view>
		</view>
		<app-nomore v-if="nomore" />
	</view>
</template>

<script>
	import MessageService from "@/apis/message.js"
	export default {
		data() {
			return {
				type: '',
				page: 0,
				size: 10,
				title:'',
				messageList: [],
				total:0,
				nomore:false,
			}
		},
		onLoad(option) {
			if(option.type !== undefined){
				this.type = option.type
				this.watchTitle(option.type)
			}
		},
		mounted() {
			this.loadMessage();
		},
		methods: {
			loadMessage() {
				let messageList = []
				let params = {
					page: this.page,
					size: 10,
					type: this.type,
					sort: 'updateTime,desc',
					receiverId:this.user.id
				}
				MessageService.query(params, res => {
					if (res.data.data) {
						this.total=res.data.data.totalElements;
						this.messageList=this.page==0?res.data.data.content:[...this.messageList,...res.data.data.content]
					}
					// 下拉刷新关闭
					uni.stopPullDownRefresh();
				})
			},
			loadmore() {
			    if ((this.page + 1) * this.size < this.total) {
					this.page +=1
			        this.loadMessage();
			    } else if (!this.nomore) {
			        this.nomore = true;
			        this.toast("没有更多数据啦~");
			    }
			},
			watchTitle(res){
				switch (res) {
					case 'TASK':
						this.title= '任务动态'
						break;
					case 'NEWS':
						this.title='楼盘动态'
						break;
					case 'CLIENT':
						this.title= '客户动态'
						break;
					case 'COMMISSION':
						this.title= '结佣通知'
						break;
					case 'REPORT':
						this.title= '业务动态'
						break;
					default:
						break;
				}
				
			},
			target(item){
				if(this.type=='REPORT'){
					this.navTo(`/pages/index/workbench/report/report-detail?reportId=${item.sourceId}`)
				}else if(this.type=='COMMISSION'){
					this.navTo(`/pages/index/workbench/commission/detail?id=${item.sourceId}`)
				}
			}
		},
		onPullDownRefresh() {
			this.page=0;
			this.loadMessage();
		
		},
		onReachBottom() {
			this.loadmore();
		},
		computed: {
			user() {
				return this.$store.state.user;
			}
		}
	}
</script>

<style>
</style>
