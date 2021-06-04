<template>
	<view class="task-list">
		<view class="margin-top" v-if="rows.length > 0">
			<app-task-item v-for="item in rows" :key="item.id" :item="item" />
		</view>
		<app-empty v-else-if="!loading" />

		<app-loading v-if="loading" />

		<app-nomore v-if="nomore" />
	</view>
</template>

<script>
	import Service from "@/apis/service.js";
	import TaskService from "@/apis/task";
	import UserService from "@/apis/user";

	export default {
		props: {
			keyword: {
				type: String,
				default: () => '',
			},
			params: {
				type: Object,
				default: () => {
					return {
						city: '',
						sign: 1,
						sortType:'',
						maxPrice: '',
						maxRoom: '',
						maxUnitPrice: '',
						minPrice: '',
						minRoom: '',
						minUnitPrice: ''
					}
				}
			}
		},
		data() {
			return {
				modalName: null,

				nomore: false,

				page: 0,
				size: 10,
				total: 0,
				loading: false,
				rows: [],

				brokerId: "",
				taskId: "",

				city: '',
				isStreets: 1 //市级查询1 区域查询 2  街道查询 3
			};
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			taskIds() {
				return this.$store.state.taskIds;
			},
			location() {
				return this.$store.state.location;
			}
		},
		watch: {
			taskIds() {
				this.$nextTick(() => {
					this.remapTask();
				});
			},
			params() {
				this.load(0);
			},
			

		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				if (this.location.city !== '定位中...') {
					this.reload();
				}
			},
			getBrokerTaskId(callback) {
				TaskService.getBrokerTaskId(this.user.id, (res) => {
					if (res.data) {
						let taskIds = res.data.data || [];
						this.$store.commit("putTaskId", taskIds);
					}
					callback();
				});
			},
			reload() {
				this.getBrokerTaskId(() => {
					this.load(0);
				});
			},
			loadmore() {
				if ((this.page + 1) * this.size < this.total) {
					this.load(this.page + 1);
				} else if (!this.nomore) {
					this.nomore = true;
					this.toast("没有更多数据啦~");
				}
			},
			load(page) {
				if (this.loading) return;

				let {
					size,
					location,
					keyword
				} = this;
				let {
					city,
					sign,
					sortType,
					maxPrice,
					maxRoom,
					maxUnitPrice,
					minPrice,
					minRoom,
					minUnitPrice
				} = this.params
				let query = {
					page,
					size,
					sort:sortType,
					current: true,
					keyword,
					city: sign == 1? city ? city : this.location.city : '',
					district: sign == 2 ? city : '',
					street:sign == 3  ?city : '',
					maxPrice:maxPrice=='不限'?'':maxPrice,
					maxRoom:maxRoom=='不限'?'':maxRoom,
					maxUnitPrice:maxUnitPrice=='不限'?'':maxUnitPrice,
					minPrice:minPrice=='不限'?'':minPrice,
					minRoom:minRoom=='不限'?'':minRoom,
					minUnitPrice:minUnitPrice=='不限'?'':minUnitPrice,
				};
				this.loading = true;
				if (page === 0) {
					this.nomore = false;
				}

				TaskService.query(query, (res) => {
					this.loading = false;
					if (res.data && res.data.data) {
						let {
							totalElements,
							content
						} = res.data.data;
						let rows = content.map((i) => {
							i.accepted = this.taskIds.indexOf(i.id) >= 0;

							return i;
						});
						this.total = totalElements;
						this.rows = page === 0 ? rows : [...this.rows, ...rows];
					} else {
						this.toast("加载任务列表失败");
					}
					// 下拉刷新关闭
					uni.stopPullDownRefresh();
				});
			},
			remapTask() {
				let rows = [
					...this.rows.map((i) => {
						i.accepted = this.taskIds.indexOf(i.id) >= 0;
						return i;
					}),
				];
			},
		},
	};
</script>
