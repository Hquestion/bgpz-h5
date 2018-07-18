<template>
    <div class="order-brief-card">
        <div class="order-img">
            <img :src="poster">
        </div>
        <div class="order-info">
            <div class="order-type-name">{{orderName}}</div>
            <div class="order-content-brief">共{{foodsCount}}道菜/桌<span v-if="packageRange">（{{packageRange}}）</span></div>
        </div>
        <div class="order-price">
            <img src="../assets/image/moneyicon.png"><span>{{totalPrice}}元</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OrderBriefCard",
        props: {
            packageInfo: {},
            foodInfo: {},
            avatar: {

            },
            name: {},
            price: {},
            num: {}
        },
        computed: {
            poster(){
                if(this.avatar) {
                    return this.avatar;
                }else if(this.packageInfo) {
                    return this.packageInfo.imageUrl;
                }else if(this.foodInfo){
                    let foodList = this.foodInfo && this.foodInfo.foods || [];
                    foodList.sort((a,b) => +a.price - +b.price);
                    return foodList[0] && foodList[0].food.imageUrl || '';
                }else {
                    return '';
                }
            },
            orderName(){
                return this.name || (this.packageInfo && this.packageInfo.name) || '';
            },
            foodsCount(){
                return this.num || (this.foodInfo && this.foodInfo.foods && this.foodInfo.foods.length || 0);
            },
            packageRange(){
                if(this.packageInfo) {
                    return this.packageInfo.peopleRange;
                }else {
                    return '';
                }
            },
            totalPrice(){
                return this.price || this.foodInfo && this.foodInfo.price || '';
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .order-brief-card {
        width: 100%;
        padding: 10/37.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: #fff;
        border-bottom: 1px solid #dedede;
        .order-img {
            width: 40/37.5rem;
            height: 40/37.5rem;
            img {
                width: 100%;
                height: 100%;
                border-radius: 40/37.5rem;
            }
        }
        .order-info {
            flex: 1;
            margin-left: 10/37.5rem;
            font-size: 15/37.5rem;
            .order-content-brief {
                color: #999;
                font-size: 12/37.5rem;
                margin-top: 5/37.5rem;
            }
        }
        .order-price {
            color: @red;
            font-size: 15/37.5rem;
            img {
                vertical-align: middle;
            }
            span {
                margin-left: 5/37.5rem;
                vertical-align: middle;
            }
        }
    }
</style>
