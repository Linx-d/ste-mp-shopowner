<template>
  <view>
    <view class="cu-modal" :class="modalName == 'ShopPhone' ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">修改手机号</view>
          <view class="action" @click="hideModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-top-sm padding-bottom-sm">
          <view class="cu-form-group">
            <view class="title">手机号</view>
            <input class="phone" placeholder="请输入手机号" v-model="phone" name="input">
        </view>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn line-green text-green" @click="hideModal">
              取消
            </button>
            <button class="cu-btn bg-green margin-left" @click="handleOk">
              确定
            </button>
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
      modalName: null,
      phone: null
    };
  },
  computed: {
      userId() {
          return this.$store.state.user.id
      }
  },
  created() {},
  mounted() {},
  methods: {
    showModal() {
      this.modalName = "ShopPhone";
    },
    hideModal() {
      this.modalName = null;
    },
    handleOk() {
        const param = {
            id: userId,
            phone: this.phone
        }
        this.modalName = null;
    }
  },
};
</script>

<style lang="less" scoped>
    .phone {
        text-align: left;
    }
</style>