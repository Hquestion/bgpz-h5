<template>
    <div class="package-detail">
        <bg-header title="套餐详情"></bg-header>
        <div class="package-poster">
            <img :src="packageMeta.cookImg">
            <div class="package-info">
                <div class="package-name-container">
                    <div class="name">{{packageMeta.name}}<span>{{packageMeta.price}}</span></div>
                    <div class="package-range">共{{packageMeta.foodNumber}}道菜/桌（{{packageMeta.peopleRange}}人）</div>
                </div>
                <div class="sales-count">
                    <div>{{packageMeta.shopNumber}}</div>
                    <div>已售</div>
                </div>
            </div>
        </div>
        <bg-article-title title="套餐内容"></bg-article-title>
        <div class="activity-container" :style="{'background-image': `url(${activity.acteimage})`}">
            <swiper :options="swiperOpt" class="food-swiper" ref="activitySwiper">
                <swiper-slide v-for="(food, index) in activity.typeList" :key="index">
                    <div class="activity-food-item">
                        <img :src="food.imageUrl">
                        <div class="food-name-price">
                            <div class="name-price-box">
                                <div class="food-name">
                                    {{food.name}}
                                </div>
                                <div class="food-price">￥{{food.price}}</div>
                            </div>
                            <div class="number-selector">
                                <number-input :min="0" v-model="food.count" @plus="onActivityFoodPlus(food)" @minus="onActivityFoodMinus(food)"></number-input>
                            </div>
                        </div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
        <div class="package-foods-content">
            <package-food-cate v-for="(foodCate, index) in foodList" :key="index" :food-cate="foodCate"
                               @change-food="onChangeFood" @add-food="onAddFood" @delete-food="onDelFood"></package-food-cate>
        </div>
        <div class="cart-block">
            <div class="cart-icon">
                <img src="../assets/image/cart.png">
            </div>
            <div class="price">
                合计：<span>{{banquetFoodsPrice}}</span>元
            </div>
            <div class="order-btn" @click="doOrder" v-show="distToOrder <= 0">立即下单</div>
            <div class="disable-btn" v-show="distToOrder > 0">还差￥{{distToOrder}}</div>
        </div>
        <vodal class-name="edit-food-modal" :custom-styles="editFoodStyle" :show="editFoodVisible" animation="zoom" @hide="editFoodVisible = false">
            <div class="edit-food-title" v-html="editFoodTitle" :style="{'text-align': toReplaceFood ? 'left': 'center'}"></div>
            <div class="edit-food-container">
                <div class="edit-food-item" v-for="(foodItem, index) in toChangefoodList" :key="index" @click="foodItem.isChecked = !foodItem.isChecked">
                    <div class="food-info">
                        <img :src="foodItem.imageUrl">
                        <div class="food-name-price">
                            <div class="food-name">{{foodItem.name}}</div>
                            <div class="food-price">￥{{foodItem.price}}</div>
                        </div>
                    </div>
                    <div class="checkbox" :class="{active: foodItem.isChecked}"></div>
                </div>
                <div class="empty-holder" v-if="toChangefoodList.length === 0">
                    暂无可{{toReplaceFood ? '替换': '添加'}}菜品
                </div>
            </div>
            <div class="btn-group">
                <div class="btn btn-cancel" @click="editFoodVisible=false">取消</div>
                <div class="btn btn-sure" @click="doChangeFood">确定</div>
            </div>
        </vodal>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import BgArticleTitle from "../components/BgArticleTitle";

    import api from '../api';
    import PackageFoodCate from "../components/PackageFoodCate";
    import {mapActions, mapGetters, mapState} from 'vuex';
    import Vodal from 'vodal';
    import NumberInput from "../components/NumberInput";
    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    export default {
        name: "PackageDetail",
        components: {
            NumberInput,
            PackageFoodCate,
            BgArticleTitle,
            BgHeader,
            Vodal,
            swiper,
            swiperSlide
        },
        data(){
            return {
                packageMeta: {},
                foodList: [],
                editFoodVisible: false,
                editFoodTitle: '添加菜品',
                toChangefoodList: [],
                editFoodStyle: {
                    width: '96vw',
                    height: '70vh',
                    padding: '0'
                },
                banquetFoodsPrice: 0,
                activity: {},
                swiperOpt: {
                    autoplay: false
                },
                toReplaceFood: null,
                toAddCate: null,
                cfg: {}
            };
        },
        computed: {
            ...mapGetters([
                'banquetFoods'
            ]),
            distToOrder(){
                return (+this.cfg.minSinglePrice || 0) - +this.banquetFoodsPrice;
            }
        },
        methods: {
            ...mapActions([
                'setBanquetFoods',
                'setFoodValidationResult',
                'selectBanquetPackage'
            ]),
            getBanquetFoods(){
                let banquetFoods = [];
                this.foodList.forEach(item => {
                    item.typeList.forEach(food => {
                        banquetFoods.push({
                            food: food,
                            count: 1,
                            price: food.price,
                            type: 1,                //1:菜品,2:酒水
                            cate: item.typeId
                        });
                    });
                });
                let selectedActivityFoods = this.activity.typeList && this.activity.typeList.filter(item => item.count > 0) || [];
                selectedActivityFoods.forEach(item => {
                    banquetFoods.push({
                        food: item,
                        count: item.count,
                        price: +item.price,
                        type: 1,                //1:菜品,2:酒水
                    });
                });
                return banquetFoods;
            },
            init(){
                api.getPackageDetail(this.$route.params.id).then(res1 => {
                    this.packageMeta = res1.data;
                    this.banquetFoodsPrice = +this.packageMeta.price;
                    if(this.$route.query.scene === 'company') {
                        res1.data.companyid = res1.data.companyid || res1.data.companyId;
                        this.selectBanquetPackage(res1.data);
                    }
                    api.getPackageFoodList(this.$route.params.id).then(res => {
                        this.foodList = res.data.list;
                        this.setBanquetFoods({
                            foods: this.getBanquetFoods(),
                            price: +this.banquetFoodsPrice
                        });
                    }, ()=> {
                        this.foodList = [];
                    });
                }, ()=>{
                    this.packageMeta = {};
                });

                api.getPackageActivity().then(res => {
                    if(res.data && res.data.length > 0) {
                        let data = res.data[0];
                        data.typeList.forEach(item => item.count = 0);
                        this.activity = data;
                    }else {
                        this.activity = {};
                    }
                }, ()=> {
                    console.log('当前没有特价活动');
                });

                api.getCfg(['minSinglePrice']).then(res => {
                    this.cfg = res.data.list;
                });
            },
            doOrder(){
                api.verifyFoodMatchNumberOfPeople({
                    people_num: this.$store.state.banquet.peopleCount,
                    table_num: this.$store.state.banquet.tableCount,
                    company_id: this.$store.state.banquet.selectPackage.companyid,
                    modelList: this.banquetFoods.foods.map(item => {
                        return {
                            foodid: item.food.id,
                            category_id: item.cate,
                            food_num: item.count
                        };
                    })
                }).then(res => {
                    this.$router.push({
                        name: 'PreOrder',
                        params: {
                            scence: 'banquet'
                        }
                    });
                },(res)=>{
                    console.log(res);
                    this.setFoodValidationResult(res.data);
                    this.$router.push({
                        name: 'BanquetFoodValidation',
                        params: {
                            scene: 'banquet'
                        }
                    });
                });
            },
            onChangeFood(food, index, cate){
                this.editFoodTitle = `将<span class="golden">【${index+1}、${food.name}<span class="red">￥${food.price}</span>】</span>替换为：`;
                this.editFoodVisible = true;
                this.toReplaceFood = {
                    food: food,
                    index: index,
                    cate: cate
                };
                this.toAddCate = null;
                api.getToChangeFoodList(food.id).then(res => {
                    let list = res.data && res.data.list || [];
                    list.forEach(item => item.isChecked = false);
                    this.toChangefoodList = list;
                }, ()=>{
                    this.toChangefoodList = [];
                });
            },
            onAddFood(cate){
                this.editFoodTitle = `添加菜品`;
                this.editFoodVisible = true;
                this.toReplaceFood = null;
                this.toAddCate = cate;
                api.getFoodsByCate(cate.typeNumber, this.packageMeta.companyId).then(res => {
                    let list = res.data && res.data.list || [];
                    list.forEach(item => item.isChecked = false);
                    this.toChangefoodList = list;
                }, ()=>{
                    this.toChangefoodList = [];
                });
            },
            onDelFood(food){
                this.banquetFoodsPrice = this.banquetFoodsPrice - +food.price;
                this.setBanquetFoods({
                    foods: this.getBanquetFoods(),
                    price: +this.banquetFoodsPrice
                });
            },
            doChangeFood(){
                if(this.toReplaceFood) {
                    //如果是替换,跟替换前菜品计算差价，再更新价格和菜品
                    let selectedFoods = this.toChangefoodList.filter(item => item.isChecked);
                    if(selectedFoods.length > 0) {
                        let replacePrice = 0;
                        selectedFoods.forEach(item => replacePrice += +item.price);
                        let newPrice = this.banquetFoodsPrice + replacePrice - +this.toReplaceFood.food.price;
                        this.banquetFoodsPrice = newPrice;
                        this.toReplaceFood.cate.typeList = [
                            ...this.toReplaceFood.cate.typeList.slice(0, this.toReplaceFood.index),
                            ...selectedFoods,
                            ...this.toReplaceFood.cate.typeList.slice(this.toReplaceFood.index + 1)
                        ];
                        this.editFoodVisible = false;
                        this.setBanquetFoods({
                            foods: this.getBanquetFoods(),
                            price: +this.banquetFoodsPrice
                        });
                    }else {
                        commonToast({
                            message: '请先选择想要替换的菜品',
                            position: 'bottom'
                        });
                    }
                } else {
                    let selectedFoods = this.toChangefoodList.filter(item => item.isChecked);
                    if(selectedFoods.length > 0) {
                        let replacePrice = 0;
                        selectedFoods.forEach(item => replacePrice += +item.price);
                        let newPrice = this.banquetFoodsPrice + replacePrice;
                        this.banquetFoodsPrice = newPrice;
                        this.toAddCate.typeList = [
                            ...this.toAddCate.typeList.slice(0),
                            ...selectedFoods
                        ];
                        this.editFoodVisible = false;
                        this.setBanquetFoods({
                            foods: this.getBanquetFoods(),
                            price: +this.banquetFoodsPrice
                        });
                    }else {
                        commonToast({
                            message: '请先选择想要添加的菜品',
                            position: 'bottom'
                        });
                    }
                }
            },
            onActivityFoodPlus(food){
                this.banquetFoodsPrice = +this.banquetFoodsPrice + +food.price;
                this.setBanquetFoods({
                    foods: this.getBanquetFoods(),
                    price: +this.banquetFoodsPrice
                });
            },
            onActivityFoodMinus(food){
                this.banquetFoodsPrice = +this.banquetFoodsPrice - +food.price;
                this.setBanquetFoods({
                    foods: this.getBanquetFoods(),
                    price: +this.banquetFoodsPrice
                });
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less">
    @import "../assets/less/variable";
    .package-detail {
        padding-top: 50px;
        padding-bottom: 60/37.5rem;
        .activity-container {
            padding: 18vw 0 10/37.5rem;
            background-size: 100%;
            background-repeat: no-repeat;
            .activity-food-item {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                background: #fff;
                img {
                    width: 100vw;
                    height: 200/37.5rem;
                }
                .food-name-price {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    width: 100%;
                    padding: 10/37.5rem;
                    .name-price-box {
                        flex: 1;
                        .food-price {
                            color: @red;
                        }
                    }
                    .number-selector {
                        width: 100/37.5rem;
                    }
                }

            }
        }
        .package-poster {
            width: 100%;
            position: relative;
            font-size: 0;
            img {
                width: 100%;
            }
            .package-info {
                position: absolute;
                width: 100%;
                bottom: 0;
                left: 0;
                padding: 10/37.5rem 10/37.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0,0,0,.3);
                color: #fff;
                font-size: 14/37.5rem;
                .package-name-container {
                    .name {
                        font-size: 16/37.5rem;
                        span {
                            background: ~"url('../assets/image/youhui2.png')";
                            padding: 0 10/37.5rem;
                            background-size: 100% 100%;
                            font-size: 0.4rem;
                            margin-left: 0.1rem;
                        }
                    }
                    .package-range {
                        margin-top: 5/37.5rem;
                    }
                }
                .sales-count {
                    display: flex;
                    justify-content: flex-end;
                    flex-direction: column;
                    align-items: flex-end;
                }
            }
        }
        .package-foods-content {
            background: #fff;
        }
        .cart-block {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            height: 50/37.5rem;
            position: fixed;
            left: 0;
            bottom: 0;
            background: #fff;
            padding: 0 15/37.5rem;
            z-index: 2;
            .cart-icon {
                width: 40/37.5rem;
                height: 40/37.5rem;
                transform: scale(1.2);
                position: relative;
                top: -8/37.5rem;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .price {
                margin-left: 10/37.5rem;
                flex: 1;
                span {
                    color: @red;
                }
            }
            .order-btn {
                width: 100/37.5rem;
                height: 40/37.5rem;
                text-align: center;
                line-height: 40/37.5rem;
                background: @red;
                color: @white;
                border-radius: 5/37.5rem;
            }
            .disable-btn {
                width: 120/37.5rem;
                height: 40/37.5rem;
                text-align: center;
                line-height: 40/37.5rem;
                background: @grey;
                color: @white;
                border-radius: 5/37.5rem;
            }
        }
        .edit-food-modal {
            .edit-food-title {
                width: 100%;
                height: 50/37.5rem;
                line-height: 50/37.5rem;
                background: #f2f2f2;
                font-size: 14/37.5rem;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                padding-left: 10/37.5rem;
                .red {
                    color: @red;
                }
                .golden {
                    color: @golden;
                }
            }
            .edit-food-container {
                width: 100%;
                max-height: calc(100% - 2.9333rem);
                overflow: auto;
                -webkit-overflow-scrolling: touch;
                padding: 0 10/37.5rem;
                .empty-holder {
                    text-align: center;
                    padding-top: 100/37.5rem;
                }
                .edit-food-item {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    border-top: 1px solid #dedede;
                    &:last-child {
                        border-bottom: 1px solid #dedede;
                    }
                    .food-info {
                        flex: 1;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        padding: 10px 0;
                        img {
                            width: 40/37.5rem;
                            height: 40/37.5rem;
                        }
                        div {
                            flex: 1;
                            margin-left: 5/37.5rem;
                            .food-price {
                                font-style: italic;
                                color: @red;
                            }
                        }
                    }
                }
                .checkbox {
                    width: 25/37.5rem;
                    height: 25/37.5rem;
                    background-image: ~'url("../assets/image/unchose.png")';
                    background-size: 100% 100%;
                    &.active {
                        background-image: ~'url("../assets/image/chose.png")';
                    }
                }
            }
            .btn-group {
                height: 60/37.5rem;
                background: #f2f2f2;
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                .btn {
                    width: 40%;
                    height: 40/37.5rem;
                    line-height: 40/37.5rem;
                    text-align: center;
                    color: #fff;
                    border-radius: 4/37.5rem;
                    &.btn-cancel {
                        background: #ccc;
                        color: #1b1b1b;
                    }
                    &.btn-sure {
                        background: @red;
                        margin-left: 10/37.5rem;
                    }
                }
            }
        }
    }
</style>
