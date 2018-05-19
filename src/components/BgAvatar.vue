<template>
    <div class="bg-avatar" :style="style">
        <img :src="avatarUrl" :style="style" @error="onImgError">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "BgAvatar",
        props: {
            src: {
                default: require('../assets/image/default-avatar.png')
            },
            width: {
                default: `${50/37.5}rem`
            }
        },
        data(){
            return {
                avatarUrl: '',
                defaultAvatarUrl: require('../assets/image/default-avatar.png')
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
                this.avatarUrl = this.defaultAvatarUrl;
            }
        },
        watch: {
            'src': function(val){
                if(val) {
                    this.avatarUrl = val;
                }else {
                    this.avatarUrl = this.defaultAvatarUrl;
                }
            }
        },
        mounted(){
            if(!this.src) {
                this.avatarUrl = this.defaultAvatarUrl;
            }else {
                this.avatarUrl = this.src;
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
