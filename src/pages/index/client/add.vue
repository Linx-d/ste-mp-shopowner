<template>
	<view class="container">
		<cu-custom bg-color="bg-white" :isBack="true">
			<block slot="content" class="my-text-color-black text-bold">{{type=='add'?'新增客户':'修改信息'}}</block>
		</cu-custom>
		<!-- 客户信息 -->
		<view class="clientMsg">
			<view class="padding">客户信息（必填）</view>
			<form class="content">
				<view class="cu-form-group">
					<text  style="color: #FA5151;font-size: 32rpx;">*</text>
					<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report2.png" mode=""></image>
					<input placeholder="请填写或选择客户姓名" focus name="input" v-model="name"  />
				</view>
				<view class="cu-form-group ">
					<text  style="color: #FA5151;font-size: 32rpx;">*</text>
					<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report4.png" mode=""></image>
					<view class="flex-1">
						<radio-group @change="radioChange" >
							<radio class="margin-right-sm" value="0" :checked="sex == 0"></radio>先生
							<radio class="margin-left-sm margin-right-sm" value="1" :checked="sex == 1"></radio>女士
						</radio-group>
					</view>
				</view>
				<view class="cu-form-group ">
					<text  style="color: #FA5151;font-size: 32rpx;">*</text>
					<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report5.png" mode=""></image>
					
					<input placeholder="请填写客户手机号" type="number" maxlength="11" name="input" v-model="phone1" />
				</view>
				<view class="cu-form-group " v-if="phone1">
					<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report5.png" mode=""></image>
					<text>(选填)</text>
					<input placeholder="请填写客户手机号"  type="number" maxlength="11" name="input" v-model="phone2" />
				</view>
				<view class="cu-form-group " v-if="phone2">
					<image class="margin-right" style="width: 36rpx;height: 36rpx;margin-left: 4rpx;" src="@/static/img/report5.png" mode=""></image>
					<text>(选填)</text>
					<input placeholder="请填写客户手机号"  type="number" maxlength="11" name="input" v-model="phone3" />
				</view>
			</form>
		</view>
		<!-- 购买意愿 -->
		<view class="clientMsg">
			<view class="padding">购买意愿（选填）</view>
			<form class="content">
				<view class="cu-form-group">
					<view class="title">意向强度</view>
					<uni-rate :size="18" v-model="intention" />
				</view>
				<view class="cu-form-group ">
					<view class="title">接受总价</view>
					<input placeholder="请输入" name="input" type="number" v-model="acceptPriceEnd" />
					<view>万</view>
				</view>
				<view class="cu-form-group ">
					<view class="title">需求面积</view>
					<view class="flex-row align-center">
						<input placeholder="最小面积" type="number" name="input" maxlength="5" v-model="areaStart" style="width:180rpx" class="text-right" />
						<span class="padding-lr">至</span>
						<input placeholder="最大面积" type="number" name="input" maxlength="5" v-model="areaEnd" style="width:180rpx" />
					</view>
				</view>
				<view class="cu-form-group ">
					<view class="title">户 型</view>
					<picker @change="roomChange" :value="roomIndex" :range="room">
						<view class="picker">
							{{roomIndex >= 0 ? room[roomIndex] : "请选择"}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">需求业态</view>
					<picker @change="propertyTypeChange" :value="propertyTypeIndex" :range="propertyType">
						<view class="picker">
							{{ propertyTypeIndex >= 0 ? propertyType[propertyTypeIndex] : "请选择" }}
						</view>
					</picker>
				</view>
			</form>
		</view>
		<!-- 详细信息 -->
		<view class="clientMsg">
			<view class="padding">详细信息（选填）</view>
			<form class="content">
				<view class="cu-form-group">
					<view class="title">家庭结构</view>
					<picker @change="familyChange" :value="familyIndex" :range="family">
						<view class="picker">
							{{ familyIndex >= 0 ? family[familyIndex] : "请选择" }}
						</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">家庭居住人口</view>
					<input placeholder="请输入" name="input" v-model="people" />
				</view>
				<view class="cu-form-group ">
					<view class="title">购买目的</view>
					<picker @change="reasonChange" :value="reasonIndex" :range="reason">
						<view class="picker">
							{{ reasonIndex >= 0 ? reason[reasonIndex] : "请选择" }}
						</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">有无私家车</view>
					<view>
						<radio-group @change="carRadioChange">
							<radio class="margin-right-sm" :value="true" :checked="car == 'true'"></radio>有
							<radio class="margin-left-sm margin-right-sm" :value="false" :checked="car == 'false'"></radio>无
						</radio-group>
					</view>
				</view>
				<view class="cu-form-group ">
					<view class="title">现居住地</view>
					<input placeholder="请输入" name="input" v-model="address" type="text" />
				</view>
			</form>
		</view>
		<view>
			<button @click='saveClient'class="margin my-bg-color-blue text-white">保存</button>
		</view>
	</view>
</template>

<script>
	import {
		uniRate
	} from '@dcloudio/uni-ui'
	import ClientService from "@/apis/client";
	import * as Const from "@/common/const";
	import Service from "@/apis/service";
	export default {
		data() {
			return {
				type: 'add', //修改&添加
				id: '',
				phone1: '',
				phone2: '',
				phone3: '',
				name: '',
				sex: 0,
				intention: 5,
				acceptPriceEnd: '',
				areaStart: '',
				areaEnd: '',
				propertyTypeIndex: -1,
				roomIndex: -1,
				familyIndex: -1,
				reasonIndex: -1,
				car: '',
				address: '',
				people: ''

			}
		},
		components: {
			uniRate
		},
		onLoad(option) {
			if (option.type == 'update') {
				let client = uni.getStorageSync('clients');
				if (client) {
					let arr = client.phone.split(',');
					this.id = client.id;
					this.phone1 = arr[0];
					this.phone2 = arr[1] ? arr[1] : '';
					this.phone3 = arr[2] ? arr[2] : '';
					this.name = client.name;
					this.sex = client.sex;
					this.intention = client.intention;
					this.acceptPriceEnd = client.acceptPriceEnd;
					this.areaEnd = client.areaEnd;
					this.areaStart = client.areaStart;
					this.propertyTypeIndex = this.propertyType.indexOf(client.propertyType);
					this.roomIndex = this.room.indexOf(client.room);
					this.familyIndex = this.family.indexOf(client.family);
					this.reasonIndex = this.reason.indexOf(client.reason);
					this.car = client.car;
					this.address = client.address;
					this.people = client.people;
					uni.clearStorageSync('clients')
				}
			}
			this.type = option.type
		},
		mounted() {},
		methods: {
			propertyTypeChange(e) {
				this.propertyTypeIndex = e.detail.value;
			},
			roomChange(e) {
				this.roomIndex = e.detail.value;
			},
			radioChange(e){
				this.sex=e.detail.value
			},
			carRadioChange(e){
				this.car=e.detail.value
			},
			familyChange(e) {
				this.familyIndex = e.detail.value;
			},
			reasonChange(e) {
				this.reasonIndex = e.detail.value;
			},
			// 保存
			saveClient() {
				let {
					id,
					name,
					sex,
					phone,
					areaStart,
					areaEnd,
					intention,
					acceptPriceEnd,
					car,
					address,
					people
				} = this;
				let room = this.roomIndex == -1 ? '' : this.room[this.roomIndex];
				let propertyType = this.propertyTypeIndex == -1 ? '' : this.propertyType[this.propertyTypeIndex];
				let family = this.familyIndex == -1 ? '' : this.family[this.familyIndex];
				let reason = this.reasonIndex == -1 ? '' : this.reason[this.reasonIndex];

				let client = {
					id,
					name,
					sex,
					phone,
					areaStart,
					areaEnd,
					room,
					propertyType,
					intention,
					acceptPriceEnd,
					family,
					reason,
					car,
					address,
					people
				}
				client.broker = this.brokerHref;

				if (this.name == '') {
					this.toast("请填姓名");
					return;
				}

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

				this.confirm("您确定要保存吗？", (ok) => {
					if (ok) {
						ClientService.save(client, (res) => {
							if (res.statusCode === 201) {
								this.toast('保存成功!')
								setTimeout(function() {
									uni.navigateBack(-1)
								}, 500)
							}else{
								this.toast(res.data.message)
							}
						});
					}
				})
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
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
			dicts() {
				return this.$store.state.dicts;
			},
			propertyType() {
				if (this.dicts.length > 0) {
					return this.dicts
						.filter((i) => i.id === Const.YETAI)[0]
						.values.map((i) => i.value);
				}
			},
			room() {
				if (this.dicts.length > 0) {
					return this.dicts
						.filter((i) => i.id === Const.ROOM)[0]
						.values.map((i) => i.value);
				}
			},
			family() {
				if (this.dicts.length > 0) {
					return this.dicts
						.filter((i) => i.id === Const.FAMILY_TYPE)[0]
						.values.map((i) => i.value);
				}
			},
			reason() {
				if (this.dicts.length > 0) {
					return this.dicts
						.filter((i) => i.id === Const.BUY_TYPE)[0]
						.values.map((i) => i.value);
				}
			},
			brokerHref() {
				return this.user ?
					Service.URI_API + "/rest/brokers/" + this.user.id :
					null;
			},
		}
	}
</script>

<style>

</style>
