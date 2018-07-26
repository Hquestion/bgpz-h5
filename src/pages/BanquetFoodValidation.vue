<template>
    <div class="banquet-food-validation">
        <bg-header title="添加菜品"></bg-header>
        <div class="validation-info">
            <img src="../assets/image/warning.png">
            <div class="match-info">
                您的套餐是{{packageRange}}人使用，可能无法匹配您的就餐人数（{{tablePeopleNum}}），建议您增加部分菜品。
            </div>
            <div class="tip">小提示：点击下方[去支付]也可以直接跳过</div>
        </div>
        <div class="validation-recommend">
            <div class="table-header">
                <div>
                </div>
                <div class="ordered">
                    <span>已点数量</span>
                </div>
                <div class="recommend">
                    <span>推荐数量</span>
                </div>
            </div>
            <div class="table-cell" v-for="(item, index) in validationRes" :key="index">
                <div class="tag">{{item.category_name}}</div>
                <div class="ordered">{{item.food_num}}</div>
                <div class="recommend">{{item.least_food_num}}<span>(+{{item.least_food_num - item.food_num}})</span></div>
            </div>
        </div>
        <div class="food-shop-container">
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
        </div>
        <div class="footer">
            <div class="total-price">￥{{totalPrice}}</div>
            <div class="btn btn-pay" @click="nextStep">下一步</div>
        </div>
    </div>
</template>

