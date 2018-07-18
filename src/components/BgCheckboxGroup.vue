<template>
    <div class="bg-checkbox-group" :class="className">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "BgCheckboxGroup",
        data(){
            return {

            };
        },
        props: {
            single: {
                default: false
            }
        },
        computed: {
            className(){
                return `col-${this.$slots.default.length}`;
            }
        },
        methods: {

        },
        mounted(){

        }
    }
</script>

<style lang="less">
    .bg-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        padding: 0 10/37.5rem;
        text-align: center;
        margin-left: -0.267rem;
        .bg-checkbox-item {
            width: calc(25% - 0.267rem);
            font-size: 14/37.5rem;
            margin-top: 10/37.5rem;
            margin-left: 0.267rem;
        }
        &.col-1 {
            .bg-checkbox-item {
                width: 100%;
            }
        }
        &.col-2 {
            .bg-checkbox-item {
                width: calc(50% - 0.267rem);
            }
        }
    }
</style>
