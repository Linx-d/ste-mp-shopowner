<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <block slot="content" class="my-text-color-black text-bold">{{ title }}</block>
        </cu-custom>

        <app-loading v-if="loading" />

        <view v-else-if="report">
            <!-- 楼盘信息 -->
            <view class="flex-row bg-white padding shadow" @click="goDetail" v-if="house">
               <!-- <view
                    style="width:220rpx;height: 220rpx;"
                    class="bg-img"
                    :style="
                house.cover
                  ? `background-image:url(${URI_OSS + house.cover + _thumb})`
                  : `background-image:url(${DEFAULT_COVER})`
              "
                /> -->
				<view class="" v-if="house.cover">
					<app-img :imgUrl="house.cover" width="210" height="210"></app-img>
				</view>
				
                <view class="flex-1 padding-left">
                    <view class="flex-row align-center">
                        <view class="flex-1 my-text-color-black text-lg text-bold">{{ house.name ? house.name : '-'}}</view>
                        <!-- <view class="cu-tag">{{ getHouseType(house.type,house.propertyType) }}</view> -->
                    </view>
                    <view class="flex-row text-sm margin-top-sm">
						<view class="padding-right-sm" style="border-right: 1rpx solid #C2C2C2;">{{ getAddrName(house) +" · " + house.district }}</view>
                        <view class="padding-left-sm">建面 {{ house.acreage || '-' }}m²</view>
                    </view>
                    <view class="flex-row text-bold my-text-color-red margin-top-sm">
                         <view class="">{{ house.salePrice || '-' }}元/m²</view>
                        <!-- <view class="text-gray">{{ getSaleStatus(house.saleStatus) }}</view> -->
                    </view>
					<!-- style="height: 52rpx;overflow: hidden;" -->
					<view class="flex-row margin-top-sm flex-wrap" style="height: 52rpx;overflow: hidden;">
					     <view class="cu-tag bg-green">{{ house.propertyType }}</view>
					     <view class="cu-tag my-text-color-blue" style="background-color: #E6F0FC;" v-for="(item,index) in label" :key="index">{{item}}</view>
					</view>
					
                </view>
            </view>

            <!-- 驻场人员 -->
            <!-- <app-residents-card :items="residents" v-if="report.status === 0" /> -->
			
			<!-- 项目掌柜 -->
			<view class="padding margin-top margin-bottom bg-white flex-row align-center">
				<image src="@/static/img/tetail1.png" class="detail-wh margin-right"></image>
				<view class="flex-1">项目掌柜</view>
				<view class="flex-1 text-right">
					<button class="cu-btn line-blue" :disabled="!house.managerPhone" @click="callPhone(house.managerPhone)">联系掌柜</button>
				</view>
			</view>
			
            <!-- 审核信息 -->
            <view class="margin-top bg-white padding" v-if="report.status === -1">
                <view class="text-bold text-lg">审核信息</view>
                <view class="margin-top">
                    <view class="flex-row">
                        <view class="text-red text-bold flex-1" style="line-height: 32px;">否决</view>
                        <button
                            class="cu-btn line-blue"
                            :disabled="!report.houseManagerPhone"
                            @click="callPhone(auditUser.phone)"
                        >联系驻场</button>
                    </view>

                    <!-- <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">审核驻场</view>
                        <view class="flex-2">{{ report.auditUser.name}}</view>
                    </view> -->
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">审核时间</view>
                        <view class="flex-2">{{ report.auditTime || '-'}}</view>
                    </view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">审核备注</view>
                        <view class="flex-2">{{ report.auditRemark || '-'}}</view>
                    </view>
                </view>
            </view>

            <view v-if="order">
                <!-- 订单信息 -->
                <view class="flex-row padding bg-white margin-top">
                    <view class="flex-1 text-gray">订单编号</view>
                    <view class="flex-2">{{order.id}}</view>
                </view>

                <!-- 签约信息 -->
                <app-contract-info :item="order" v-if="order.contractTime"/>

                <!-- 认购信息 -->
                <view class="margin-top bg-white padding">
                    <view class="text-bold text-lg">认购信息</view>
                    <view class="margin-top">
                        <!-- <view class="flex-row">
                            <view class="flex-1 text-gray">驻场</view>
                            <view class="flex-2">
                                <view class="flex-row">
                                    <view
                                        class="flex-1"
                                    >{{ order._embedded.resident ? order._embedded.resident.name : '-'}}</view>
                                    <view
                                        class="cuIcon-phone text-blue margin-lr"
                                        style="font-size:1.6em;"
                                        v-if="order._embedded.resident"
                                        @click="callPhone(order._embedded.resident.phone)"
                                    ></view>
                                </view>
                            </view>
                        </view> -->
                        <view class="flex-row margin-top">
                            <view class="flex-1 text-gray">置业顾问</view>
                            <view class="flex-2">{{report.consultantName}}</view>
                        </view>
                        <view class="flex-row margin-top">
                            <view class="flex-1 text-gray">认购房号</view>
                            <view class="flex-2">{{order.room || '-'}}</view>
                        </view>
                        <view class="flex-row margin-top">
                            <view class="flex-1 text-gray">房屋总价</view>
                            <view
                                class="flex-2"
                            >{{ order.price ? numberWithCommas(order.price) : '-'}}</view>
                        </view>
                        <view class="flex-row margin-top">
                            <view class="flex-1 text-gray">认购时间</view>
                            <view class="flex-2">{{ order.createTime || '-' }}</view>
                        </view>
                        <view class="flex-row margin-top">
                            <view class="flex-1 text-gray">预计签约时间</view>
                            <view class="flex-2">{{ order.signDate || '-'}}</view>
                        </view>
                        <view class="flex-row margin-top">
                            <view class="flex-1 text-gray">认购单</view>
                            <view class="flex-2">
                                <app-media-grid
                                    :media="order.photos"
                                    v-if="order.photos && order.photos.length > 0"
                                />
                                <text v-else>未上传</text>
                            </view>
                        </view>
                        <view class="flex-row margin-top">
                            <view class="flex-1 text-gray">备注</view>
                            <view class="flex-2">{{order.remark||'-'}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 到访信息 -->
            <view class="margin-top bg-white padding" v-if="report.acceptTime">
                <view class="flex align-center">
					<text class="text-bold text-lg">到访信息</text>
					<view class="margin-left cu-tag text-green mybg radius" v-if="report.status==9&&report.leftProtectDays > 0">保护期{{report.leftProtectDays}}天</view>
					<view class="margin-left cu-tag line-red radius" v-else-if="report.status==9&&report.leftProtectDays < 0">超过保护期</view>
				</view>
				
                <view class="margin-top">
                    <!-- <view class="flex-row">
                        <view class="flex-1 text-gray">驻场</view>
                        <view class="flex-2">
                            <view class="flex-row">
                                <view class="flex-1">{{report.acceptUser.name}}</view>
                                <view
                                    class="cuIcon-phone text-blue margin-lr"
                                    style="font-size:1.6em;"
                                    @click="callPhone(report.acceptUser.phone)"
                                ></view>
                            </view>
                        </view>
                    </view> -->
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">置业顾问</view>
                        <view class="flex-2">{{report.consultantName}}</view>
                    </view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">到访时间</view>
                        <view class="flex-2">{{report.acceptTime || '-'}}</view>
                    </view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">扫码时间</view>
                        <view class="flex-2">{{report.scanTime || '-'}}</view>
                    </view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">证据链</view>
                        <view class="flex-2">
                            <app-media-grid
                                :media="report.evidence"
                                v-if="report.evidence.length > 0"
                            />
                            <text v-else>未上传</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 报备信息 -->
            <view class="margin-top bg-white padding">
                <view class="text-bold text-lg flex-row">
                    <view class="flex-1">
                        报备信息
                    </view>
                    <text class="cuIcon-copy text-blue margin-left" @click="copyInfo"></text>
                </view>
                <view class="margin-top">
                    <view class="flex-row">
                        <view class="flex-1 text-gray">客户姓名</view>
						<view class="flex-2 flex align-center">
							<view class="">{{report.client.name}}</view>
							<image v-if="report.client.sex==0" src="@/static/img/nan.png" style="width: 36rpx;height: 36rpx;margin-left: 10rpx;" mode=""></image>
							<image v-else src="@/static/img/nv.png" style="width: 36rpx;height: 36rpx;margin-left: 10rpx;" mode=""></image>
						</view>
                    </view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">手机号</view>
                        <view class="flex-2">{{report.client.phone}}</view>
                    </view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">需求面积</view>
                        <view
                            class="flex-2"
                        >{{report.client.areaStart || ''}} - {{report.client.areaEnd || ''}} ㎡</view>
                    </view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">需求业态</view>
                        <view class="flex-2">{{report.client.propertyType||'-'}}</view>
                    </view>
					<view class="flex-row margin-top">
					    <view class="flex-1 text-gray">意向强度</view>
					    <view class="flex-2"> <uni-rate :readonly="true" :size="15" :value="report.client.intention" /></view>
					</view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">预计到访时间</view>
                        <view class="flex-2">{{this.timeText(report.appointment)}}</view>
                    </view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">报备时间</view>
                        <view class="flex-2">{{report.createTime || '-'}}</view>
                    </view>
                    <view class="flex-row margin-top">
                        <view class="flex-1 text-gray">报备备注</view>
                        <view class="flex-2">{{report.remark||'-'}}</view>
                    </view>
                </view>
            </view>
        </view>

        <view class="cu-tabbar-height" />
    </view>
</template>

<script>
import Service from "@/apis/service";
import ReportService from "@/apis/report";
import OrderService from "@/apis/order";
import ClientService from "@/apis/client";
import HouseService from "@/apis/house";
import {uniRate} from '@dcloudio/uni-ui'

import { DEFAULT_COVER } from "@/common/const";

export default {
    data() {
        return {
            reportId: "",

            loading: false,

            report: {},
            house: {},

            order: null,

            residents: [],

            URI_OSS: Service.URI_OSS,
            DEFAULT_COVER,
        };
    },
	components:{uniRate},
    onLoad(option) {
        this.reportId = option.reportId;
    },
    mounted() {
        this.init();
    },
    computed: {
		label(){
			if(this.house.label){
				return this.house.label.split(',')
			}else{
				return []
			}
		},
        task() {
            return this.report ? this.report.task : null;
        },
        qr() {
            return this.report
                ? `${ReportService.URI_API}/report/${this.report.id}/qr`
                : null;
        },
        title() {
            if (this.order == null) {
                switch (this.report.status) {
                    case 0:
                        return "待审核";
                    case 1:
                        return "审核通过";
                    case -1:
                        return "已否决";
                    default:
                        return "报备详情";
                }
            } else {
                switch (this.order.status) {
                    case 0:
                        return "已认购";
                    case 1:
                        return "已签约";
                    case -1:
                        return "已退房";
                    default:
                        return "订单详情";
                }
            }
        },
    },
    methods: {
        init() {
            this.loading = true;
            ReportService.byId(this.reportId, (res) => {
                if (res.statusCode === 200) {
                    this.report = res.data;
                    this.auditUser = res.data.auditUser
                    let houseId = this.report.houseId;
                    this.loadHouseInfo(houseId);
                    this.loadResidentInfo(houseId);

                    let orderId = this.report.orderId;
                    if (orderId) {
                        this.loadOrderInfo(orderId);
                    }
                } else {
                    this.toast(res.message);
                }
                uni.stopPullDownRefresh();
            });
        },
        loadOrderInfo(orderId) {
            OrderService.getOrderById(orderId, (res) => {
                if (res.statusCode === 200) {
                    this.order = res.data;
                    this.loadOrderMedia(orderId);
                }
            });
        },
        loadOrderMedia(orderId) {
            OrderService.getPhotos(orderId, (res) => {
                if (res.data && res.data._embedded) {
                    this.$set(
                        this.order,
                        "photos",
                        res.data._embedded.medias || []
                    );
                }
            });
            OrderService.getContractPhotos(orderId, (res) => {
                if (res.data && res.data._embedded) {
                    this.$set(
                        this.order,
                        "contractPhotos",
                        res.data._embedded.medias || []
                    );
                }
            });
        },
        loadResidentInfo(houseId) {
            HouseService.getResidents(houseId, (res) => {
                if (res.statusCode === 200) {
                    this.residents = res.data._embedded.residents || [];
                }
            });
        },
        loadHouseInfo(houseId) {
            HouseService.byId(houseId, (res) => {
                this.loading = false;
                if (res.statusCode === 200) {
                    this.house = res.data;
					// console.log('this.house ', this.house );
                    this.report.task.house = this.house;
                    this.report = { ...this.report };
                }
            });
        },
        goDetail() {
            let { houseId, taskId } = this.report;
            this.navTo(
                `/pages/task/detail?houseId=${houseId}&taskId=${taskId}`
            );
        },
        toEvidence() {
            this.navTo(
                `/pages/index/workbench/report/report-evidence?reportId=${this.reportId}`
            );
        },
        copyInfo(){

            let arr = [];
            
            let {houseName,client,broker,clientPhone,appointment,remark} = this.report;
            let {name,phone} = client
            let {name:bname,phone:bphone} = broker


            arr.push({ title:'报备楼盘',value:houseName||'-' })
            arr.push({ title:'客户姓名',value:name||'-' })
            arr.push({ title:'客户手机号',value:phone||'-' })
            arr.push({ title:'经纪人姓名',value:bname||'-' })
            arr.push({ title:'经纪人手机号',value:bphone||'-' })
            arr.push({ title:'预计到访时间',value:this.timeText(appointment) })
            arr.push({ title:'备注信息',value:remark ||'-'})
           let info = arr.map(i=>`${i.title}：${i.value}`).join('\n');
           this.copy(info);
        },
    },
    onPullDownRefresh() {
        this.init();
    },
};
</script>
<style lang="less">
	.detail-wh{
		width: 38rpx;
		height: 38rpx;
	}
	.mybg {
		background-color: #E5F9EF;
	}
</style>