<script>
    import BgTab from '../components/BgTab';
    import BgTabCard from '../components/BgTabCard'
    import FoodSelector from '../components/FoodSelector';
    import BgBadge from '../components/BgBadge';
    import api from '../api';
    import BgHeader from "../components/BgHeader";
    import {mapGetters, mapActions, mapState} from 'vuex';
    export default {
        name: "BanquetFoodValidation",
        components: {
            BgHeader,
            BgTab,
            BgTabCard,
            FoodSelector,
            BgBadge
        },
        data(){
            return {
                categoryList: [],
                foodList: [],
                currentCate: null,
            };
        },
        computed: {
            ...mapGetters([
                'tablePeopleNum',
                'banquetFoods'
            ]),
            ...mapState({
                banquetAddress: state => {
                    let addrInfo =  state.banquet.banquetAddressInfo || {};
                    let stateName = addrInfo.stateInfo && addrInfo.stateInfo.name || '';
                    let cityName = addrInfo.cityInfo && addrInfo.cityInfo.name || '';
                    let regionName = addrInfo.regionInfo && addrInfo.regionInfo.name || '';
                    return `${stateName}${cityName}${regionName}${addrInfo.addr || ''}`
                },
                banquetPhone(state){
                    return `${state.banquet.banquetAddressInfo.phone || ''}`;
                },
                banquetUserName(state){
                    return `${state.banquet.banquetAddressInfo.name || ''}`;
                },
                cookerCount: state => {
                    return state.banquet.cookerCount;
                },
                waiterCount(state){
                    return state.banquet.waiterCount;
                },
                somerwaerCount(state){
                    return state.banquet.somerwaerCount;
                },
                teaCount(state){
                    return state.banquet.teaCount;
                }
            }),
            allFoodsPrice(){
                let validationMoney = 0;
                this.$store.state.banquet.validationFoods.forEach(item => validationMoney += +item.price);
                return this.banquetFoods.price + validationMoney;
            },
            addrPrice(){
                return +this.$store.state.banquet.banquetAddressInfo.price || 0;
            },
            validationRes(){
                return this.$store.state.banquet.foodValidationResult;
            },
            packageRange(){
                return this.$store.state.banquet.selectPackage.peopleRange;
            },
            companyId(){
                return this.$store.state.banquet.selectPackage.companyid;
            },
            foodCartList(){
                return this.$store.state.banquet.validationFoods;
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
            },
            totalPrice(){
                let validationFoodsPrice = 0;
                this.cartData.forEach(item => validationFoodsPrice += +item.price * item.count);
                return this.$store.state.banquet.banquetFoods.price + validationFoodsPrice;
            }
        },
        methods: {
            ...mapActions([
                'addValidationFood',
                'deleteValidationFood',
                'setFoodValidationResult',
                'setBanquetFoods',
                'selectBanquetPackage',
                'setTablePeopleCount'
            ]),
            getFoodListByCate(cate, companyId){
                return new Promise((resolve, reject) => {
                    api.getFoodListByCategory(cate, companyId).then(res => {
                        res.data.list.forEach(item => item.count = 0);
                        resolve(res.data.list);
                    }, reject);
                });
            },
            init(){
                if(this.$route.params.scene === 'company') {
                    this.setFoodValidationResult(JSON.parse(localStorage.getItem('orderFoodValidationRes')));
                    let serviceList = JSON.parse(localStorage.getItem('foodOrderCar'));
                    this.setBanquetFoods({
                        foods: serviceList.ServerList.map(item => {
                            return {
                                food: {
                                    id: item.id
                                },
                                count: item.num,
                                type: item.type,
                                cate: item.cate
                            }
                        }),
                        price: serviceList.price
                    });
                    let _package = JSON.parse(localStorage.getItem('packageDetail'));
                    this.selectBanquetPackage(_package);
                }
                this.getFoodCateList(this.companyId).then(res => {
                    this.categoryList = res;
                    this.currentCate = res[0] && res[0].id || '';
                    if(this.currentCate) {
                        this.getFoodListByCate(this.currentCate, this.companyId).then(res => {
                            this.foodList = res;
                            this.syncFoodWithCart();
                        });
                    }
                });
            },
            getFoodCateList(companyId) {
                return new Promise((resolve, reject) => {
                    api.getFoodCateList(companyId).then(res => {
                        res.data.list.forEach(item => item.count = 0);
                        resolve(res.data.list);
                    }, reject);
                });
            },
            onFoodCateChange(id){
                this.getFoodListByCate(id, this.companyId).then(res => {
                    this.foodList = res;
                    this.syncFoodWithCart();
                    document.querySelector('.food-bus').scrollTop = 0;
                });
            },
            addFoodToCart(el, e, food){
                this.addValidationFood({
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    cateId: this.currentCate
                });
                let currentCate = this.categoryList.find(item => item.id === this.currentCate);
                currentCate.count = (currentCate.count || 0) + 1;
            },
            removeFoodFromCart(el, e, food){
                let index = this.foodCartList.findIndex(item => {
                    return item.id === food.id;
                });
                if(index >= 0) {
                    this.deleteValidationFood(index);
                    let currentCate = this.categoryList.find(item => item.id === this.currentCate);
                    currentCate.count = ((currentCate.count || 0) - 1) || 0;
                }
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
            },
            nextStep(){
                //如果是高级私宴定制，则跳转下单页面，选择其他信息
                if(this.$route.params.scene === 'banquet') {
                    this.$router.push({
                        name: 'PreOrder',
                        params: {
                            scence: this.$route.params.scene || 'banquet'
                        }
                    });
                }else {
                    //否则则需要调下单接口进行下单
                    this.doOrder();
                }
            },
            doOrder(){
                //调用下单接口
                let foodList = this.banquetFoods.foods.map(item => {
                    return {
                        id: item.food.id,
                        num: item.count,
                        type: 1,
                        price: item.price
                    };
                });
                let orderParam = {
                    ServerList: JSON.stringify(foodList),
                    address: this.banquetAddress,
                    companyId: this.$store.state.banquet.selectPackage.companyid,
                    couponId: '',
                    number: this.$store.state.banquet.tableCount,
                    personNumber: this.$store.state.banquet.peopleCount,
                    orderLinkMan: this.banquetUserName,
                    orderPhone: this.banquetPhone,
                    packageId: this.$store.state.banquet.selectPackage.id,
                    time: this.$store.state.banquet.banquetTime,
                    waiterNumber: this.waiterCount,
                    sommNumber: this.somerwaerCount,
                    teaNumber: this.teaCount,
                    remark: '',
                    packagePrice: this.allFoodsPrice,
                    companyPrice: this.addrPrice
                };
                api.submitBanquetOrder(orderParam).then(res => {
                    //下单完成后，重置桌数人数
                    this.setTablePeopleCount([{value: 0}, {value: 0}]);
                    this.$router.push({
                        name: 'BanquetPay',
                        query: {
                            orderId:  res.data.orderId,
                            money: res.data.price
                        }
                    });
                }, (res)=>{
                    window.commonToast({
                        message: res.msg,
                        position: 'bottom'
                    });
                });
            },
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .banquet-food-validation {
        padding-bottom: 50/37.5rem;
        padding-top: 50px;
        .validation-info {
            background: #EA4B3F;
            color: #fff;
            padding: 15/37.5rem 20/37.5rem;
            text-align: center;
            img {
                width: 60/37.5rem;
            }
            .match-info {
                font-size: 15/37.5rem;
                padding: 10/37.5rem 0;
            }
            .tip {
                color: #F8C614;
                font-size: 13/37.5rem;
            }
        }
        .validation-recommend {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 10/37.5rem 20/37.5rem;
            background: @white;
            margin-top: 10/37.5rem;
            .table-header, .table-cell{
                flex: 1;
                div {
                    padding: 0 10/37.5rem;
                    text-align: center;
                    height: 40/37.5rem;
                    line-height: 40/37.5rem;
                    border-bottom: 1px dashed #dedede;
                }
            }
            .table-header {
                color: #fff;
                font-size: 14/37.5rem;
                .tag {
                    color: #f80;
                }
                .ordered {
                    span {
                        padding: 3/37.5rem 12/37.5rem;
                        background: #999;
                        border-radius: 50/37.5rem;
                    }
                }
                .recommend {
                    span {
                        padding: 3/37.5rem 12/37.5rem;
                        background: #f80;
                        border-radius: 50/37.5rem;
                    }
                }
            }
            .table-cell {
                color: #1b1b1b;
                .tag {
                    color: #EA4B3F;
                }
                .ordered {
                    color: #1b1b1b;
                }
                .recommend {
                    span {
                        color: #f80;
                        font-size: 14/37.5rem;
                    }
                }
            }
        }
        .food-shop-container {
            margin-top: 10/37.5rem;
            background: #fff;
            .food-cart-main {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                .is-left {
                    width: 2.65rem;
                    .food-cate {
                        position: relative;
                        .food-cate-count {
                            position: absolute;
                            right: 5/37.5rem;
                            top: 0/37.5rem;
                        }
                    }
                }
                .food-bus {
                    width: calc(100% - 2.65rem);
                    max-height: calc(100vh - 50px - 1.333rem);
                    overflow: auto;
                    overflow-scrolling: touch;
                }
            }
        }
        .footer {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 50/37.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10/37.5rem;
            background: #fff;
            border-top: 1px solid #dedede;
            .total-price {
                color: @red;
                font-size: 18/37.5rem;
            }
            .btn {
                width: 100/37.5rem;
                height: 40/37.5rem;
                text-align: center;
                line-height: 40/37.5rem;
                background: @red;
                color: @white;
                border-radius: 5/37.5rem;
            }
        }
    }
</style>
