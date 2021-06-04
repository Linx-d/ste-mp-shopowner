<template>
	<view class="cu-modal" :class="isShow?'show':''">
		<view class="cu-dialog">
			<view class="cu-bar bg-white justify-end">
				<view class="content text-bold">邀请码</view>
				<view class="action" @tap="hideModal">
					<text class="cuIcon-close text-red"></text>
				</view>
			</view>
			<view class="padding">
				《屋掌柜》当前使用邀请注册制请输入邀请码。
				从任务列表进入楼盘详情,可电话联系掌柜获取。
			</view>
			<view class="padding">
			    <input
			        type="digit"
			        :maxlength="6"
			        v-model="inviteCode"
			        placeholder="请输入邀请码"
			        class="input solids bg-white text-center"
					style="height: 100rpx;"
			    />
			</view>
			<view class="text-center text-red margin-top-sm" v-if="error">{{error}}</view>
			<!-- <view class="text-center text-red margin-top-sm" v-if="error">{{error}}</view> -->
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
				isShow:'',
				inviteCode:'',
				error:''
			}
		},
		props:{
			show:{
				default: () => {
				    return false;
				},
			}
		},
		created() {
			uni.$on('showCodeModal',()=>{
				this.isShow=true
			})
		},
		watch:{
			show(val){
				this.isShow=val
			}
		},
		methods:{
			hideModal() {
				this.inviteCode='';
				this.error="";
				this.isShow=false;
				this.$emit('hideModal');
			},
			confirmModal(){
				if (!this.inviteCode) {
				    let msg = "请输入邀请码";
				    this.toast(msg);
				    this.error = msg;
				    return;
				} else if (this.inviteCode.length < 6) {
				    let msg = "邀请码格式不正确";
				    this.toast(msg);
				    this.error = msg;
				    return;
				}
				let data={
					id:this.user.id,
					inviteCode:this.inviteCode
				}
				UserService.brokerUpdate(data,res=>{
					if(res.data.success){
						this.toast('验证成功!');
						this.hideModal();
						this.getTokenByOpenId();
					}else{
						let msg = res.data.message;
						this.toast(msg);
						this.error = msg;
					}
				})
			},
			// 获取用户信息
			getBrokerInfo(){
				UserService.getBrokerInfo(res=>{
					if(res.data.data){
						this.$store.commit('setUser',res.data.data)
					}
				})
			},
			getTokenByOpenId(){
				UserService.getTokenByOpenId(this.openid,res=>{
					if(res.statusCode==200){
						this.$store.commit('setToken',res.data.data.token)
						this.getBrokerInfo();
					}
				})
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
