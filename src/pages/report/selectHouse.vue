<template>
	<view>
		<cu-custom bg-color="bg-white" is-back="true">
			<block slot="content" class="my-text-color-black text-bold">选择报备楼盘</block>
		</cu-custom>
		<view class="cu-bar search bg-white fixed" :style="tabStyle">
			<view class="action" @click="navTo('/pages/index/task/location/location')">
				<text>{{location.city=='定位中...'?'请选择城市':location.city}}</text>
				<text class="cuIcon-triangledownfill"></text>
			</view>
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @input="InputChange" :adjust-position="false" type="text" placeholder="搜索楼盘名称" confirm-type="search"></input>
			</view>
		</view>
	
		<button class="cu-btn bg-gradual-orange  my-btn" @click="confirm">确定({{idList.length}}/6)</button>
		
		<view class="padding-left padding-right" style="margin-top: 120rpx;">
			<checkbox-group>
				<label class="flex align-center align-centerradius shadow bg-white margin-top-sm padding" v-for="(item,index) in taskList" @click="checkboxChange(item)"
				 :key="index">
					<view class="margin-right">
						<checkbox style="transform:scale(0.7)" :value="item.id" :disabled='disabled && idList.indexOf(item.id) ==-1' :checked='idList.indexOf(item.id) !==-1' />
					</view>
					<view>{{item.house.name}}</view>
				</label>
			</checkbox-group>
		</view>
		<app-empty v-if="taskList.length==0" />
		<app-nomore v-if="nomore" />
	</view>
</template>

<script>
	import TaskService from "@/apis/task";
	export default {
		data() {
			return {
				nomore: false,
				taskList: [],
				page: 0,
				size: 15,
				total: 0,
				keyword: '',
				disabled:false,
				idList: [], //勾选楼盘id
			}
		},
		onLoad(option) {
			if(JSON.parse(option.idList).length>0){
				this.idList=JSON.parse(option.idList)
			}
		},
		mounted() {
		},
		onShow() {
			if(this.location.city !='定位中...'){
				this.loadTask();
			}
		},
		methods: {
			loadTask() {
			    let { size, keyword,page} = this;
			    let query = {
			        page,
			        size,
					keyword,
			        sort: "createTime,desc",
			        current: true,
			        city:this.location.city,
			    };
			
			    TaskService.query(query, (res) => {
			        if (res.data && res.data.data) {
						console.log(res.data);
			            let { totalElements, content } = res.data.data;
						this.total = totalElements;
			            this.taskList = this.page === 0 ? content : [...this.taskList, ...content];
			        } else {
			            this.toast("加载任务列表失败");
			        }
			        // 下拉刷新关闭
			        uni.stopPullDownRefresh();
			    });
			},
			checkboxChange(e) {
				if(this.idList.indexOf(e.id) == -1){
					if(this.disabled) return
					this.idList.push(e.id)
				}else{
					this.idList.splice(this.idList.indexOf(e.id),1)
				}
				if(this.idList.length >=6){
					this.disabled=true
				}else{
					this.disabled=false
				}
				console.log(this.idList);
			},
			InputChange(e) {
				this.page=0;
				this.keyword = e.detail.value;
				this.loadTask();
			},
			loadmore() {
				if ((this.page + 1) * this.size < this.total) {
					this.page += 1
					this.loadTask();
				} else if (!this.nomore) {
					this.nomore = true;
					this.toast("没有更多数据啦~");
				}
			},
			// 下拉
			onPullDownRefresh() {
				this.page = 0;
				this.loadTask();

			},
			// 上拉
			onReachBottom() {
				this.loadmore();
			},
			confirm(){
				uni.setStorageSync('idList',this.idList)
				this.navBack();
			}
		},
		computed: {
			tabStyle() {
				return `top:${this.CustomBar}px`;
			},
			location(){
				return this.$store.state.location
			}
		}
	}
</script>

<style scoped>
	.my-btn {
		bottom: 20rpx;
		z-index: 999;
		position: fixed;
		width: 80%;
		margin-left: 50%;
		transform: translateX(-50%);
	}
</style>
