<template>
	<view class="cu-modal" :class="isShow?'show':''">
		<view class="cu-dialog">
			<view class="cu-bar bg-white justify-end">
				<view class="content text-bold">是否使用剪切板的内容</view>
			</view>
			<view class="padding text-left margin-left margin-right">
				<view v-if="nameNums">
					姓名:{{nameNums}}
				</view>
				<view v-if="phone">
					电话:{{phone}}
				</view>
			</view>
			<view class="cu-bar bg-white justify-between padding-left padding-right">
					<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
					<button class="cu-btn bg-green" @tap="confirmModal">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import UserService from "@/apis/user";
	export default{
		data() {
			return {
				isShow:false,
				phone:''
			}
		},
		props:{
			show:{
				default: () => {
				    return false;
				}
			},
			phoneNums:{
				default: () => {
				    return [];
				}
			},
			nameNums:{
				default: () => {
				    return [];
				}
			}
		},
		created() {
		},
		watch:{
			show(val){
				this.isShow=val
			},
			phoneNums(val){
				if(val.length==1){
					this.phone=val[0]
				}
				if(val.length>1){
					this.phone=val.join(',')
				}
				
			}
		},
		methods:{
			hideModal(){
				this.isShow=false
			},
			confirmModal(){
				this.$emit('confirmModal')
			}
		},
		computed:{
			user(){
				return this.$store.state.user
			},
			openid(){
				return this.$store.state.openid
			}
		}
	}
</script>

<style>
</style>
