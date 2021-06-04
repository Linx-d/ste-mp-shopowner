<template name="components">
  <view>
    <cu-custom bgColor="text-bold bg-white">
      <block slot="content" style="color:#000000">
        工作台
      </block>
    </cu-custom>
    <view class="text-center bg-gray mask" v-if="myShops.length === 0">
      <view class="my-align">
        <view class="cuIcon-warnfill text-gray lg flex justify-center" style="font-size: 200rpx;">
        </view>
        <view class="text text-gray text-lg">
          未找到已关联的任务请联系管理员
        </view>
      </view>
    </view>
    <view>
      <view class="home-header bg-white padding-tb padding-lr margin-left margin-right margin-top radius">
        <view class="header-left">
          <view class="home-header-task nowrap">
            {{ myShop.name }}
          </view>
          <view class="home-header-broker">
            门店地址：{{ shopAddress  }} 
          </view>
        </view>

        <view
          class="cu-btn round lines-gray"
          @click="navTo('/pages/index/workbench/switch')"
        >
          切换<text class="cuIcon-order text-gray"></text>
        </view>
      </view>
      <view class="statistics">
        <view class="statistics-title bg-white padding-tb radius">
          <view
            class="statistics-title-item"
            :class="[
              totalPeriod == row.date ? 'active' : 'text-black',
              index === records.length - 1 ? 'statistics-title-item-last' : '',
            ]"
            v-for="(row, index) in records"
            :key="row.id"
            @click="toChild"
            :data-doing="!row.current"
            :data-date="row.date"
          >
            {{ row.title }}
          </view>
        </view>
        <view class="statistics-work bg-white padding-top radius margin-bottom">
          <view class="statistics-second-title padding-lr" @click="toReport(0)">
            <view class="statistics-second-title-left">
              <img class="left-img" src="@/static/home/report.png" alt="" />
              <view>报备数据</view>
            </view>
            <img class="right-img" src="@/static/home/right-icon.png" alt="" />
          </view>
          <view class="statistics-work-content">
            <!-- <app-loading-content v-if="reportLoading"></app-loading-content> -->
            <view class="grid col-4">
              <view
                class="text-center content-number"
                v-for="report in reportList"
                :key="report.id"
                 @click="toReport(report.id)"
              >
                {{ report.number }}
                <view class="content-name">{{ report.name }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="statistics-sign bg-white padding-tb radius">
          <view class="statistics-second-title padding-lr" @click="toContract(0)">
            <view class="statistics-second-title-left">
              <img class="left-img" src="@/static/home/order.png" alt="" />
              <view>签约数据</view>
            </view>
            <img class="right-img" src="@/static/home/right-icon.png" alt="" />
          </view>
          <view class="statistics-sign-content">
            <!-- <app-loading-content v-if="reportLoading"></app-loading-content> -->
            <view class="grid col-2 text-center">
              <view class="statistics-sign-content-count" @click="toContract(buy.status)">
                <view class="text-center content-num">
                  {{ formatPrice(buy.money) }}
                </view>
                <view class="content-count"> {{ buy.len }} 笔 </view>
                <view class="content-name">
                  认购
                </view>
              </view>
              <view class="statistics-sign-content-count" @click="toContract(sign.status)">
                <view class="text-center content-num">
                  {{ formatPrice(sign.money) }}
                </view>
                <view class="content-count"> {{ sign.len }} 笔 </view>
                <view class="content-name">
                  签约
                </view>
              </view>
              <view class="statistics-sign-content-count" @click="toContract()">
                <view class="text-center content-num">
                  {{ formatPrice(commission.money) }}
                </view>
                <view class="content-count"> {{ commission.len }} 笔 </view>
                <view class="content-name">
                  应收佣金
                </view>
              </view>
              <view class="statistics-sign-content-count" @click="toContract()">
                <view class="text-center content-num">
                  0
                </view>
                <view class="content-count">
                  0 笔
                </view>
                <view class="content-name">
                  回款
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="space"></view>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import flag from "@/static/home/flag.svg";
import Service from "@/apis/service.js";
import shopOwnerService from "@/apis/shopOwner.js";
import ReportService from "@/apis/report.js";
import OrderService from "@/apis/order.js";
import Navigation from "./Work/Navigation";
import { cuIconList, reportList, records, buy, sign, commission } from './js/work'
export default {
  components: {
    Navigation,
  },
  data() {
    return {
      // 接受经纪人人数
      taskCords: 0,
      flag,
      cuIconList,
      modalName: null,
      gridCol: 4,
      gridBorder: false,
      skin: false,
      listTouchStart: 0,
      listTouchDirection: null,
      reportList,

      records,
      totalPeriod: "day",
      buy,
      sign,
      commission,
      // loading
      reportLoading: false,
      finishLoading: false
    };
  },
  computed: {
    userId() {
      console.log(this.$store.state.user, '------2-----');
      console.log(uni.getStorageSync('user' + Service.KEY_SUFFIX), '------1-----');
      return this.$store.state.user.id;
    },
    shopId() {
      return this.$store.state.shop.id;
    },
    myShop() {
      return this.$store.state.shop
    },
    myShops() {
      return this.$store.state.shops
    },
    shopAddress() {
      return this.myShop.province + '-' + this.myShop.city + '-' + this.myShop.district + '-' + this.myShop.street
    }
  },
  mounted() {
    let value = uni.getStorageSync("totalPeriod_date");
    if (value) {
      this.totalPeriod = value;
    }
    uni.removeStorageSync("totalPeriod_date");
    this.reload();
  },
  beforeDestroy() {
    uni.setStorageSync("totalPeriod_date", this.totalPeriod);
  },
  methods: {
    reload() {
      this.getFinish();
    },
    hideModal(e) {
      this.modalName = null;
    },
    Gridchange(e) {
      this.gridCol = e.detail.value;
    },
    toChild(e) {
      this.showLoading(() => {
        this.reportLoading = true;
        this.finishLoading = true;
        if (e) {
          var { doing, url, date } = e.currentTarget.dataset;
          this.totalPeriod = date;
        } else {
          var date = this.totalPeriod;
        }
        let startHour = " 00:00:00";
        let endHour = " 23:59:59";
        let params = {
          startTime: "",
          endTime: "",
          shopOwnerId: this.userId,
        };
        switch (date) {
          case "day":
            params.startTime = this.getDate() + startHour;
            params.endTime = this.getDate() + endHour;
            this.getTotal(params);
            break;
          case "week":
            params.startTime = this.getMonday("s") + startHour;
            params.endTime = this.getMonday("e") + endHour;
            this.getTotal(params);
            break;
          case "month":
            params.startTime = this.getMonth("s", 0) + startHour;
            params.endTime = this.getMonth("e", 0) + endHour;
            this.getTotal(params);
            break;
          case "season":
            params.startTime = this.getQuarterMonth("s") + startHour;
            params.endTime = this.getQuarterMonth("e") + endHour;
            this.getTotal(params);
            break;
          case "year":
            params.startTime = this.getYear("s") + startHour;
            params.endTime = this.getYear("e") + endHour;
            this.getTotal(params);
            break;
          default:
            params.startTime = this.getYear("s") + startHour;
            params.endTime = this.getYear("e") + endHour;
            this.getTotal(params);
        }
      })
    },
    getTotal(params) {
      let buy = {
        status: 0,
        len: 0,
        money: 0,
      };
      let sign = {
        status: 1,
        len: 0,
        money: 0,
      };
      let commission = {
        status: -1,
        len: 0,
        money: 0,
      };
      const dateParam = { ...params, shopId: this.shopId };
      console.log(dateParam, 'dateParam');
      ReportService.getShopDate(dateParam, (res) => {
        console.log(res, 'res');
        this.reportLoading = false;
        this.reportList.forEach((item) => {
          if (item.id === 0)
            item.number = res.data.data.unchecked.toString();
          if (item.id === 1)
            item.number = res.data.data.approved.toString();
          if (item.id === 9) item.number = res.data.data.arrived.toString();
          if (item.id === -2)
            item.number = res.data.data.expired.toString();
        });
        console.log(this.reportList, 'reportList');
        this.hideLoading()
      });
      const orderParam = { ...params, ...this.maxPagination, shopId: this.shopId };
      OrderService.queryOrder(orderParam, (res) => {
        this.finishLoading = false;
        if (res.statusCode === 200) {
          res.data.data.content.forEach((item) => {
            if (item.status === 0) {
              let price = item.price || 0;
              buy.money = parseInt(buy.money) + parseInt(price);
              ++buy.len;
            }
            if (item.status === 1) {
              let price = item.price || 0;
              sign.money = parseInt(sign.money) + parseInt(price);
              ++sign.len;
            }
            if (item.commissionStatus === 1) {
              let earnest = item.earnest || 0;
              commission.money = parseInt(commission.money) + parseInt(earnest);
              ++commission.len;
            }
          });
        }
        this.buy = buy;
        this.sign = sign;
        this.commission = commission;
      });
    },
    toTab(val) {
      switch (val) {
        case "work":
          this.$emit("currentTab", "work");
          break;
        case "finish":
          this.$emit("currentTab", "finish");
          break;
      }
    },
    pullDownRefresh() {
      this.getFinish();
    },
    getFinish() {
      this.reportLoading = true;
      this.finishLoading = true;
      this.toChild();
      this.authValidator()
      uni.stopPullDownRefresh();
    },
    toReport(status) {
      let url = '/pages/index/workbench/report/report'
      if (status) {
        const param = {
          status
        }
        url = this.requestFormat(url, param)
      }
      this.navTo(url);
    },
    toContract(status) {
      console.log(status, 'status');
      let url = '/pages/index/workbench/contract/contract'
      if (status) {
        const param = {
          status
        }
        url = this.requestFormat(url, param)
      }
      this.navTo(url);
    }
  },
};
</script>

<style lang="less" scoped>
.page {
  height: 100vh;
  width: 100vw;
}

.page.show {
  overflow: hidden;
}

// -------------头部---------------------------
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 164upx;
  border-bottom: 1px solid #f2f2f2;
  margin: 24upx 24upx 0 24upx;

  .header-left {
      width: 70%;
    .home-header-task {
      font-size: 36upx;
      font-weight: bold;
      line-height: 50upx;
      color: #000000;
    }

    .home-header-broker {
      font-size: 24upx;
      font-weight: 400;
      line-height: 34upx;
      color: #333333;
    }
  }
}

