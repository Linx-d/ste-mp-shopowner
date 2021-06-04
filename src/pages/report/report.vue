<template name="components">
	<view>
		<cu-custom bg-color="bg-white" :is-back="!isHome" :is-home="isHome">
			<block slot="content" class="my-text-color-black text-bold">报备</block>
		</cu-custom>
		<view class="padding" style="background-color:#FEF1E8;font-size: 24rpx;">
			请填写客户真实信息，后期因信息错误无法报备概不负责
		</view>
		<view class="bg-white padding">
			<view class="title text-bold margin-bottom">选择楼盘</view>
			<checkbox-group @change="checkboxChange">
				<label class="flex align-center margin-top" v-for="(item,index) in tasks" :key="index">
					<view class="margin-right">
						<checkbox style="transform:scale(0.7)" :value="item.id" :checked="idList.indexOf(item.id) !=-1" />
					</view>
					<view>{{item.house.name}}</view>
				</label>
			</checkbox-group>
			<button class="cu-btn block line-orange xl margin-top" @click="target">
				<text class="cuIcon-add"></text> 添加楼盘</button>
		</view>

		<view class="bg-white padding margin-top">
			<view class="title text-bold margin-bottom">选择代理商</view>
			<view class="flex justify-between margin-top" v-for="(item,index) in deveList" :key="index">
				<view class="title">{{item.house.name}}</view>
				<picker :value="agentTypeArr[index]" :range="item.dataList" range-key="agentName" @change="agentTypeChange($event, item, index)">
					<view class="picker cuIcon-left">
						<!-- {{ item.dataList.length>0? item.dataList[agentTypeIndex].agentName:''}} -->
						{{ agentTypeArr[index] > -1 ? item.dataList[agentTypeArr[index]].agentName : "" }}
						<view class="cuIcon-right margin-left-sm"></view>
					</view>
				</picker>
			</view>
		</view>
		<form>
			<view class="cu-form-group margin-top">
				<text style="color: #FA5151;font-size: 32rpx;">*</text>
				<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report2.png"
				 mode=""></image>
				<input placeholder="请填写或选择客户姓名" :focus="isFocus" name="input" v-model="name" />
				<view class="flex-row align-center" @click="selectName">
					<image style="width: 36rpx;height: 36rpx;" src="@/static/img/report3.png" mode=""></image>
					<view class="cuIcon-right margin-left-sm"></view>
				</view>
			</view>
			<view class="cu-form-group">
				<text style="color: #FA5151;font-size: 32rpx;">*</text>
				<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report4.png"
				 mode=""></image>
				<view class="flex-1">
					<radio-group @change="radioChange">
						<radio class="margin-right-sm" value="0" :checked="sex == 0"></radio>先生
						<radio class="margin-left-sm margin-right-sm" value="1" :checked="sex == 1"></radio>女士
					</radio-group>
				</view>
			</view>
			<view class="cu-form-group">
				<text style="color: #FA5151;font-size: 32rpx;">*</text>
				<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report5.png"
				 mode=""></image>

				<input placeholder="请填写客户手机号" type="number" maxlength="11" name="input" v-model="phone1" />
			</view>

			<view class="cu-form-group" v-if="phone1">
				<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report5.png"
				 mode=""></image>
				<text>(选填)</text>
				<input placeholder="请填写客户手机号" type="number" maxlength="11" name="input" v-model="phone2" />
			</view>
			<view class="cu-form-group" v-if="phone2">
				<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report5.png"
				 mode=""></image>
				<text>(选填)</text>
				<input placeholder="请填写客户手机号" type="number" maxlength="11" name="input" v-model="phone3" />
			</view>

			<view class="cu-form-group margin-top">
				<view class="title">意向强度</view>
				<uni-rate v-model="intention" @change="onChange" />
			</view>
			<view class="cu-form-group">
				<view class="title">预计到访时间：</view>
				<picker mode="date" :value="date" :start="dateStart" :end="dateEnd" @change="dateChange">
					<view class="picker">{{ date }}</view>
				</picker>
				<picker mode="time" :value="time" :start="timeStart" :end="timeEnd" @change="timeChange">
					<view class="picker">{{ time }}</view>
				</picker>
			</view>
			<view class="cu-form-group ">
				<view class="title">需求面积(选填)</view>
				<view class="flex-row align-center">
					<input placeholder="最小面积" type="number" name="input" maxlength="5" v-model="areaStart" style="width:180rpx" class="text-right" />
					<span class="padding-lr">至</span>
					<input placeholder="最大面积" type="number" name="input" maxlength="5" v-model="areaEnd" style="width:180rpx" />
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">需求业态</view>
				<picker :value="houseTypeIndex" :range="houseTypes" @change="houseTypeChange">
					<view class="picker cuIcon-left">
						{{ houseTypeIndex >= 0 ? houseTypes[houseTypeIndex] : "请选择" }}
						<view class="cuIcon-right margin-left-sm"></view>
					</view>
				</picker>
			</view>

			<view class="cu-form-group margin-top">
				<textarea maxlength="500" v-model="remark" placeholder="请输入备注"></textarea>

			</view>

			<view class="padding flex flex-direction margin-top">
				<button class="cu-btn bg-blue lg" @click="verifyPhone" v-if="user">报备</button>
				<button class="cu-btn bg-green lg" v-else @getuserinfo="onUserInfo" open-type="getUserInfo" lang="zh_CN">微信授权</button>
			</view>
		</form>

		<view :class="modal ? 'cu-modal show':'cu-modal'">
			<view class="cu-dialog">
				<view class="bg-white padding-lg">
					<h4>欢迎加入</h4>
					<view class="padding">
						<button class="cu-btn bg-blue margin-top lg" @getphonenumber="onPhoneNumber" open-type="getPhoneNumber">授权手机号完成注册</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 剪切板弹框 -->
		<app-clipboard :show="clipboardShow" :phoneNums="phoneNums" :nameNums="nameNums" @confirmModal="confirmModal"></app-clipboard>

	</view>
