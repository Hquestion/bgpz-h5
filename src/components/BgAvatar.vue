<template>
    <div class="bg-avatar" :style="style">
        <img :src="avatarUrl" :style="style" @error="onImgError">
    </div>
</template>

<script>
    const defaultAvatarUrl = require('../assets/image/default-avatar.png');
    export default {
        name: "BgAvatar",
        props: {
            src: {
                default: defaultAvatarUrl
            },
            width: {
                default: `${50/37.5}rem`
            }
        },
        data(){
            return {
                avatarUrl: ''
            };
        },
        computed: {
            style(){
                return {
                    width: this.width,
                    height: this.width,
                    borderRadius: this.width
                }
            }
        },
        methods: {
            onImgError(e){
                this.avatarUrl = defaultAvatarUrl;
            }
        },
        watch: {
            'src': function(val){
                if(val) {
                    this.avatarUrl = val;
                }else {
                    this.avatarUrl = defaultAvatarUrl;
                }
            }
        },
        mounted(){
            if(!this.src) {
                this.avatarUrl = defaultAvatarUrl;
            }else {
                this.avatarUrl = this.src;
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
