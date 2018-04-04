<template>
    <div class="food-cart-container">
        <bg-header :title="restaurantName">
            <div slot="action" @click="changeRestaurant()">
                <mt-button icon="more"/>
            </div>
        </bg-header>
        <div class="food-cart-main">
            <div class="is-left">
                菜品种类
            </div>
            <div class="food-bus">
                <div v-for="(food, index) in foodList" :key="index">
                    <food-selector :food="food" @add-to-cart="addFoodToCart" @remove-from-cart="removeFoodFromCart"/>
                </div>
            </div>
        </div>
        <div class="food-cart-footer">
            <div class="cart-container">
                <div class="cart-icon">
                    <img src="../assets/image/gouwuche.jpg">
                    <div class="badge" v-text="foodCartList.length"></div>
                    <cart-balls ref="cartBalls" class="cart-ball-container"></cart-balls>
                </div>
                <div class="cart-price">
                    <div class="">共<span v-text="totalPrice"></span>元</div>
                    <div class="buy-tip">
                        <span v-if="canBuy">另需服务费168元</span>
                        <span v-else>不含服务费</span>
                    </div>
                </div>
            </div>
            <div class="price-container" :class="{enable: canBuy}">
                <div v-if="canBuy" v-touch @tap="doBuy()">
                    去结算
                </div>
                <div class="buy-disable" v-else>
                    <div class="">还差<span></span>元</div>
                    <div>1200元起</div>
                </div>
            </div>
        </div>
        <mt-actionsheet
            :actions="actions"
            v-model="sheetVisible">
        </mt-actionsheet>
    </div>
</template>

<script>
    import BgHeader from '../components/BgHeader';
    import {Button, Actionsheet } from 'mint-ui';
    import NumberInput from '../components/NumberInput';
    import FoodSelector from '../components/FoodSelector';
    import CartBalls from "../components/CartBalls";

    export default {
        name: "food-cart",
        components: {
            CartBalls,
            BgHeader,
            MtButton: Button,
            MtActionsheet: Actionsheet,
            NumberInput,
            FoodSelector
        },
        data() {
            return {
                restaurantName: '好记大酒店',
                actions: [],
                sheetVisible: false,
                foodList: [{
                    id: 1,
                    imageUrl: 'http://eightplate.b0.upaiyun.com/1521526697.jpg',
                    name: '蒜蓉波士顿龙虾',
                    price: 188,
                    count: 0
                },{
                    id: 11,
                    imageUrl: 'http://eightplate.b0.upaiyun.com/1521526697.jpg',
                    name: '蒜蓉波士顿龙虾',
                    price: 188,
                    count: 0
                },{
                    id: 12,
                    imageUrl: 'http://eightplate.b0.upaiyun.com/1521526697.jpg',
                    name: '蒜蓉波士顿龙虾',
                    price: 188,
                    count: 0
                },{
                    id: 13,
                    imageUrl: 'http://eightplate.b0.upaiyun.com/1521526697.jpg',
                    name: '蒜蓉波士顿龙虾',
                    price: 188,
                    count: 0
                },{
                    id: 14,
                    imageUrl: 'http://eightplate.b0.upaiyun.com/1521526697.jpg',
                    name: '蒜蓉波士顿龙虾',
                    price: 188,
                    count: 0
                },{
                    id: 15,
                    imageUrl: 'http://eightplate.b0.upaiyun.com/1521526697.jpg',
                    name: '蒜蓉波士顿龙虾',
                    price: 188,
                    count: 0
                },{
                    id: 16,
                    imageUrl: 'http://eightplate.b0.upaiyun.com/1521526697.jpg',
                    name: '蒜蓉波士顿龙虾',
                    price: 188,
                    count: 0
                }],
                foodCartList: [],
                canBuy: false,
                totalPrice: 0
            };
        },
        methods: {
            init(){
                let list = [1,2,3,4,5];
                let actionList = [];
                list.forEach(function(item){
                    actionList.push({
                        name: '家家宴大酒店',
                        method: function(){
                            console.log('ee')
                        }
                    });
                });
                this.actions = actionList
            },
            back(){
                this.$router.go(-1);
            },
            changeRestaurant(){
                this.sheetVisible = true;
            },
            addFoodToCart(el, e, food){
                this.$refs.cartBalls.drop(el, e).then(()=>{
                    this.foodCartList.push(food);
                });
            },
            removeFoodFromCart(el, e, food){
                this.$refs.cartBalls.remove(el, e).then(()=>{
                    let index = this.foodCartList.findIndex(item => {
                        return item.id === food.id;
                    });
                    if(index >= 0) {
                        this.foodCartList.splice(index, 1);
                    }
                });
            }
        },
        computed:{

        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import '../assets/less/variable';
    .food-cart-container {
        background: #f2f2f2;
        height: 100vh;
        padding-top: 60px;
    }
    .food-cart-main {
        width: 100%;
        height: calc(100vh - 60px - 4rem);
        background: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        -webkit-overflow-scrolling: touch;
        overflow: auto;
        .food-bus {
            flex: 1;
        }
    }
    .food-cart-footer {
        width: 100%;
        height: 4rem;
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: flex-start;
        color: @white;
        .cart-container {
            width: 75%;
            height: 100%;
            background: @dark;
            display: flex;
            padding: 0.5rem;
            .cart-icon {
                width: 5rem;
                height: 5rem;
                background: @dark;
                border-radius: 5rem;
                position: relative;
                top: -1.5rem;
                img {
                    position: absolute;
                    left: 1.3rem;
                    top: 1.5rem;
                    width: 2rem;
                    height: 2rem;
                    display: block;
                }
                .badge {
                    position: absolute;
                    background: @red;
                    color: @white;
                    right: -0.1rem;
                    top: 0.4rem;
                    width: auto;
                    height: auto;
                    text-align: center;
                    line-height: 1;
                    border-radius: 20px;
                    padding: 0.3rem 0.2rem;
                    font-size: 0.6rem;
                    min-width: 1.2rem;
                }
                .cart-ball-container {
                    position: absolute;
                    left: 2.5rem;
                    top: 2.5rem;
                }
            }
        }
        .price-container {
            width: 25%;
            height: 100%;
            background: @grey;
            &.enable {
                background: @red;
                text-align: center;
                line-height: 4rem;
                font-size: 1.2rem;
            }
            .buy-disable {
                display: flex;
                flex-direction: column;
                height: 100%;
                justify-content: center;
                padding-left: 0.5rem;
            }
        }
    }
</style>
