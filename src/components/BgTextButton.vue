<template>
    <v-touch class="bg-text-button" @tap="onBtnTap" @click="onBtnClick">
        <span class="icon">
            <slot name="icon"></slot>
        </span>
        <span class="text">
            <slot></slot>
        </span>
    </v-touch>
</template>

<script>
    export default {
        name: "BgTextButton",
        methods: {
            onBtnTap(){
                this.$emit('tap');
            },
            onBtnClick(){
                this.$emit('click');
            }
        }
    }
</script>

<style lang="less" scoped>
    .bg-text-button {
        padding: 5/37.5rem 10/37.5rem;
        display: inline-block;
        font-size: 0;
        .icon {
            display: inline-block;
            vertical-align: middle;
        }
        .text {
            font-size: 14/37.5rem;
            margin-left: 5/37.5rem;
            vertical-align: middle;
        }
    }
</style>
