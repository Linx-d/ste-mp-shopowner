<template>
	<view>
		<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			<cu-custom bgColor="bg-white" :isBack="true">
				<block slot="content" class="my-text-color-black text-bold">消息通知</block>
			</cu-custom>
			<view class="cu-list menu-avatar ">
				<app-message-card titleType="REPORT" ref="REPORT" :list="REPORTList" bgColor="bg-blue" v-if="REPORTList.length>0"></app-message-card>
				<app-message-card titleType="TASK" ref="TASK" :list="TASKList" bgColor="bg-orange" v-if="TASKList.length>0"></app-message-card>
				<app-message-card titleType="NEWS" ref="NEWS" :list="NEWSList" bgColor="bg-circle" v-if="NEWSList.length>0"></app-message-card>
				<app-message-card titleType="CLIENT" ref="CLIENT" :list="CLIENTList" bgColor="bg-pink" v-if="CLIENTList.length>0"></app-message-card>
				<app-message-card titleType="COMMISSION" ref="COMMISSION" :list="COMMISSIONList" bgColor="bg-red" v-if="COMMISSIONList.length>0"></app-message-card>
				<app-empty v-if="REPORTList.length==0&& TASKList.length==0&& NEWSList.length==0&& CLIENTList.length==0&& COMMISSIONList.length==0" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import MessageService from "@/apis/message.js"
	export default {
		data() {
			// REPORT=业务,TASK=任务,NEWS=楼盘动态,CLIENT=客户,COMMISSION=佣金,SYSTEM=系统,AD=广告,PRIVATE=私信,SIGN=签约
			return {
				modalName: null,
				REPORTList: [],
				TASKList: [],
				NEWSList: [],
				CLIENTList: [],
				COMMISSIONList: [],
			}
		},
		mounted() {
			this.init()
		},
		onShow() {
			this.getNoReaded()
		},
		methods: {
			getNoReaded() {
				if (this.$refs.REPORT) {
					this.$refs.REPORT.getNoReaded();
				}
				if (this.$refs.TASK) {
					this.$refs.TASK.getNoReaded();
				}
				if (this.$refs.NEWS) {
					this.$refs.NEWS.getNoReaded();
				}
				if (this.$refs.CLIENT) {
					this.$refs.CLIENT.getNoReaded();
				}
				if (this.$refs.COMMISSION) {
					this.$refs.COMMISSION.getNoReaded();
				}
			},
			init() {
				this.loadMessage('REPORT');
				this.loadMessage('TASK');
				this.loadMessage('NEWS');
				this.loadMessage('CLIENT');
				this.loadMessage('COMMISSION');
			},
			loadMessage(type = '') {
				let messageList = []
				let params = {
					page: 0,
					size: 10,
					sort: 'updateTime,desc',
					type,
					receiverId: this.user.id
				}
				MessageService.query(params, res => {
					if (res.data.data) {
						switch (type) {
							case 'TASK':
								this.TASKList = res.data.data.content
								break;
							case 'NEWS':
								this.NEWSList = res.data.data.content
								break;
							case 'CLIENT':
								this.CLIENTList = res.data.data.content
								break;
							case 'COMMISSION':
								this.COMMISSIONList = res.data.data.content
								break;
							case 'REPORT':
								this.REPORTList = res.data.data.content
								break;
							default:
								break;
						}

					}
				})
			}
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
