<template>
    <view>
        <form>
            <view class="cu-form-group padding-top padding-bottom">
                <view class="title">头像</view>
                <view class="action" @click="toChangeAvatar">
                    
                    <app-user-avatar :user="payload"/>
                    
                </view>
            </view>
            <view class="cu-form-group">
                <view class="title">昵称</view>
                <input
                    class="text-right"
                    placeholder="请输入"
                    :value="payload.name"
                    @input="e=>iptChange(e,'name')"
                />
            </view>
            <view class="cu-form-group">
                <view class="title">身份证号</view>
                <input
                    class="text-right"
                    type="number"
                    maxlength="18"
                    placeholder="请输入身份证号"
                    :value="payload.idcard"
                    @input="e=>iptChange(e,'idcard')"
                />
            </view>
            <view class="cu-form-group">
                <view class="title">出生日期</view>
                <picker mode="date" :start="dateStart" :end="dateEnd" @change="birthdayChange">
                    <view
                        class="picker"
                    >{{payload.birthday ? payload.birthday.split(' ')[0] : '请选择'}}</view>
                </picker>
            </view>
            <view class="cu-form-group">
                <view class="title">籍贯</view>
                <input
                    class="text-right"
                    placeholder="请输入"
                    :value="payload.birthplace"
                    @input="e=>iptChange(e,'birthplace')"
                />
            </view>
            <view class="cu-form-group">
                <view class="title">民族</view>
                <input
                    class="text-right"
                    placeholder="请输入"
                    :input="payload.nation"
                    @change="e=>iptChange(e,'nation')"
                />
            </view>
            <view class="cu-form-group">
                <view class="title">学历</view>
                <picker @change="educationChange" :value="educationIndex" :range="education">
                    <view class="picker cuIcon-left">{{payload.education || "请选择"}}</view>
                </picker>
            </view>

            <view class="cu-form-group margin-top">
                <textarea
                    maxlength="500"
                    :value="payload.description"
                    @input="e=>iptChange(e,'description')"
                    placeholder="简介"
                ></textarea>
            </view>
        </form>

        <view class="padding flex flex-direction">
            <view class="cu-btn bg-blue lg" @click="toSave">保存</view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        item: { type: Object, default: {} },
    },
    data() {
        return {
            payload: {},

            ///education
            educationIndex: -1,
            education: ["初中", "中专", "高中", "大专", "本科", "硕士", "博士"],
        };
    },
   
    watch: {
        payload: {
            deep: true,
            handler(n, o) {
                this.$emit("change", n);
            },
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.payload = { ...this.item };
        },
        iptChange(e, key) {
            this.$set(this.payload, key, e.detail.value);
        },
        birthdayChange(e) {
            this.$set(this.payload, "birthday", e.detail.value);
        },

        educationChange(e) {
            this.educationIndex = e.detail.value;
            this.$set(
                this.payload,
                "education",
                this.education[this.educationIndex]
            );
        },
        toSave() {
            this.$emit("save", { ...this.payload });
        },
        toChangeAvatar() {
            uni.chooseImage({
                count: 1, //默认9
                sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album", "camera"], //从相册选择
                success: (res) => {
                    let file = res.tempFilePaths[0];
                    this.$emit("avatar", file);
                },
            });
        },
    },
};
</script>