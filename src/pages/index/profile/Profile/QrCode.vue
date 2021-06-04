<template>
    <view>
        <view class="cu-modal" :class="modalName=='qrcode'?'show':''">
			<view class="cu-dialog bg-white">
				<!-- <view class="bg-img" style="background-image: url('https://ossweb-img.qq.com/images/lol/web201310/skin/big91012.jpg');height:200px;"> -->
				<view class="bg-img" :style="qrcodeBacground">
					<view class="cu-bar justify-end text-white">
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close "></text>
						</view>
					</view>
				</view>
                <text class="text-orange">经纪人扫码加入门店</text>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">我知道了</view>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
import Service from '@/apis/service'
export default {
    data() {
        return {
            modalName: null
        };
    },
    computed: {
        shop() {
            return this.$store.state.shop
        },
        qrcodeBacground() {
            return `background-image: url(${Service.URI_API}/shop/${this.shop.id}/qr)`
        }
    },
	created() {
	},
    methods: {
        showModal() {
            this.modalName = 'qrcode'
        },
        hideModal() {
            this.modalName = null
        }
    },
};
</script>

<style lang="less" scoped>
    .bg-img {
        height: 300px;
    }
</style>