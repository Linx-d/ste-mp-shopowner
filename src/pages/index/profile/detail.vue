<template>
    <view class="container">
		<cu-custom bg-color="bg-white" is-back="true">
		    <block slot="content" class="my-text-color-black text-bold">个人信息</block>
		</cu-custom>
        <view class="messageBox">
            <app-user-form :item="user" @save="toSave" @avatar="toSaveAvatar" />
        </view>
    </view>
</template>

<script>
import UserService from "@/apis/user";

export default {
    components: {},
    data() {
        return {};
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    methods: {
        toSaveAvatar(file) {
            this.confirm("您确定要修改头像信息吗？", (ok) => {
                if(ok){
                    this.showLoading(()=>{

                    
                    UserService.uploadOssBatch([{type:'image/jpeg',path:file}],'broker/avatar').then(media=>{
                        if(media && media.length > 0){
                            let {path} = media[0];
                            UserService.update({id:this.user.id,avatar:path},res=>{
                                this.hideLoading();
                                if (res.data && res.data.data) {
                                    this.toast('修改成功','success');
                                    this.user.avatar = path;
                                    this.$store.commit('setUser',this.user);
                                }else{
                                    this.toast('修改失败','error')
                                }
                            })
                        }else{
                            this.hideLoading();
                            this.toast('上传失败','error')
                        }
                    })
                    })
                }
            });
        },
        toSave(payload) {
            this.confirm("您确定要保存个人信息吗？", (ok) => {
                if (ok) {
					if(payload.birthday && payload.birthday.length != 19){
						payload.birthday = payload.birthday+' 00:00:00';
					}
                    UserService.update(payload, (res) => {
                        if (res.data && res.data.data) {
							this.$store.commit('setUser',payload)
							this.toast('保存成功','success',()=>{

								uni.navigateBack(-1)
							});
							
                        }else{
							this.toast('保存失败','error');
						}
					});
                }
            });
        },
    },
};
</script>