<template>
  <view class="container">
    <cu-custom bg-color="bg-white" is-back="true">
      <block slot="content" class="my-text-color-black text-bold">邀请函</block>
    </cu-custom>
    <u-image
      :shape="shape"
      ref="uImage"
      width="100%"
      height="100%"
      :src="miniQr"
      mode="aspectFill"
    >
      <u-loading
        size="44"
        mode="flower"
        slot="loading"
        v-if="loadingSlot"
      ></u-loading>
      <view v-if="errorSlot" slot="error" style="font-size: 24rpx;"
        >加载失败</view
      >
    </u-image>
    
  </view>
</template>

<script>
import { APP_BROKER_ID } from "@/common/const";
import Service from "@/apis/service";
export default {
  data() {
    return {
      ratio: 1
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
    miniQr() {
      const param = {
        appId: APP_BROKER_ID,
        id: this.shopId,
        type: 2,
      };
      const api = Service.URI_API;
      const url = api + "/shop/miniQr";
      return this.requestFormat(url, param);
    },
  }
};
</script>

<style lang="less" scoped>
  .container {
    height: 100vh;
    width: 100vw;
  }
</style>
