<template>
    <div class="bg-action-card-group" :class="[className]">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "BgActionCardGroup",
        data(){
            return {
                slotsCount: 0
            }
        },
        computed: {
            className(){
                return `col-${this.slotsCount}`;
            }
        },
        mounted(){
            this.slotsCount = this.$children.length;
        }
    }
</script>

<style lang="less">
    .bg-action-card-group {
        width: 100%;
        padding: 0 15/37.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .bg-action-card-item {
            background: #fff;
        }
        & + .bg-action-card-group {
            margin-top: 15/37.5rem;
        }
        &.col-3 {
            height: 75/37.5rem;
            .bg-action-card-item {
                width: calc(33.333% - 0.1778rem);
            }
        }
        &.col-2 {
            height: 80/37.5rem;
            .bg-action-card-item {
                width: calc(50% - 0.2rem);
            }
        }
        &.col-1 {
            height: 50/37.5rem;
            .bg-action-card-item {
                width: 100%;
                flex-direction: row;
                justify-content: space-between;
                .action-card-content {
                    margin-top: 0;
                }
            }
        }
    }
</style>
