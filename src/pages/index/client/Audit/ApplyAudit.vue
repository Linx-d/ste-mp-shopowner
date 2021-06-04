<template>
  <view>
    <view class="cu-modal" :class="modalName == 'pass' ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">审批</view>
          <view class="action" @click="hideModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-top padding-bottom">
          {{ status === 1 ? '通过' : '拒绝'}}{{ model.name || '经纪人' }}的申请
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn line-blue text-blue" @click="hideModal">
              取消
            </button>
            <button class="cu-btn bg-blue margin-left" @click="handleOk">
              {{ status === 1 ? '通过' : '拒绝'}}
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import shopBrokerService from '@/apis/shopBroker'
export default {
  props: {
    status: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      model: {},
      modalName: null,
      phone: null,
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
  },
  created() {},
  mounted() {},
  methods: {
    showModal(model) {
      this.model = model
      this.modalName = "pass";
    },
    hideModal() {
      this.modalName = null;
    },
    handleOk() {
      const param = {
        shopBrokerId: this.model.id,
        shopOwnerId: this.userId,
        status: this.status
      };
      let msg = '通过申请'
      if (this.status === 2) {
        msg = '拒绝申请'
      }
      shopBrokerService.audit(param, res => {
        if (res.statusCode === 200) {
          if (res.data.success) {
            this.modalName = null
            this.toast(msg)
            this.$emit('reload')
          } else {
			this.toast(res.data.message)
		  }
        }
      })
    },
  },
};
</script>

<style lang="less" scoped>
.phone {
  text-align: left;
}
</style>
