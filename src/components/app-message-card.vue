<template>
	<view class="bg-white padding flex margin-top" @click="target">
		<view class="cu-avatar round lg margin-right" :class="bgColor">
			<view class="cuIcon-form"></view>
			<view class="cu-tag badge" v-if="count>0">{{count>=100?'99+':count}}</view>
		</view>
		<view class="content flex-1">
			<view class="text-grey flex justify-between align-center">
				<view class="text-cut text-bold">{{titleType|filterTitle}}</view>
				<view class="text-grey text-xs">{{list[0].updateTime}}</view>
			</view>
			<view class="text-gray text-sm">
				<view class="an-notice-content-item-tex">
					{{list[0].content}}
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import MessageService from "@/apis/message.js"
	export default {
		data() {
			return {
				title: '',
				count: 0, //未读数量
				readedId: '', //未读数ID
			}
		},
		props: {
			list: {
				type: Array,
				default: () => []
			},
			titleType: {
				type: String,
				default: () => ''
			},
			bgColor: {
				type: String,
				default: () => ''
			}
		},
		created() {
			this.getNoReaded()
		},
		methods: {
			target() {
				this.navTo('/pages/index/workbench/messages/messageDetail?type=' + this.titleType);
				if (this.readedId != '') {
					this.read()
				}
			},
			//标记已读
			read() {
				MessageService.signReaded(this.readedId, res => {

				})
			},
			//获取100条未读消息
			getNoReaded() {
				let params = {
					page: 0,
					size: 100,
					type: this.titleType,
					read: false,
					receiverId: this.user.id
				}
				MessageService.query(params, res => {
					if (res.data.data) {
						this.count = res.data.data.content.length
						this.count > 0 ? this.getReadedId(res.data.data.content) : ''
					}
				})
			},
			//获取未读消息id
			getReadedId(list) {
				this.readedId = list.map(res => {
					return res.id
				}).join(',')
			}
		},
		filters: {
			filterTitle(val) {
				switch (val) {
					case 'TASK':
						return '任务动态'
						break;
					case 'NEWS':
						return '楼盘动态'
						break;
					case 'CLIENT':
						return '客户动态'
						break;
					case 'COMMISSION':
						return '结佣通知'
						break;
					case 'REPORT':
						return '业务动态'
						break;
					default:
						break;
				}
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
			}
		}
	}
</script>

<style scoped>
	.an-notice-content-item-tex {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
</style>
