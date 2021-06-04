<template>
    <view class="margin-top bg-white padding">
        <view class="text-bold text-lg">流程信息</view>
        <view class="margin-top">
            <app-loading v-if="loading" />
            <view class="cu-timeline">
                <template v-for="log in logs">
                    <view class="cu-item text-blue" :key="log.id" style="padding-bottom:0px;">
                        <view class="content" style="padding:20rpx;">
                            <view class="margin-bottom-sm">{{getLabel(log)}}</view>
                            <app-rich-text
                                class="margin-bottom-sm"
                                v-if="log.remark && log.commissionStatus === -2"
                                :text="log.remark"
                            />
                            <view class="text-gray text-sm">{{log.createTime}}</view>
                        </view>
                    </view>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
import OrderService from "@/apis/order";
export default {
    props: {
        item: {
            type: Object,
            default: () => null,
        },
    },
    data() {
        return {
            loading: false,
            logs: [],
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.loading = true;
            OrderService.getLog(this.item.id, "createTime,desc", (res) => {
                if (res.data) {
                    this.logs = res.data._embedded.orderLogs || [];
                }
                this.loading = false;
            });
        },
        getLabel(log) {
            let cs = log.commissionStatus;
            if (cs != undefined) {
                // 1=待回款,2=回款中,3=可结佣,4=结佣中(结佣申请),5=已结佣,-2=结佣异议
                return cs === 1
                    ? "已签约待结佣"
                    : cs === 3
                    ? "可结佣"
                    : cs === 4
                    ? "结佣中"
                    : cs === 5
                    ? "已结佣"
                    : cs === -2
                    ? "结佣异议"
                    : "异常";
            } else {
                // 0=认购,1=签约,-1=退房
                return log.status === 0
                    ? "已认购"
                    : log.status === 1
                    ? "签约"
                    : log.status === -1
                    ? "退房"
                    : "异常";
            }
        },
    },
};
</script>