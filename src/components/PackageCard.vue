<template>
    <div class="package-card">
        <div class="package-poster">
            <img :src="data.imageUrl">
        </div>
        <div class="package-info">
            <div class="package-name">{{data.name}}</div>
            <div class="package-food">共{{data.foodNumber}}道菜/桌（{{data.peopleRange}}人）</div>
        </div>
    </div>
</template>

<script>
    import BgArticleTitle from "./BgArticleTitle";
    export default {
        name: "ParckageCard",
        components: {BgArticleTitle},
        props: {
            data: {}
        },
        data(){
            return {

            };
        },
        methods: {

        },
        mounted() {

        }
    }
</script>

<style lang="less" scoped>
    .package-card {
        width:100%;
        background: #fff;
        padding-top: 5/16rem;
        .package-poster {
            width: 100%;
            background-image: ~"url('../assets/image/taocangbiankuang.png')";
            background-size: 100% 100%;
            text-align: center;
            padding: 12/37.5rem;
            img {
                width: 100%;
            }
        }
        .package-info {
            padding: 10/37.5rem;
            font-size: 16/37.5rem;
            .package-food {
                font-size: 14/37.5rem;
                color: #999;
                margin-top: 5/37.5rem;
            }
        }
    }
</style>
