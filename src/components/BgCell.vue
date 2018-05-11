<template>
    <v-touch class="bg-cell" :class="{'no-right': !hasRight, column: column}" @tap="onTap">
        <div class="label">
            <slot name="left"></slot>
        </div>
        <div class="content">
            <slot name="middle"></slot>
        </div>
        <div class="action" v-show="hasRight">
            <slot name="right">
                <img src="../assets/image/arrow.png">
            </slot>
        </div>
    </v-touch>
</template>

<script>
    export default {
        name: "BgCell",
        props: {
            arrow: {
                default: false
            },
            column: {
                default: false
            }
        },
        computed: {
            hasRight(){
                return !!this.$slots.right || this.arrow;
            }
        },
        methods: {
            onTap(e){
                this.$emit('tap', e);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .bg-cell {
        padding: 15/37.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: @white;
        .label {
            font-size: 16/37.5rem;
            color: @text-grey;
        }
        .content {
            flex: 1;
            margin-left: 0.5rem;
            display: flex;
            flex-direction: row-reverse;
        }
        .action {
            width: 20/37.5rem;
            height: auto;
            display: flex;
            flex-direction: row-reverse;
        }
        &.no-right {
            .content {
                display: flex;
                flex-direction: row-reverse;
            }
        }
        &.column {
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .label {
                width: 100%;
            }
            .content {
                margin-left: 0;
                width: 100%;
                margin-top: 0.3rem;
                flex-direction: row;
            }
        }
        & + .bg-cell {
            border-top: 1px solid #f1f1f1;
        }
    }
</style>
