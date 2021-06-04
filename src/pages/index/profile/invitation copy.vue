<template>
  <view class="container">
    <cu-custom bg-color="bg-white" is-back="true">
      <block slot="content" class="my-text-color-black text-bold">邀请函</block>
    </cu-custom>
    <canvas
      canvas-id="myCanvas"
      style="width: 1080px;height: 2040px; position: fixed;top: -10000px;"
    ></canvas>
    <u-image
      :shape="shape"
      ref="uImage"
      width="100%"
      height="100%"
      :src="canvasToTempFilePath"
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
import inviteImg from "@/static/img/invite-img.jpg";
import { APP_BROKER_ID } from "@/common/const";
import Service from "@/apis/service";
export default {
  onLoad() {
    this.createCanvasImage();
  },
  data() {
    return {
      ratio: 1,
      ctx: null, // 创建canvas对象
      canvasToTempFilePath: null, // 保存最终生成的导出的图片地址
      openStatus: true, // 声明一个全局变量判断是否授权保存到相册
    };
  },
  computed: {
    shopId() {
      return this.$store.state.shop.id
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
  },
  methods: {
    // 生成海报
    async createCanvasImage() {
      let self = this;
      // 点击生成海报数据埋点
      if (!self.ctx) {
        let codeUrl = this.miniQr;
        uni.showLoading({
          title: "生成中...",
        });
        let code = new Promise(function(resolve) {
          uni.getImageInfo({
            src: codeUrl,
            success: function(res) {
              resolve(res.path);
            },
            fail: function(err) {
              console.log(err);
              uni.showToast({
                title: "网络错误请重试code",
                icon: "loading",
              });
            },
          });
        });

        Promise.all([code]).then(function(result) {
          const ctx = uni.createCanvasContext("myCanvas");
          console.log(ctx, self.ratio, "ctx");
          let codeurl_width = 200, //绘制的二维码宽度
            codeurl_heigth = 200, //绘制的二维码高度
            codeurl_x = 90, //绘制的二维码在画布上的位置
            codeurl_y = 1730; //绘制的二维码在画布上的位置

          ctx.drawImage(inviteImg, 0, 0, 1080, 2040); // 背景图片需要本地

          ctx.drawImage(
            result[0],
            codeurl_x,
            codeurl_y,
            codeurl_width,
            codeurl_heigth
          ); // 绘制头像
          ctx.draw(false, function() {
            // canvas画布转成图片并返回图片地址
            uni.canvasToTempFilePath({
              canvasId: "myCanvas",
              success: function(res) {
                self.canvasToTempFilePath = res.tempFilePath;
                self.showShareImg = true;
                console.log(res.tempFilePath, "canvasToTempFilePath");
                uni.showToast({
                  title: "绘制成功",
                });
              },
              fail: function() {
                uni.showToast({
                  title: "绘制失败",
                });
              },
              complete: function() {
                uni.hideLoading();
                uni.hideToast();
              },
            });
          });
        });
      }
    }
  },
};
</script>

<style lang="less">
.container {
  position: relative;
  height: 100vh !important;
  width: 100vw !important;
}
.invitation-bg {
  height: 100%;
  width: 100%;
  position: relative;
  .invitation-code {
    width: 336rpx;
    height: 336rpx;
    position: absolute;
    bottom: 34rpx;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
  }
}
</style>