//--------------横幅---------------------------------
.dynamic {
  padding: 0 24upx;
  height: 360upx;
  display: flex;
  flex-direction: column;

  .dynamic-top {
    display: flex;
    justify-content: space-between;
    margin: 32upx 0;

    .dynamic-list {
      width: 338upx;
      height: 144upx;
      border-radius: 8upx;
      background-color: #edeff2;
      padding: 24upx;
      color: #000000;
      position: relative;

      .dynamic-img {
        width: 96upx;
        height: 96upx;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }

  .banner {
    width: 702upx;
    height: 120upx;
  }
}

//--------------统计---------------------------------
.statistics {
  padding: 32upx 24upx;

  .statistics-title {
    display: flex;
    justify-content: center;
    margin-bottom: 32upx;

    .statistics-title-item {
      width: 128upx;
      height: 48upx;
      text-align: center;
      line-height: 48upx;
      border: 1px solid #c2c2c2;
      border-right: none;
    }

    .statistics-title-item-last {
      border-right: 1px solid #c2c2c2;
    }

    .active {
      background-color: #0464e0;
      color: #ffffff;
      border: none;
      & + .statistics-title-item {
        border-left: none;
      }
    }
  }

  .statistics-second-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .statistics-second-title-left {
      display: flex;
      align-items: center;
      font-size: 32upx;
      font-weight: bold;
      color: #333333;

      .left-img {
        width: 36upx;
        height: 36upx;
        margin-right: 16upx;
      }
    }

    .right-img {
      width: 24upx;
      height: 24upx;
    }
  }

  .content-number {
    font-size: 36upx;
    font-weight: bold;
    margin: 32upx 0 24upx;
    color: #333333;

    .content-name {
      margin: 24upx;
      font-size: 24upx;
      color: #999999;
      font-weight: normal;
    }
  }

  .statistics-sign {
    padding-top: 32upx;
    .statistics-sign-content {
      .statistics-sign-content-count {
        .content-num {
          font-size: 36upx;
          font-weight: bold;
          margin-top: 30upx;
          color: #333333;
        }
        .content-count {
          font-size: 24upx;
          margin: 18upx 0;
          color: #333333;
        }
        .content-name {
          font-size: 24upx;
          color: #999999;
          margin-bottom: 10upx;
        }
      }
    }
  }
}
</style>
