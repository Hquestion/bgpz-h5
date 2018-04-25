<template>
    <div class="food-cart-container">
        <bg-header :title="restaurantName">
            <div slot="action" @click="changeRestaurant()">
                <mt-button icon="more"/>
            </div>
        </bg-header>
        <div class="food-cart-main">
            <div class="is-left">
                <bg-tab v-model="currentCate" @tab-change="onFoodCateChange">
                    <bg-tab-card v-for="(cate, index) in categoryList" :key="cate.id" :id="cate.id">
                        <div class="food-cate">
                            <div class="food-cate-name" v-text="cate.name"></div>
                            <bg-badge class="food-cate-count" v-show="cate.count > 0" :number="cate.count"/>
                        </div>
                    </bg-tab-card>
                </bg-tab>
            </div>
            <div class="food-bus">
                <div v-for="(food, index) in foodList" :key="index">
                    <food-selector :food="food" @add-to-cart="addFoodToCart" @remove-from-cart="removeFoodFromCart"/>
                </div>
            </div>
        </div>
        <div class="food-cart-footer">
            <div class="cart-container">
                <v-touch class="cart-icon" @tap="toggleFoodCart">
                    <img src="../assets/image/gouwuche.jpg">
                    <bg-badge class="badge" :number="foodCartList.length"></bg-badge>
                    <cart-balls ref="cartBalls" class="cart-ball-container"></cart-balls>
                </v-touch>
                <div class="cart-price">
                    <div class="total-price">共<span v-text="currentPrice"></span>元</div>
                    <div class="buy-tip">
                        <span v-if="canBuy">另需服务费168元</span>
                        <span v-else>不含服务费</span>
                    </div>
                </div>
                <bg-popup class="cart-popup" v-model="cartVisible">
                    <cart :data="cartData" @add-food="addCartFood" @remove-food="removeCartFood"></cart>
                </bg-popup>
            </div>
            <div class="price-container" :class="{enable: canBuy}">
                <v-touch v-if="canBuy" @tap="doBuy()">
                    去结算
                </v-touch>
                <div class="buy-disable" v-else>
                    <div class="dist">还差<span v-text="distToMinPrice"></span>元</div>
                    <div class="tip">{{config && config.minSinglePrice}}元起</div>
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
    import BgTab from '../components/BgTab';
    import BgTabCard from '../components/BgTabCard';

    import api from '../api';
    import BgBadge from "../components/BgBadge";
    import BgPopup from "../components/BgPopup";
    import Cart from "../components/Cart";

    export default {
        name: "food-cart",
        components: {
            Cart,
            BgPopup,
            BgBadge,
            CartBalls,
            BgHeader,
            MtButton: Button,
            MtActionsheet: Actionsheet,
            NumberInput,
            FoodSelector,
            BgTab,
            BgTabCard
        },
        data() {
            return {
                restaurantName: '好记大酒店',
                actions: [],
                sheetVisible: false,
                foodList: [],
                foodCartList: [],
                totalPrice: 0,
                categoryList: [],
                currentCate: '',
                config: {},
                cartVisible: false
            };
        },
        methods: {
            init(){
                let companyId = this.$route.query.companyId;
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
                this.actions = actionList;
                this.getConfiguration();
                this.getFoodCateList(companyId).then(res => {
                    this.categoryList = res;
                    this.currentCate = res[0] && res[0].id || '';
                    if(this.currentCate) {
                        this.getFoodListByCate(this.currentCate, companyId).then(res => {
                            this.foodList = res;
                            this.syncFoodWithCart();
                        });
                    }
                });
            },
            back(){
                this.$router.go(-1);
            },
            changeRestaurant(){
                this.sheetVisible = true;
            },
            addFoodToCart(el, e, food){
                this.$refs.cartBalls.drop(el, e).then(()=>{
                    this.foodCartList.push({
                        id: food.id,
                        name: food.name,
                        price: food.price,
                        cateId: this.currentCate
                    });
                    let currentCate = this.categoryList.find(item => item.id === this.currentCate);
                    currentCate.count = (currentCate.count || 0) + 1;
                });
            },
            removeFoodFromCart(el, e, food){
                this.$refs.cartBalls.remove(el, e).then(()=>{
                    let index = this.foodCartList.findIndex(item => {
                        return item.id === food.id;
                    });
                    if(index >= 0) {
                        this.foodCartList.splice(index, 1);
                        let currentCate = this.categoryList.find(item => item.id === this.currentCate);
                        currentCate.count = ((currentCate.count || 0) - 1) || 0;
                    }
                });
            },
            getFoodCateList(companyId) {
                return new Promise((resolve, reject) => {
                    api.getFoodCateList(companyId).then(res => {
                        resolve(res.data.list);
                    }, reject);
                });
            },
            getFoodListByCate(cate, companyId){
                return new Promise((resolve, reject) => {
                    api.getFoodListByCategory(cate, companyId).then(res => {
                        res.data.list.forEach(item => item.count = 0);
                        resolve(res.data.list);
                    }, reject);
                });
            },
            onFoodCateChange(id){
                this.getFoodListByCate(id, this.$route.query.companyId).then(res => {
                    this.foodList = res;
                    this.syncFoodWithCart();
                });
            },
            getConfiguration(){
                api.getCfg(["phone400","packageDefaultPeopleRange","minSinglePrice"]).then(res => {
                    this.config = res.data.list;
                });
            },
            toggleFoodCart(){
                this.cartVisible = !this.cartVisible;
            },
            doBuy(){
                //跳转下单页面
                let foodNumber = 0;
                let allPrice = 0;
                let maxPrice = 0;
                let imageUrl = '';
                let serviceData = [];
                this.cartData.forEach(item => {
                    foodNumber += item.count;
                    allPrice += +item.price * item.count;
                    if(item.price > maxPrice) {
                        maxPrice = item.price;
                        imageUrl = item.imageUrl
                    }
                    let son = {id:item.id,num:item.count,type: '1'};
                    serviceData.push(son);
                });
                let packageDetail = {foodNumber:foodNumber,price:allPrice,peopleRange:"8-10",name:"菜品单点",imageUrl:imageUrl};
                localStorage.setItem("foodOrderCar",JSON.stringify({ServerList:serviceData,price:allPrice,companyId: this.$route.query.companyId}));
                localStorage.setItem("packageDetail",JSON.stringify(packageDetail));
                //跳转老下单页面
                location.href = '';
            },
            addCartFood(food){
                this.foodCartList.push({
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    cateId: food.cateId,
                    imageUrl: food.imageUrl
                });
                let cate = this.categoryList.find(item => item.id === food.cateId);
                cate.count = (cate.count || 0) + 1;
                this.syncFoodWithCart();
            },
            removeCartFood(food) {
                let index = this.foodCartList.findIndex(item => item.id === food.id);
                this.foodCartList.splice(index, 1);
                let cate = this.categoryList.find(item => item.id === food.cateId);
                cate.count = (cate.count || 0) - 1 || 0;
                this.syncFoodWithCart();
            },
            syncFoodWithCart(){
                this.foodList.forEach(food => {
                    let foodMeta = this.cartData.find(item => {
                        return food.id === item.id;
                    });
                    if(foodMeta) {
                        food.count = foodMeta.count;
                    }else {
                        food.count = 0;
                    }
                });
            }
        },
        computed:{
            currentPrice(){
                let price = 0;
                this.foodCartList.forEach(item => {
                    price += +item.price;
                });
                return price;
            },
            distToMinPrice(){
                if(this.config.minSinglePrice) {
                    return this.config.minSinglePrice - this.currentPrice;
                }
            },
            canBuy(){
                return typeof this.distToMinPrice !== 'undefined' && this.distToMinPrice <= 0;
            },
            cartData(){
                let result = [];
                this.foodCartList.forEach(item => {
                    let puttedItem = result.find(puttedItem => {
                        return item.id === puttedItem.id;
                    });
                    if(puttedItem) {
                        puttedItem.count += 1;
                    }else {
                        result.push({
                            name: item.name,
                            id: item.id,
                            count: 1,
                            price: item.price,
                            cateId: item.cateId,
                            imageUrl: item.imageUrl
                        });
                    }
                });
                return result;
            }
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
        border-top: 1px solid #e2e2e2;
        .food-bus {
            flex: 1;
            height: 100%;
            -webkit-overflow-scrolling: touch;
            overflow: auto;
            padding: 0.5rem 0;
        }
        .is-left {
            width: 6rem;
            height: 100%;
            background: @light;
            overflow: auto;
            .food-cate {
                padding: 0.2rem 0.4rem;
                font-size: 0.9rem;
                position: relative;
                .food-cate-count {
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
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
                z-index: 5;
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
                    right: -0.1rem;
                    top: 0.4rem;
                }
                .cart-ball-container {
                    position: absolute;
                    left: 2.5rem;
                    top: 2.5rem;
                }
            }
        }
        .cart-price {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: center;
            padding-left: 0.5rem;
            .total-price {
                font-size: 1.1rem;
                position: relative;
                top: -0.3rem;
                span {
                    padding: 0 0.4rem;
                }
            }
            .buy-tip{
                font-size: 0.7rem;
                color: @text-grey;
            }

        }
        .price-container {
            width: 28%;
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
                .dist {
                    font-size: 0.9rem;
                    padding: 0.3rem 0;
                }
                .tip {
                    font-size: 0.7rem;
                    color: @text-grey;
                }
            }
        }
    }
    .cart-popup {
        width: 100%;
        height: calc(100vh - 4rem);
        position: fixed;
        top: 0;
        left: 0;
    }
</style>
