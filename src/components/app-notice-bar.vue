<template>
	<view class="my-text-color-black" @click="navTo('/pages/index/workbench/messages/messages')">
		<view class="" v-if="messageList.length === 0">
			无未读消息,点击查看全部消息
		</view>
		<view class="an-notice-box" v-else>
			<scroll-view class="an-notice-content">
				<swiper class="swiper" :autoplay="true" :interval="2000" :duration="2000" :circular="true" :vertical="true">
					<swiper-item v-for="(item, index) in messageList" :key="index" class="an-notice-content-item">
						<view class="swiper-item">
							<view class="an-notice-content-item-text">
								{{item.content}}
							</view>
						</view>
					</swiper-item>
				</swiper>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import OrderService from '@/apis/order'
	export default {
		components: {},
		props: {
			messageList: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {

			};
		},
		mounted() {},
		methods: {

		}
	}
</script>

<style>
	.swiper {
		height: 60upx !important;
		width: 100%;
	}

	.an-notice-box {
		width: 100%;
		height: 60upx;
		padding: 0 10upx;
		overflow: hidden;
		margin: 20upx 0;
		display: flex;
		justify-content: flex-start;
	}

	.an-notice-icon {
		width: 60upx;
		height: 60upx;
		line-height: 50upx;
		text-align: center;
		position: relative;
	}

	.an-notice-content {
		width: 100%;
		position: relative;
		font-size: 14px;
	}

	.an-notice-content-item {
		width: 100%;
		height: 60upx;
		text-align: left;
		line-height: 60upx;
	}

	.an-notice-content-item-text {
		display: block;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.an-notice-more {
		width: 130upx;
		height: 60upx;
		font-size: 12px;
		line-height: 60upx;
		text-align: right;
		color: #999;
	}

	@keyframes anotice {
		0% {
			transform: translateY(100%);
		}

		30% {
			transform: translateY(0);
		}

		70% {
			transform: translateY(0);
		}

		100% {
			transform: translateY(-100%);
		}
	}
</style>
