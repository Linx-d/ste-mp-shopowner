<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">隐私政策</block>
		</cu-custom>
		<view class="padding">
			<app-loading v-if="loading" />
			<jyf-parser v-if="content !==''" :html="content" ref="article"></jyf-parser>
			<!-- <rich-text v-if="content !==''" >{{content}}</rich-text> -->
			<app-empty v-if="content ==''&& !loading" />
		</view>
	</view>
</template>

<script>
	import AgreementsService from '@/apis/agreements';
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default{
		data() {
			return {
				loading:false,
				content:''
			}
		},
		components:{
			jyfParser
		},
		mounted() {
			this.load()
		},
		methods:{
			load(){
				this.loading=true;
				let params='10000';
				AgreementsService.getAgreements(params,res=>{
					if(res.data){
						this.content=res.data.content;
					}
					this.loading=false;
				})
			}
		}
	}
</script>

<style>
</style>
