<template>
    <div class="lengend-card">
        <div class="card-title">
            <div class="line"></div>
            <div class="title">
                <slot name="title">
                    {{title}}
                </slot>
            </div>
        </div>
        <div class="content">
            <slot name="content">

            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "lengend-card",
        props: {
            title: {}
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .lengend-card {
        padding: 0.3rem 0;
    }
    .card-title {
        position: relative;
        height: 1.8rem;
    }
    .card-title .line {
        position: absolute;
        width: 86%;
        height: 1px;
        left: 7%;
        top: 50%;
        transform: translateY(-50%);
        background: #dedede;
        &::after {
            content: '\20';
            display: block;
            position: absolute;
            right: -8px;
            top: -4px;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            border: 1px solid #dedede;
        }
        &::before {
            content: '\20';
            display: block;
            position: absolute;
            left: -8px;
            top: -4px;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            border: 1px solid #dedede;
        }
    }
    .title {
        color: @red;
        display: inline-block;
        padding: 0 0.5rem;
        background: #fff;
        font-size: 1rem;
        z-index: 10;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
    }
    .content {
        padding: 0.2rem 0;
    }
</style>
