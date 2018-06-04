<template>
    <div class="bg-article-title">
        <span>{{title}}</span>
    </div>
</template>

<script>
    export default {
        name: "BgArticleTitle",
        props: {
            title: {}
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .bg-article-title {
        padding: 0.5rem 0;
        text-align: center;
        span {
            color: @golden;
            font-size: 0.5rem;
            position: relative;
            &:after, &:before {
                content: '\20';
                position: absolute;
                top: 50%;
                width: 53/37.5rem;
                height: 12/37.5rem;
                transform: translateY(-50%);
            }
            &:before {
                left: -70/37.5rem;
                background: ~"url(../assets/image/tit-lf.png)";
                background-repeat: no-repeat;
            }
            &:after {
                right: -70/37.5rem;
                background: ~"url(../assets/image/tit-rt.png)";
                background-repeat: no-repeat;
            }
        }
    }
</style>
