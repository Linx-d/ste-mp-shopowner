<template>
	<view>
		<cu-custom bg-color="bg-gradual-blue" :is-back="true">
		    <text slot="content">{{title}}</text>
		</cu-custom>
		<view class="flex justify-center align-center margin-top">
			<view class="fixed" style="padding-top: 180upx;">
				<scroll-view scroll-x class="bg-white nav text-center">
					<view
						class="cu-item text-bold"
						:class="index == TabCur ? 'text-green cur' : ''"
						v-for="(item, index) in navData"
						:key="index"
						@tap="tabSelect"
						:data-id="index"
					>
						{{ item }}
					</view>
				</scroll-view>
				<view class="flex justify-center align-center margin-top-sm">
					<view class="bg-green  radius" style="height: 160px;width: 85%;">
						<view class="text-center text-white flex justify-center align-center" style="height: 120px;width: 100%;">
							<view>
								<text v-if="TabCur == 0" class="text-white">每月应还</text>
								<text v-else class="text-white">首月月供</text>
								<view class="text-sl">
									{{yuegong.toFixed(2)}}
									<text class="text-sm">元</text>
								</view>
								<view class="text-white" v-if="TabCur == 1">每月约递减{{yuegongdijian.toFixed(2)}}元</view>
							</view>
						</view>
						<view class="flex justify-between" style="height: 30px;width: 100%;">
							<view class="flex justify-center align-center" style="width: 33%;">
								<view class="text-center">
									<view class="text-sm " style="color: #DDDDDD;">贷款总额</view>
									<view class="">{{totalMoney}}万</view>
								</view>
							</view>
							<view class="flex justify-center align-center lixi-total">
								<view class="text-center">
									<view class="text-sm " style="color: #DDDDDD;">利息总额</view>
									<view class="">{{totalLixi.toFixed(2)}}万</view>
								</view>
							</view>
							<view class="flex justify-center align-center" style="width: 33%;">
								<view class="text-center">
									<view class="text-sm " style="color: #DDDDDD;">贷款年限</view>
									<view class="">{{year}}年</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="margin-top flex justify-center align-center">
					<view class="" style="width: 85%;">
						<view v-if="TabCur == 0" >
							<text class="text-bold text-green">每月还款金额不变</text>
							<text>其中还款的本金逐月递减，利息逐月递减。计算结果仅供参考。</text>
						</view>
						<view v-else>
							<text class="text-bold text-green"> 每月还款金额递减{{yuegongdijian.toFixed(2)}}元</text>
							<text>其中每月还款的本金不变，利息逐月减少。计算结果仅供参考。</text>
						</view>
					</view>
				</view>
				<view class=" flex justify-center align-center">
					<view  style="width: 85%;">
						<view class="flex justify-between margin-top table-head">
							<view class="text-center" style="width: 15%;">期数</view>
							<view class="text-center" style="width: 20%;">月供金额</view>
							<view class="text-center" style="width: 20%;">月供本金</view>
							<view class="text-center" style="width: 20%;">月供利息</view>
							<view class="text-center" style="width: 25%;">剩余本息</view>
						</view>
					</view>
				</view>
			</view>

			<view class=" flex justify-center align-center" style="margin-top:320px;width: 100%;">
				<view style="width: 85%;">
					<view  style="margin-bottom: 10px;">
						<view class="flex justify-between table-head-content " v-for="(item, index) in mouthdataArray" :key="index" >
							<view class="text-center" style="width: 15%;">{{ item.topNum }}</view>
							<view class="text-center" style="width: 20%;">{{ item.yueToatl.toFixed(2) }}</view>
							<view class="text-center" style="width: 20%;">{{ item.yuebenjin.toFixed(2) }}</view>
							<view class="text-center" style="width: 20%;">{{ item.yuelixi.toFixed(2) }}</view>
							<view class="text-center" style="width: 25%;">{{ item.leftFund.toFixed(2) }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title:'',
			TabCur: 0,
			navData: ['等额本息', '等额本金'],
			mouthdataArray: [],
			yuegong:0,//每月月供
			totalMoney:0,//贷款本金
			totalLixi:0,//总利息
			year:0,//贷款年限
			yuegongdijian:0,//每月递减金额
			optionData:{}
		};
	},
	onLoad(option) {
		console.log('option.title: ' + JSON.stringify(option.title));
		this.title=option.title;
		this.optionData = JSON.parse(option.datas);
		let data = this.optionData;
		this.totalMoney = data.money;
		this.year = data.year;
		this.benxi(data.money, data.year, data.lilv);
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			if(this.TabCur == 0){
				let data = this.optionData;
				this.benxi(data.money, data.year, data.lilv);
			}else{
				let data = this.optionData;
				this.benjin(data.money, data.year, data.lilv);
			}
		},
		//等额本息计算
		benxi(num, year, lilv) {
			
			//每月月供额=〔贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
			var mouth = parseInt(year) * 12,
				mouthlilv = parseFloat(lilv) / 12,
				dknum = parseFloat(num) * 10000;
			
			//每月月供
			var yuegong = (dknum * mouthlilv * Math.pow(1 + mouthlilv, mouth)) / (Math.pow(1 + mouthlilv, mouth) - 1);
			this.yuegong = yuegong;
			//总利息=还款月数×每月月供额-贷款本金
			var totalLixi = mouth * yuegong - dknum;
			this.totalLixi = totalLixi/10000;
			//还款总额 总利息+贷款本金
			var totalPrice = totalLixi + dknum,
				leftFund = totalLixi + dknum;

			//循环月份
			var mouthdataArray = [],
				nowmouth = new Date().getMonth(),
				realmonth = 0;

			for (var i = 1; i <= mouth; i++) {
				realmonth = nowmouth + i;
				var yearlist = Math.floor(i / 12);

				realmonth = realmonth - 12 * yearlist;

				if (realmonth > 12) {
					realmonth = realmonth - 12;
				}
				//console.log(realmonth)
				//每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
				var yuelixi = (dknum * mouthlilv * (Math.pow(1 + mouthlilv, mouth) - Math.pow(1 + mouthlilv, i - 1))) / (Math.pow(1 + mouthlilv, mouth) - 1);
				//每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
				var yuebenjin = (dknum * mouthlilv * Math.pow(1 + mouthlilv, i - 1)) / (Math.pow(1 + mouthlilv, mouth) - 1);
				leftFund = leftFund - (yuelixi + yuebenjin);
				if (leftFund < 0) {
					leftFund = 0;
				}
				mouthdataArray[i - 1] = {
					monthName: realmonth + '月',
					yuelixi: yuelixi,
					yuebenjin: yuebenjin,
					//剩余还款
					leftFund: leftFund,
					yueToatl: yuelixi + yuebenjin,
					topNum:i
				};
			}
			this.mouthdataArray = mouthdataArray;
			console.log(this.mouthdataArray);
		},
		//等额本金计算
		benjin(num, year, lilv) {
			var mouth = parseInt(year) * 12,
				mouthlilv = parseFloat(lilv) / 12,
				dknum = parseFloat(num) * 10000,
				yhbenjin = 0; //首月还款已还本金金额是0
			//每月应还本金=贷款本金÷还款月数
			var everymonthyh = dknum / mouth;
			//每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
			var yuegong = everymonthyh + (dknum - yhbenjin) * mouthlilv;
			
			this.yuegong = yuegong;
			//每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
			var yuegongdijian = everymonthyh * mouthlilv;
			this.yuegongdijian = yuegongdijian;
			//总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
			var totalLixi = ((everymonthyh + dknum * mouthlilv + (dknum / mouth) * (1 + mouthlilv)) / 2) * mouth - dknum;
			this.totalLixi = totalLixi/10000;
			//还款总额 总利息+贷款本金
			var totalPrice = totalLixi + dknum,
				leftFund = totalLixi + dknum;

			//循环月份
			var mouthdataArray = [],
				nowmouth = new Date().getMonth(),
				realmonth = 0;

			for (var i = 1; i <= mouth; i++) {
				realmonth = nowmouth + i;
				var yearlist = Math.floor(i / 12);

				realmonth = realmonth - 12 * yearlist;

				if (realmonth > 12) {
					realmonth = realmonth - 12;
				}
				yhbenjin = everymonthyh * (i - 1);
				var yuebenjin = everymonthyh + (dknum - yhbenjin) * mouthlilv;
				//每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
				var yuelixi = (dknum - yhbenjin) * mouthlilv;
				leftFund = leftFund - yuebenjin;
				if (leftFund < 0) {
					leftFund = 0;
				}
				mouthdataArray[i - 1] = {
					monthName: realmonth + '月',
					yuelixi: yuelixi,
					//每月本金
					yuebenjin: everymonthyh,
					//剩余还款
					leftFund: leftFund,
					//每月还款总额
					yueToatl: yuelixi + everymonthyh,
					topNum:i
				};
			}
			this.mouthdataArray = mouthdataArray;
		}
	}
};
</script>

<style lang="less">
page {
	background-color: #ffffff;
}
.fixed {
	position: fixed;
	top: 0px;
	width: 100%;
	left: 0px;
	background-color: #ffffff;
}
.lixi-total {
	width: 34%;
	border-left: 1px solid #dddddd;
	border-right: 1px solid #dddddd;
}
.table-head {
	height: 70upx;
	width: 100%;
	line-height: 70upx;
	background-color: #eeeeee;
}
.table-head-content {
	height: 70upx;
	width: 100%;
	line-height: 70upx;
	background-color: #ffffff;
	font-size: 12px;
}
</style>