</template>

<script>
	import Service from "@/apis/service";
	import houseService from "@/apis/house";
	import ReportService from "@/apis/report";
	import ClientService from "@/apis/client";
	import TaskService from "@/apis/task";
	import UserService from "@/apis/user";
	import AnonymouseService from "@/apis/anonymous";
	import DictService from "@/apis/dict";
	import {
		uniRate
	} from '@dcloudio/uni-ui'

	import * as Const from "@/common/const";

	export default {
		data() {
			return {
				loading: false,
				isFocus: true,

				page: 0,
				size: 10,
				total: 0,
				taskCount: 0, //报备循环计数
				phoneCount: 0, //查询电话循环计数

				/// task
				taskList: [], //所有楼盘
				tasks: [], //页面显示楼盘
				task: null,
				taskIndex: -1,
				taskId: '',
				idList: [], //已选择楼盘id
				taskMap: new Map(),

				deveList: [],

				/// dict
				houseTypeIndex: -1,
				// agentTypeArr: [],

				/// client
				client: null,
				clientId: '', //客户id
				name: "",
				sex: 0,
				phone1: "",
				phone2: "",
				phone3: "",
				areaStart: null,
				areaEnd: null,
				remark: null,
				intention: 3,
				/// report

				errorTasks: [], //报备失败任务id
				reportId: [],
				time: (new Date().getHours()) + 3 + ':00',
				timeStart: "08:00",
				timeEnd: "00:00",

				date: this.formatDate(
					new Date(new Date().getTime())
					// new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
				),
				dateStart: this.formatDate(),
				dateEnd: this.formatDate(
					new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
				),

				// 匿名邀请的
				step: 0,
				modal: false,


				//剪切板
				clipboardShow: false,
				phoneNums: [],
				nameNums: ''
			};
		},
		components: {
			uniRate
		},
		onLoad(options) {
			if (options.taskId) {
				this.idList.push(options.taskId);
			}
			this.inviteCode = options.inviteCode;

		},
		onShow() {
			this.getStorageIdList();
			this.getStorageClients();

		},
		mounted() {
			this.init();
			this.getClipboard();
		},
		computed: {
			isHome() {
				let pages = getCurrentPages();

				return pages.length === 1;
			},
			me() {
				return this.$store.state.me;
			},
			unionId() {
				return this.$store.state.unionId;
			},
			user() {
				return this.$store.state.user;
			},
			taskIds() {
				return this.$store.state.taskIds;
			},
			dicts() {
				return this.$store.state.dicts;
			},
			houseTypes() {
				if (this.dicts.length > 0) {
					return this.dicts
						.filter((i) => i.id === Const.YETAI)[0]
						.values.map((i) => i.value);
				}
			},
			brokerHref() {
				return this.user ?
					Service.URI_API + "/rest/brokers/" + this.user.id :
					null;
			},
			taskHref() {
				return this.task ?
					Service.URI_API + "/rest/tasks/" + this.task.id :
					null;
			},
			dateTime() {
				return this.date + " " + this.time + ":00";
			},
			phone() {
				if (this.phone3) {
					return this.phone1 + ',' + this.phone2 + ',' + this.phone3
				} else if (this.phone2) {
					return this.phone1 + ',' + this.phone2
				} else {
					return this.phone1
				}

			},
			agentTypeArr() {
				return this.deveList.map(() => -1)
			}
		},
		watch: {
			idList(val) {
				let arr = this.tasks.filter(res => {
					return val.indexOf(res.id) > -1
				})
				arr.map(res => {
					this.houseAgentQuery(res)
				})
				this.deveList = arr
			}
		},
		methods: {
			houseAgentQuery(task) {
				let data = {
					houseId: task.house.id,
					size: 100
				}
				houseService.houseAgentQuery(data, res => {
					if (res.data.success) {
						this.$set(task, 'dataList', res.data.data.content);
						this.$set(task, 'houseAgentId', res.data.data.content.length > 0 ? res.data.data.content[0].id : '')
						console.log(task);
					}
				})
			},
			init() {
				this.preLoad();
				this.loadTask();
			},
			//词典
			preLoad() {
				DictService.getAll((res) => {
					this.hideLoading();
					if (res.statusCode === 200) {
						this.$store.commit("setDicts", res.data._embedded.dicts);
					}
				});
			},
			//获取剪切板内容
			getClipboard() {
				uni.getClipboardData({
					success: (res) => {
						if (res.data !== this.$store.state.clipboardContent) {
							this.$store.commit("setclipboardContent", res.data);
							let str = res.data;
							let regx = /(1[3|4|5|6|7|8|9][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
							let nameReg =
								/((赵|钱|孙|李|周|吴|郑|王|冯|陈|楮|卫|蒋|沈|韩|杨|朱|秦|尤|许|何|吕|施|张|孔|曹|严|华|金|魏|陶|姜|戚|谢|邹|喻|柏|水|窦|章|云|苏|潘|葛|奚|范|彭|郎|鲁|韦|昌|马|苗|凤|花|方|俞|任|袁|柳|酆|鲍|史|唐|费|廉|岑|薛|雷|贺|倪|汤|滕|殷|罗|毕|郝|邬|安|常|乐|于|时|傅|皮|卞|齐|康|伍|余|元|卜|顾|孟|平|黄|和|穆|萧|尹|姚|邵|湛|汪|祁|毛|禹|狄|米|贝|明|臧|计|伏|成|戴|谈|宋|茅|庞|熊|纪|舒|屈|项|祝|董|梁|杜|阮|蓝|闽|席|季|麻|强|贾|路|娄|危|江|童|颜|郭|梅|盛|林|刁|锺|徐|丘|骆|高|夏|蔡|田|樊|胡|凌|霍|虞|万|支|柯|昝|管|卢|莫|经|房|裘|缪|干|解|应|宗|丁|宣|贲|邓|郁|单|杭|洪|包|诸|左|石|崔|吉|钮|龚|程|嵇|邢|滑|裴|陆|荣|翁|荀|羊|於|惠|甄|麹|家|封|芮|羿|储|靳|汲|邴|糜|松|井|段|富|巫|乌|焦|巴|弓|牧|隗|山|谷|车|侯|宓|蓬|全|郗|班|仰|秋|仲|伊|宫|宁|仇|栾|暴|甘|斜|厉|戎|祖|武|符|刘|景|詹|束|龙|叶|幸|司|韶|郜|黎|蓟|薄|印|宿|白|怀|蒲|邰|从|鄂|索|咸|籍|赖|卓|蔺|屠|蒙|池|乔|阴|郁|胥|能|苍|双|闻|莘|党|翟|谭|贡|劳|逄|姬|申|扶|堵|冉|宰|郦|雍|郤|璩|桑|桂|濮|牛|寿|通|边|扈|燕|冀|郏|浦|尚|农|温|别|庄|晏|柴|瞿|阎|充|慕|连|茹|习|宦|艾|鱼|容|向|古|易|慎|戈|廖|庾|终|暨|居|衡|步|都|耿|满|弘|匡|国|文|寇|广|禄|阙|东|欧|殳|沃|利|蔚|越|夔|隆|师|巩|厍|聂|晁|勾|敖|融|冷|訾|辛|阚|那|简|饶|空|曾|毋|沙|乜|养|鞠|须|丰|巢|关|蒯|相|查|后|荆|红|游|竺|权|逑|盖|益|桓|公|万俟|司马|上官|欧阳|夏侯|诸葛|闻人|东方|赫连|皇甫|尉迟|公羊|澹台|公冶|宗政|濮阳|淳于|单于|太叔|申屠|公孙|仲孙|轩辕|令狐|锺离|宇文|长孙|慕容|鲜于|闾丘|司徒|司空|丌官|司寇|仉|督|子车|颛孙|端木|巫马|公西|漆雕|乐正|壤驷|公良|拓拔|夹谷|宰父|谷梁|晋|楚|阎|法|汝|鄢|涂|钦|段干|百里|东郭|南门|呼延|归|海|羊舌|微生|岳|帅|缑|亢|况|后|有|琴|梁丘|左丘|东门|西门|商|牟|佘|佴|伯|赏|南宫|墨|哈|谯|笪|年|爱|阳|佟|第五|言|福)[\u4E00-\u9FFF]{1,2})/g;
							this.phoneNums = str.match(regx) ? str.match(regx).splice(0, 3) : [];
							this.nameNums = str.match(nameReg) ? str.match(nameReg)[0] : ''
							if (this.phoneNums.length == 0 && this.nameNums == '') return
							this.clipboardShow = true;
							this.isFocus = false
						}
					}
				});
			},
			radioChange(e) {
				this.sex = e.detail.value
			},
			confirmModal() {
				if (this.phoneNums) {
					this.phone1 = this.phoneNums[0] ? this.phoneNums[0] : '';
					this.phone2 = this.phoneNums[1] ? this.phoneNums[1] : '';
					this.phone3 = this.phoneNums[2] ? this.phoneNums[2] : '';
				}
				if (this.nameNums) {
					this.name = this.nameNums;
				}
				this.clipboardShow = false;
			},
			loadTask() {
				if (!this.user && this.inviteCode) {
					this.loadAnonymouseTask();
				} else {
					this.loading = true;
					TaskService.findAllTask({
							size: 100,
							page: 0
						},
						(res) => {
							this.loading = false;
							if (res.statusCode === 200) {
								this.taskList = res.data._embedded.tasks || [];
								if (this.taskList.length > 0) {
									this.findIdArr();
									// this.task = this.tasks[this.taskIndex];
								}
							} else {
								this.toast("获取任务失败");
							}
						}
					);
				}
			},

			target() {
				this.navTo('/pages/report/selectHouse?idList=' + JSON.stringify(this.idList));
			},
			// 根据id查找楼盘
			findIdArr() {
				this.tasks = this.taskList.filter(res => {
					return this.idList.indexOf(res.id) != -1
				})
				let arr = this.tasks.filter(res => {
					return this.idList.indexOf(res.id) > -1
				})
				arr.map(res => {
					this.houseAgentQuery(res)
				})
				this.deveList = arr
			},
			getStorageClients() {
				if (uni.getStorageSync('clients')) {
					let clients = uni.getStorageSync('clients');
					console.log(clients);
					uni.removeStorageSync('clients')
					let phone = clients.phone.split(',');
					let i = -1;
					this.houseTypes.map((res, index) => {
						if (res == clients.propertyType) {
							i = index
						}
					})
					this.name = clients.name;
					this.sex = clients.sex;
					this.phone1 = phone[0] ? phone[0] : '';
					this.phone2 = phone[1] ? phone[1] : '';
					this.phone3 = phone[2] ? phone[2] : '';
					this.intention = clients.intention;
					this.houseTypeIndex = i;
					this.areaStart = clients.areaStart;
					this.areaEnd = clients.areaEnd
				}
			},
			//获取缓存中idList
			getStorageIdList() {
				if (uni.getStorageSync('idList')) {
					this.idList = uni.getStorageSync('idList');
					uni.removeStorageSync('idList')
					this.findIdArr();
					console.log(this.idList);
				}
			},
			//匿名获取任务
			loadAnonymouseTask() {
				AnonymouseService.getTask(this.taskId, (res) => {
					this.loading = true;
					this.loading = false;
					if (res.data && res.data.data) {
						let item = res.data.data;
						this.tasks = [item];
						this.task = item;
						this.taskIndex = 0;
					}
				});
			},
			checkboxChange(e) {
				this.idList = e.detail.value
			},
			houseTypeChange(e) {
				this.houseTypeIndex = e.detail.value;
			},
			agentTypeChange(e, task, index) {
				console.log(index, 'index');
				console.log(e.detail.value, 'e.detail.value');
				this.agentTypeArr[index] = parseInt(e.detail.value);
				console.log(this.agentTypeArr, 'agentTypeArr');
				console.log(this.agentTypeArr[index], 'agentTypeArr[index]');
				console.log(task.dataList[this.agentTypeArr[index]].agentName, 'item.dataList[agentTypeArr[index]].agentName');
				this.$set(task, 'houseAgentId', task.dataList[e.detail.value].id)
				console.log(task);
			},
			dateChange(e) {
				this.date = e.detail.value;
			},
			timeChange(e) {
				if (e.detail.value < this.timeStart) {
					this.toast("请重新选择时间");
				} else {
					this.time = e.detail.value;
				}
			},
			//评分
			onChange(e) {
				this.intention = e.value
			},
			sumbit() {
				// TODO 校验

				let {
					name,
					phone,
					task
				} = this;

				if (this.idList.length == 0) {
					this.toast("请先选择项目");
					return;
				}

				if (!name || name.length === 0) {
					this.toast("请填写姓名");
					return;
				}
				for (let i = 0; i < this.deveList.length; i++) {
					console.log('11111111',this.deveList[i]);
					if(this.deveList[i].houseAgentId==''){
						this.toast("请选择开发商");
						return;
					}
				}

				// TODO: 完善
				this.confirm("您确定要提交报备信息吗？", (ok) => {
					if (ok) {
						// 1. 保存客户
						// 2. 保存报备信息

						this.showLoading(() => {
							this.saveClient((client, deveListItem) => {

								if (client) {
									let report = {
										client: Service.URI_API +
											"/rest/clients/" +
											client.id,
										task: Service.URI_API + "/rest/tasks/" + deveListItem.id,
										broker: this.brokerHref,
										appointment: this.dateTime, //预计到访时间
										remark: this.remark,
										houseAgentId: deveListItem.houseAgentId
									};
									ReportService.saveReport(report, (res) => {
										this.hideLoading();
										this.taskCount += 1;
										if (res.statusCode == 201) {
											this.reportId.push(res.data.id);
										} else {
											this.toast(
												res.data.message || "报备失败"
											);
											this.errorTasks.push({
												msg: res.data.message,
												id: taskid
											})
										}
										//所有楼盘报备完成
										console.log('this.taskCount' + this.taskCount);
										console.log('this.idList.length' + this.idList.length);
										if (this.taskCount == this.idList.length) {
											if (this.reportId.length !== 0) {
												this.navTo(
													`/pages/report/reportInfo?reportId=${JSON.stringify(this.reportId)}&errorTasks=${JSON.stringify(this.errorTasks)}`
												);
											}
										}
									});
								} else {
									this.hideLoading();
									this.toast("保存客户信息失败");
								}
							});
						});
					}
				});
			},

			saveClient(callback) {
				let {
					name,
					sex,
					phone,
					areaStart,
					areaEnd,
					houseTypeIndex,
					intention
				} = this;

				let propertyType =
					houseTypeIndex >= 0 ? this.houseTypes[houseTypeIndex] : null;
				let data = {
					keyword: this.phone,
					brokerId: this.user.id,

				}

				let client = {
					name,
					sex,
					phone,
					areaStart,
					areaEnd,
					propertyType,
					intention
				};
				client.broker = this.brokerHref;

				if (this.clientId !== '') {

					//TODO: 循环提交
					client.id = this.clientId
					for (let i = 0; i < this.deveList.length; i++) {
						callback(client, this.deveList[i]);
					}
				} else {
					console.log('保存');
					// 保存
					ClientService.save(client, (res) => {
						if (res.statusCode === 201) {
							this.client = res.data;
							for (let i = 0; i < this.deveList.length; i++) {
								callback(this.client, this.deveList[i]);
							}
						} else {
							callback(false);
						}
					});
				}
			},
			verifyPhone() {
				var myreg = /^(1[3-9])\d{9}$/;
				if (!this.phone) {
					this.toast("请填写正确手机号");
					return;
				} else if (this.phone1 && !myreg.test(this.phone1)) {
					this.toast("手机号格式错误");
					return;
				} else if (this.phone2 && !myreg.test(this.phone2)) {
					this.toast("手机号格式错误");
					return;
				} else if (this.phone3 && !myreg.test(this.phone3)) {
					this.toast("手机号格式错误");
					return;
				}
				if (this.phone2) {
					if (this.phone1 === this.phone2 || this.phone1 === this.phone3 || this.phone2 === this.phone3) {
						this.toast("手机号不能重复");
						return;
					}
				}

				// 点击前重置
				this.clientId = '';
				this.phoneCount = 0;
				this.taskCount = 0;
				this.reportId = [];
				this.errorTasks = [];

				let phones = this.phone.split(',')
				for (let i = 0; i < phones.length; i++) {
					this.byBrokerIdAndPhone(phones[i], phones.length)
				}
			},
			//查询手机号是不是新客户
			byBrokerIdAndPhone(iphone, iphoneLength) {
				if (iphone.length !== 11) return
				let data = {
					brokerId: this.user.id,
					keyword: iphone
				}
				ClientService.query(data, (res) => {

					if (res.data.data.content.length > 0) {
						this.clientId = res.data.data.content[0].id
					}
					this.phoneCount += 1
					// 所有电话查询完成
					console.log(this.phoneCount, iphoneLength);
					if (this.phoneCount == iphoneLength) {
						console.log(this.clientId);
						this.sumbit();
					}

				});
			},
			onUserInfo(e) {
				let {
					encryptedData,
					iv,
					userInfo
				} = e.detail;

				if (userInfo) {
					this.showLoading(() => {
						this.weixinLogin((res) => {
							this.hideLoading();
							this.decryptUserInfo(this.me.sessionKey, encryptedData, iv, (res) => {
								if (res) {
									this.$store.commit("setUnionId", res.unionId);
									this.saveWxUser(res);
								}
							});
						});
					});
				} else {
					this.toast("请统一授权获取微信信息");
				}
			},
			saveWxUser(wxUser) {
				UserService.saveWxUser(wxUser, (res) => {

					if (res.data.success) {
						this.$store.commit("setMe", wxUser);

						// 如果用户未注册获取手机号注册
						if (!this.user) {
							this.modal = true;
						} else {
							this.loadTask()
						}
					}
				});
			},
			onPhoneNumber(e) {
				let {
					encryptedData,
					iv
				} = e.detail;

				let key = this.me.sessionKey;

				this.showLoading(() => {
					UserService.decryptPhone(key, encryptedData, iv, (res) => {
						this.hideLoading();
						if (res.data.success) {
							let {
								phoneNumber
							} = res.data.data;
							this.toSave(phoneNumber);
						} else {
							this.toast("获取失败", "error");
						}
					});
				});
			},

			// 注册
			toSave(phone) {
				let {
					nickName,
					openId
				} = this.me;
				let data = {
					name: nickName,
					phone,
					inviteCode: this.inviteCode,
					wx: {
						openId,
					},
				};

				UserService.registerBroker(data, (res) => {
					this.hideLoading();
					if (res.data && res.data.success) {
						let user = res.data.data;
						this.$store.commit("setUser", user);

						// 马上获取一次token
						UserService.getTokenByOpenId(openId, (res) => {
							if (res.data && res.data.data) {
								let token = res.data.data.token;
								this.$store.commit("setToken", token);
								this.toast("注册成功", "success");
								this.modal = false;
								// 接任务
								// this.toAcceptTask();
							} else {
								this.tost("注册异常", "error");
							}
						});
					} else {
						this.toast("注册失败", "error");
					}
				});
			},
			selectName() {
				if (this.user) {
					this.navTo('/pages/report/selectClient')
				} else {
					this.toast('请授权登录!');
				}

			},
			toAcceptTask() {
				let params = {
					task: this.taskHref,
					broker: this.brokerHref,
				};

				TaskService.acceptTask(params, (res) => {
					if (res.statusCode === 201) {
						this.modal = null;
						this.task.accepted = true;
						this.$store.commit("putTaskId", [this.task.id]);
						//this.toast("接收成功", "success");

						// 2020.12.14 注册完成之后，直接提交报备信息
						this.sumbit();

					}
				});
			},
		},
	};
</script>

<style lang="less">
	.page {
		height: 100vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}

	.cu-form-group picker {
		padding-right: 0;
	}

	.cu-form-group picker::after {
		content: none;
	}

	.picker {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
	}
</style>
