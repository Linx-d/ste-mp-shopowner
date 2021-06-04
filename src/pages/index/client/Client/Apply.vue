<template>
  <view>
    <view class="cu-list menu-avatar">
      <view class="cu-item" @click="auditApply">
        <image :src="shopAudit" class="bgImg"></image>
        <view class="content">
          <view class="text-cut">{{
            count === 0 ? "暂无申请" : `收到${count}条加入门店申请`
          }}</view>
        </view>
        <view class="action" v-show="count !== 0">
          <view class="cu-tag round bg-red sm">{{ count }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import shopAudit from "@/static/img/shopAudit.svg";
import shopService from '@/apis/shop'
export default {
  data() {
    return {
      count: 0,
      shopAudit
    };
  },
  computed: {
    auditImg() {
      return `background-image:url(${shopAudit})`;
    },
    shopId() {
      return this.$store.state.shop.id
    }
  },
  methods: {
    auditApply() {
      this.navTo("/pages/index/client/audit");
    },
    reload() {
      const param = {
        shopId: this.shopId
      }
      shopService.conutAudit(param, res => {
        if (res.statusCode === 200) {
          if (res.data.success) {
            this.count = res.data.data
          }
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
  .bgImg {
    width: 10%;
    left: 10px;
    position: absolute;
  }
  .content {
    left: 115rpx !important;
  }
</style>