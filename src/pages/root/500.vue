<template>
  <view
    class="text-center flex-col adjustify-center align-center padding-page h100"
  >
    <view>
      <view class="text-gray">{{ text || "系统出错" }}</view>
      <button class="cu-btn reg-btn lg  bg-blue shadow" style="border-radius: 100rpx;" @click="reLogin">重新登录</button>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      code: 0,
      text: "对不起，服务器报错了。",
    };
  },
  onLoad() {},
  computed: {

  },
  mounted() {
    this.reLogin();
  },
  methods: {
    reLogin() {
      this.navTo('/pages/root/root')
    },
  },
};
</script>
