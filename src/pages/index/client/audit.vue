<template>
  <view class="container">
    <view id="navHeader">
      <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">审批</block>
      </cu-custom>
    </view>

    <view>
      <view class="cu-bar bg-white solid-bottom">
        <view class="action">
          <text class="cuIcon-title text-orange"></text> 申请
        </view>
      </view>
      <view-scroll scroll-y class="cu-list menu-avatar no-padding">
        <view class="cu-item" v-for="item in rows" :key="item.id">
          <view class="cu-avatar portrait bg-blue">{{
            item.name.substring(0, 1)
          }}</view>
          <view class="content">
            <view class="text-black text-lg">{{ item.name }}</view>
            <view class="text-gray text-sm"
              >{{ item.phone || "" }} {{ item.remark || "" }}</view
            >
          </view>
          <view class="action">
            <view v-if="item.status === 0">
              <button class="cu-btn bg-red shadow margin-right-xs" @click="repluse(item)">
                拒绝
              </button>
              <button class="cu-btn bg-blue shadow" @click="pass(item)">
                通过
              </button>
            </view>
            <view v-if="item.status === 1">
              <text class="text-green">已通过</text>
            </view>
            <view v-if="item.status === 2">
              <text class="text-gray">已拒绝</text>
            </view>
			<view v-if="item.status === -1">
			  <text class="text-gray">无效</text>
			</view>
          </view>
        </view>
      </view-scroll>
    </view>

    <app-loading v-if="loading" />
    <app-nomore v-if="nomore" />
    <app-empty v-if="!loading && rows.length === 0" />

    <apply-audit ref="audit" @reload="reload" :status="auditStauts" />
  </view>
</template>

<script>
import Service from "@/apis/service.js";
import shopBrokerService from "@/apis/shopBroker";
import ApplyAudit from "./Audit/ApplyAudit";
export default {
  components: {
    ApplyAudit
  },
  data() {
    return {
      auditStauts: 1,
      loading: false,
      nomore: false,
      search: false,

      keyword: null,

      page: 0,
      size: 10,
      total: 0,
      rows: [],
      vHeight: "",
      sHeight: "",
    };
  },
  onPullDownRefresh() {
    this.reload()
  },
  onReachBottom() {
    console.log('2222');
    this.loadmore()
  },
  computed: {
    shop() {
      return this.$store.state.shop;
    },
  },
  mounted() {
    this.compHeight();
    this.init();
  },
  methods: {
    compHeight() {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#navHeader")
        .boundingClientRect((data) => {
          console.log(data);
          this.vHeight = `margin-top:${data.height}px`;
        })
        .exec();
    },
    init() {
      this.reload();
    },
    reload() {
      this.load(0);
    },
    loadmore() {
      if ((this.page + 1) * this.size < this.total) {
        this.load(this.page + 1);
      } else if (!this.nomore) {
        this.nomore = true;
        this.toast("没有更多数据啦~");
      }
    },
    pass(record) {
      this.auditStauts = 1
      this.$refs.audit.showModal(record);
    },
    repluse(record) {
      this.auditStauts = 2
      this.$refs.audit.showModal(record);
    },
    doSearch() {
      this.search = true;
      this.reload();
    },
    undoSearch() {
      this.search = false;
      this.keyword = null;
      this.reload();
    },
    load(page) {
      //获取数据
      let param = {
        page: page,
        size: this.size,
        sort: "updateTime,desc",
        shopId: this.shop.id,
      };
      if (this.search && this.keyword) {
        param.keyword = this.keyword;
      }
      this.loading = true;

      shopBrokerService.query(param, (res) => {
        this.loading = false;
        if (res.data.data && res.data) {
          let data = res.data.data.content.map((item) => {
            const shopBroker = {}
            const obj = {
              id: item.id,
              status: item.status
            }
            Object.assign(shopBroker, item.broker, obj)
            return shopBroker
          });
          let arr = data || [];
		console.log("arr", res)
          this.rows = page === 0 ? arr : [...this.rows, arr];
          this.page = page;
          this.total = data.totalElements || 0;
          uni.stopPullDownRefresh()
        } else {
          this.toast("获取经纪人申请列表失败");
        }
      });
    },
    // 上拉到底部
    reachBottom() {
      this.loadmore();
    },
    //下拉刷新
    pullDownRefresh() {
      this.reload();
    },
    checkClient(item) {
      console.log(item, "consultant item");
    },
    toChild(e) {
      let { doing, url } = e.currentTarget.dataset;
      if (doing) {
        this.toast("功能暂未开放，敬请期待");
      } else if (url) {
        this.navTo(url);
      }
    },
  },
};
</script>

<style lang="less" scoped>
// 头像
.portrait {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  &.addBtn {
    position: fixed;
    bottom: 200rpx;
    right: 24rpx;
    z-index: 2000;
  }
}
.phone {
  width: 36rpx;
  height: 36rpx;
  margin-right: 24rpx;
}
.cu-list {
  .cu-item {
    .content {
      width: calc(100% - 96rpx - 60rpx - 120rpx - 57rpx);
    }
    .action {
      width: 245rpx;
    }
  }
}
</style>
