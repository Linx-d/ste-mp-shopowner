<template>
    <view class="h100 flex-row align-center" style="background:#000000">
        <cu-custom bg-color="bg-white" :is-back="true">
            <block slot="content" class="my-text-color-black text-bold">视频播放</block>
        </cu-custom>

        <video
            class="flex-1"
            v-if="videoLink"
            :src="videoLink"
            :autoplay="true"
            direction="0"
            controls="true"
            id="videoId"
            @error="videoErrorCallback"
        ></video>
    </view>
</template>

<script>
export default {
    data() {
        return {
            videoLink: null,
            videoContext: null,
        };
    },
    onLoad(options) {
        this.videoLink = options.src;
    },
    onReady() {
        this.videoContext = uni.createVideoContext("videoId", this);
    },
    mounted() {
        this.$nextTick(() => {
            this.videoContext.play();
            this.videoContext.requestFullScreen();
        });
    },
    methods: {
        videoErrorCallback(e) {
            console.log(e);
            this.toast("播放错误");
        },
    },
};
</script>