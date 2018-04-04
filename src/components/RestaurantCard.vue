<template>
    <div class="restaurant-card">
        <div class="card-main">
            <div class="header-hat"></div>
            <div class="title">
                <div v-text="data.name"></div>
            </div>
            <div class="brief text-clamp">
                {{data.description}}
            </div>
            <lengend-card title="招牌菜" class="food-recommand">
                <div slot="content">
                    招牌菜
                </div>
            </lengend-card>
            <div class="main-foot">
                <span>中央厨房地址</span>
                <span v-text="data.address"></span>
            </div>
        </div>
        <div class="card-footer">
            <div>已服务<span v-text="data.serviceCount"></span>次</div>
            <div>您周边5公里范围内有<span v-text="data.likeCount"></span>人喜欢</div>
            <v-touch class="btn btn-radius" @tap="startOrdering">
                <div class="btn-block">开始点餐</div>
            </v-touch>
        </div>
    </div>
</template>

<script>
    import LengendCard from './LengendCard';
    export default {
        name: "restaurant-card",
        props: {
            data: {}
        },
        components: {
            LengendCard
        },
        methods: {
            startOrdering() {
                this.$router.push({
                    name: 'FoodCart'
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .restaurant-card {
        width: 100%;
        height: 100%;
    }
    .card-main {
        width: 100%;
        height: 65%;
        padding: @boxPadding;
        border-radius: @radius;
        position: relative;
        box-shadow: 0 5px 15px 0px #d44;
    }
    .header-hat {
        background: @red;
        width: 100%;
        height: @radius;
        top: 0;
        left: 0;
        position: absolute;
        border-radius: @radius @radius 0 0;
    }
    .title {
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: @red;
        font-size: 1.2rem;
        height: 14%;
    }
    .brief {
        font-size: 0.8rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        text-indent: 1em;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        text-overflow: ellipsis;
        height: 26%;
    }
    .food-recommand {
        height: 40%;
    }
    .main-foot {
        height: 20%;
        border-top: 1px dashed #dedede;
        font-size: 0.8rem;
        padding-top: 8%;
        text-align: center;
    }
    .card-footer {
        width: 90%;
        height: 20%;
        background: @red;
        text-align: center;
        padding: 0.8rem 0.5rem;
        color: #fff;
        margin: 0 auto;
        position: relative;
        font-size: 0.9rem;
        line-height: 1.4rem;
        border-radius: 0 0 @radius @radius;
        &:before {
            content: '\20';
            display: block;
            position: absolute;
            top: 0;
            width: 90%;
            height: 0.5rem;
            background: rgba(255, 255, 255, .5);
            border-radius: 0 0 1rem 1rem;
            left: 5%;
        }
        .btn {
            position: absolute;
            left: 50%;
            bottom: -2.2rem;
            transform: translate3d(-50%, 0, 0);
            width: 4.4rem;
            height: 4.4rem;
            background: #fff;
            border-radius: 4.4rem;
            color: red;
            box-shadow: 0 0 6px 1px #e88;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .btn-block {
                width: 50%;
            }
        }
    }
</style>
