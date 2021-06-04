<template>
  <view>
    <cu-custom
     bgColor="text-bold bg-white text-black"
      :isBack="true"
    >
      <block slot="backText">返回</block>
      <block slot="content">门店切换</block>
    </cu-custom>
    <view class="cu-bar bg-white solid-bottom">
      <view class="action">
        <text class="cuIcon-titles text-blue"></text>
        <text class="text-lg" style="color:#999999">当前门店</text>
      </view>
    </view>
    <app-loading-content v-if="switchLoaing"></app-loading-content>
    <view class="cu-list menu sm-border">
      <view class="cu-item solid-bottom">
        <view class="content">
          <!-- <image src="/static/logo.png" class="png" mode="aspectFit"></image> -->
          <text class="text-black">{{ shop.name }}</text>
        </view>
      </view>
    </view>

    <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-titles text-blue"></text>
        <text class="text-lg" style="color:#999999">切换门店</text>
      </view>
    </view>
    <app-loading-content v-if="switchLoaing"></app-loading-content>
    <view class="cu-list menu sm-border" v-else>
      <view
        class="cu-item"
        v-for="item in shops"
        :key="item.id"
        @click="checkItem(item)"
      >
        <view class="content">
          <!-- <image src="/static/logo.png" class="png" mode="aspectFit"></image> -->
          <text class="text-black text-bold">{{
            item.name
          }}</text>
          <!-- <text class="text-black text-bold">{{
            item.name + `(${item.createTime})`
          }}</text> -->
        </view>
        <view class="action">
          <text class="text-black text-sm">{{ item.code }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Service from "@/apis/service";
import shopService from "@/apis/shop";
export default {
  data() {
    return {
      currentLoaing: false,
      switchLoaing: false,
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
    shop() {
      return this.$store.state.shop;
    },
    shops() {
      return this.$store.state.shops;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.load();
    },
    load() {
      this.switchLoaing = true;
      this.shopValidator(this.userId, (res) => {
          if (res) {
              this.switchLoaing = false
          } else {
              this.to300()
          }
      })
    },
    checkItem(item) {
      console.log(item, 'choose item');
      if (item.id === this.shop.id) {
        this.toast('请勿重复选择')
        return
      }
      this.confirm("您确定要切换门店吗？", (ok) => {
        if (ok) {
          this.showLoading(() => {
            this.$store.commit('setShop', item)
            this.redirectTo("/pages/index/index");
            // this.prevPage().$vm.current = ''
            // this.toast("切换成功");
          });
        }
      });
    }
  },
};
</script>

<style></style>
