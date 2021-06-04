<template>
    <view class="margin-bottom bg-white shadow padding" style="padding-top:5px;border-radius:10px" @click="toClick">
       
        <image :src="item.bankLogo" mode="heightFix" style="height:53px"/>
        
        <view class="flex-row  text-gray">
            <view>{{item.cardName}}</view>
            <view class="flex-1 text-right">{{hideLen(item.card)}}</view>
        </view>
    </view>
</template>

<script>
    export default {
        props:{
            item:{type:Object,default:()=>null}
        },
        computed:{
        },
        methods:{
            toClick(){
                this.$emit('click',this.item);
            }
        },
    }
</script>