<template>
	<view>
	<image :src="newImgUrl"
	mode="mode"
	 :style="{'width':width+'rpx' ,'height': height+'rpx'}" class="bg-img radius" @error="error">
		</image>
	</view>
</template>


<script>
	import {
		DEFAULT_COVER,
		FAIL_COVER,
		THUMBNAIL_MAX
	} from "@/common/const";
	import Service from "@/apis/service";
	export default {
		data() {
			return {
				URI_OSS: Service.URI_OSS,
				DEFAULT_COVER,
				FAIL_COVER,
				THUMBNAIL_MAX,
				newImgUrl:'',
			}
		},
		props: {
		    imgUrl: { type: String, default: () => '' },
			mode: { type: String, default: () => 'scaleToFill' },
			width: { type: [String,Number], default: () => '' },
			height: { type: [String,Number], default: () => '' },
		},
		watch:{
		},
		created() {
			this.newImgUrl=this.imgUrl?`${this.URI_OSS + this.imgUrl + this.THUMBNAIL_MAX}`:`${this.DEFAULT_COVER}`
		},
		computed: {
			// url() {
			// 	let url=this.imgUrl?`${this.URI_OSS + this.newImgUrl + this.THUMBNAIL_MAX}`:`${this.DEFAULT_COVER}`
			// 	console.log('333333333',url);
			// 	return url
			// }
			// url() {
			// 	return this.newImgUrl?
			// 		this.newImgUrl == 'fail' ? `${this.FAIL_COVER}` : `${this.URI_OSS + this.newImgUrl + this.THUMBNAIL_MAX}` : `${this.DEFAULT_COVER}`
			// }
		},
		methods:{
			error(){
				this.newImgUrl=`${this.FAIL_COVER}`
			}
		}
	}
</script>

<style>
</style>
