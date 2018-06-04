<template>
    <div class="bg-action-card-item" :class="{active: active}">
        <div class="action-card-title">
            <slot name="title"></slot>
        </div>
        <div class="action-card-content">
            <slot></slot>
            <span v-show="arrow">
                <img src="../assets/image/arrow-right.png">
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BgActionCardItem",
        componentName: 'BgActionCardItem',
        props: {
            active: {
                type: Boolean,
                default: false
            },
            arrow: {
                default: false
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .bg-action-card-item {
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
        padding: 10/37.5rem;
        height: 100%;
        border-radius: 5/37.5rem;
        border: 1px solid #efefef;
        &.active {
            background: #FFFAE8;
            border: 1px solid #fc9;
        }
        .action-card-title {
            font-size: 16/37.5rem;
            color: @golden;
        }
        .action-card-content {
            font-size: 14/37.5rem;
            color: @text-grey;
            margin-top: 10/37.5rem;
            img {
                width: 6/37.5rem;
                vertical-align: middle;
            }
        }
    }
</style>
