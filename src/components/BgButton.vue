<template>
    <v-touch class="bg-button" :class="[size, {block: block}]" @tap="onBtnTap">
        <slot></slot>
    </v-touch>
</template>

<script>
    export default {
        name: "BgButton",
        props: {
            size: {
                default: 'large'
            },
            block: {
                default: false
            }
        },
        methods: {
            onBtnTap(){
                this.$emit('tap');
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .bg-button {
        margin: 0 auto;
        background: @red;
        width: 80%;
        height: 55/37.5rem;
        line-height: 55/37.5rem;
        text-align: center;
        color: @white;
        font-size: 0.5rem;
        border-radius: 5/37.5rem;
        &.block {

        }
        &.large {
            height: 50/37.5rem;
            line-height: 50/37.5rem;
        }
    }
</style>
