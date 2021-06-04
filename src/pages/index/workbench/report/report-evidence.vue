<template>
    <view>
        <cu-custom bg-color="bg-white" :is-back="true">
            <block slot="content"  class="my-text-color-black text-bold">到访证据链</block>
        </cu-custom>

        <form>
            <view class="cu-form-group margin-top">
                <view class="title">客户</view>
                <view>{{client.name||'-'}}</view>
            </view>
            <view class="cu-form-group">
                <view class="title">客户手机</view>
                <view>{{client.phone||'-'}}</view>
            </view>
            <view class="cu-form-group">
                <view class="title">经纪人</view>
                <view>{{broker.name||'-'}}</view>
            </view>
            <view class="cu-form-group">
                <view class="title">到访时间</view>
                <view>{{report.acceptTime||'-'}}</view>
            </view>

            <view class="cu-form-group margin-top">
                <view class="title">置业顾问</view>
                <view>{{consultant?consultant.name:'-'}}</view>
            </view>

            <view v-if="report.evidence.length > 0">
                <view class="cu-bar bg-white margin-top">
                    <view class="action">已上传证据</view>
                    <view class="action">{{ report.evidence.length }}/{{max}}</view>
                </view>
                <view class="padding-lr bg-white">
                    <app-media-grid :media="report.evidence" />
                </view>
            </view>

            <view class="cu-bar bg-white margin-top" v-if="leftSize > 0 || imgSize > 0">
                <view class="action">上传证据</view>
                <view class="action">{{ fileList.length }}/{{leftSize}}</view>
            </view>

            <view class="cu-form-group" v-if="leftSize > 0 || imgSize >0">
                <view class="grid col-4 grid-square flex-sub">
                    <view
                        class="bg-img"
                        v-for="(item, index) in fileList"
                        :key="index"
                        @click="ViewImage"
                        :data-url="fileList[index].thumb"
                    >
                        <image :src="fileList[index].thumb" mode="aspectFill" />
                        <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
                            <text class="cuIcon-close"></text>
                        </view>
                    </view>
                    <view class="solids" @tap="ChooseImage" v-if="(leftSize - imgSize) > 0">
                        <text class="cuIcon-cameraadd"></text>
                    </view>
                </view>
            </view>
            <div class="padding text-orange">注：已上传内容不可编辑</div>

            <view class="padding flex flex-direction margin-top">
                <button class="cu-btn bg-blue lg" @click="toCommit" :disabled="imgSize === 0">提交</button>
            </view>
        </form>
    </view>
</template>

<script>
import Service from "@/apis/service";
import ReportService from "@/apis/report";
import ClientService from "@/apis/client";

export default {
    data() {
        return {
            fileList: [],
            modalName: null,

            clientId: "",
            reportId: "",

            max: 9,

            report: {},
        };
    },
    computed: {
        client() {
            return this.report ? this.report.client : null;
        },
        broker() {
            return this.report ? this.report.broker : null;
        },
        consultant() {
            return this.report ? this.report.consultant : null;
        },
        imgSize() {
            return this.fileList.length;
        },
        leftSize() {
            return (
                this.max -
                (this.report ? (this.report.evidence || []).length : 0)
            );
        },
    },
    onLoad(options) {
        this.reportId = options.reportId;
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            ReportService.byId(this.reportId, (res) => {
                if (res.data) {
                    this.report = res.data;
                }
            });
        },

        ChooseImage() {
            uni.chooseMedia({
                count: this.leftSize - this.imgSize, //默认9
                mediaType: ["image", "video"],
                sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album", "camera"], //从相册选择
                success: (res) => {
                    let { tempFiles, type } = res;

                    let arr =
                        type === "video"
                            ? [
                                  {
                                      type: "video/mp4",
                                      path: tempFiles[0].tempFilePath,
                                      thumb: tempFiles[0].thumbTempFilePath,
                                  },
                              ]
                            : tempFiles.map((i) => {
                                  let path = i.tempFilePath;
                                  return {
                                      type: "image/jpeg",
                                      path,
                                      thumb: path,
                                  };
                              });

                    if (this.fileList.length > 0) {
                        this.fileList = [...this.fileList, ...arr];
                    } else {
                        this.fileList = [...arr];
                    }
                },
            });
        },
        ViewImage(e) {
            uni.previewImage({
                urls: this.fileList.map((i) => i.thumb),
                current: e.currentTarget.dataset.url,
            });
        },
        DelImg(e) {
            this.confirm("确定删除此内容吗？", (ok) => {
                if (ok) {
                    this.fileList.splice(e.currentTarget.dataset.index, 1);
                }
            });
        },

        toCommit() {
            this.confirm("确定要提交证据链吗？", (ok) => {
                if (ok) {
                    this.showLoading(() => {
                        Service.uploadOssBatch(
                            this.fileList,
                            "/report/evidence/" + this.reportId
                        ).then((media) => {
                            this.hideLoading();
                            if (media) {
                                let urls = [
                                    ...this.report.evidence,
                                    ...media,
                                ].map((m) => {
                                    return (
                                        Service.URI_API + "/rest/medias/" + m.id
                                    );
                                });
                                ReportService.putEvidence(
                                    this.reportId,
                                    urls.join("\n"),
                                    (res) => {
                                        if (res.statusCode === 204) {
                                            this.toast("保存成功", "success");
                                            this.successBack();
                                        } else {
                                            this.toast("保存失败");
                                        }
                                    }
                                );
                            } else {
                                this.toast("上传附件失败");
                            }
                        });
                    });
                }
            });
        },
        successBack() {
            let pages = getCurrentPages();
            let pre = pages[pages.length - 2]; //当前页面
            pre.$vm.init();

            this.navBack();
        },
    },
};
</script>