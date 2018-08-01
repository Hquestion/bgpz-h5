<template>
    <div class="pre-order">
        <bg-header title="立即预定"></bg-header>
        <order-brief-card :package-info.once="selectPackage" :food-info.once="banquetFoods" :price="allFoodsPrice"></order-brief-card>
        <div class="order-form">
            <bg-cell :arrow="true"  @click.native.prevent.stop="tableNumPickerVisible = true">
                <div slot="left">人数</div>
                <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="tablePeopleNum" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="selectTimeVisible = true">
                <div slot="left">时间</div>
                <bg-input slot="middle" type="text" :placeholder="orderPreTime" reverse="true" v-model="banquetTime" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="selectAddress">
                <div slot="left">地点</div>
                <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="banquetAddress" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell :arrow="false">
                <div slot="left">联系电话</div>
                <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="banquetPhone" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell :arrow="false">
                <div slot="left">联系人</div>
                <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="banquetUserName" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell :arrow="false">
                <div slot="left">场地费用</div>
                <bg-input slot="middle" type="text" placeholder="请选择场地" reverse="true" v-model="banquetAddrPrice" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell :arrow="true" @click.native.prevent.stop="cookerPickerVisible = true">
                <div slot="left">
                    厨师
                    <span class="vip-tip" v-show="isVip">(年费会员VIP免服务费，本月剩余<span class="avaliable-time">{{vipAvaliableTime}}</span>次)</span>
                </div>
                <div class="radio-picker" slot="middle">
                    <div class="count">&times;{{cookerCount}}</div>
                    <div class="price">￥{{cookerMoney}}元</div>
                </div>
            </bg-cell>
            <bg-cell :arrow="true" @click.native.prevent.stop="waiterPickerVisible = true">
                <div slot="left">服务员</div>
                <div class="radio-picker" slot="middle">
                    <div class="count">&times;{{waiterCount}}</div>
                    <div class="price">￥{{waiterMoney}}元</div>
                </div>
            </bg-cell>
            <bg-cell :arrow="true" @click.native.prevent.stop="somerwaerPickerVisible = true">
                <div slot="left">侍酒师</div>
                <div class="radio-picker" slot="middle">
                    <div class="count">&times;{{somerwaerCount}}</div>
                    <div class="price">￥{{somerwaerMoney}}元</div>
                </div>
            </bg-cell>
            <bg-cell :arrow="true" @click.native.prevent.stop="teaPickerVisible = true">
                <div slot="left">茶艺师</div>
                <div class="radio-picker" slot="middle">
                    <div class="count">&times;{{teaCount}}</div>
                    <div class="price">￥{{teaMoney}}元</div>
                </div>
            </bg-cell>
            <bg-cell :arrow="true" style="display: none;">
                <div slot="left">优惠券</div>
                <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="coupon" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell :arrow="true" @click.native.prevent.stop="previewServerDesc(serverDesc)">
                <div slot="left">服务说明</div>
                <div class="server-desc" slot="middle">
                    <span>{{serverDesc.name}}</span>
                </div>
            </bg-cell>
        </div>
        <div class="order-btn-box">
            <div class="money">
                ￥{{totalOrderMoney}}
                <span v-show="isVip">(已为您免除<span class="red">{{freeTime}}</span>次厨师费)</span>
            </div>
            <div class="next-btn" @click="nextStep">下一步</div>
        </div>
        <popup-picker v-model="selectTimeVisible" :picker-slots="timeSlots" title="请选择宴会时间" @change="adjustDate" @data-change="setBanquetTime"></popup-picker>
        <popup-picker v-model="cookerPickerVisible" :picker-slots="cookerSlot" title="请选择厨师" @data-change="setCookerCount"></popup-picker>
        <popup-picker v-model="waiterPickerVisible" :picker-slots="waiterSlot" title="请选择服务员" @data-change="setWaiterCount"></popup-picker>
        <popup-picker v-model="somerwaerPickerVisible" :picker-slots="somerwaerSlot" title="请选择侍酒师" @data-change="setSomerwaerCount"></popup-picker>
        <popup-picker v-model="teaPickerVisible" :picker-slots="somerwaerSlot" title="请选择茶艺师" @data-change="setTeaCount"></popup-picker>
        <popup-picker v-model="tableNumPickerVisible" :picker-slots="tableNumSlot" title="请选择场地类型" @data-change="setTablePeopleCount"></popup-picker>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import OrderBriefCard from '../components/OrderBriefCard';
    import PopupPicker from '../components/PopupPicker';

    import {mapActions, mapGetters, mapState} from 'vuex';
    import BgCell from "../components/BgCell";
    import BgInput from '../components/BgInput';
    import api from '../api';
    import banquetTimePickerGenerator from '../mixins/banquetTimePickerGenerator';
    import {range} from "../util";
    import form from '../util/form';

    export default {
        name: "PreOrder",
        mixins: [banquetTimePickerGenerator],
        components: {
            BgCell,
            BgHeader,
            OrderBriefCard,
            BgInput,
            PopupPicker
        },
        data(){
            return {
                config: {},
                banquetNote: '',
                banquetTimeList: '',
                coupon: '',
                serverDesc: {},
                selectTimeVisible: false,
                timeSlots: [],
                cookerPickerVisible: false,
                cookerSlot: [{values: [{label: '1名', value: 1}], flex:1, defaultIndex: 0}],
                waiterPickerVisible: false,
                waiterSlot: [{values: [{label: '不需要', value: 0}, {label: '1名', value: 1}, {label: '2名', value: 2}], flex: 1, defaultIndex: 1}],
                somerwaerPickerVisible: false,
                somerwaerSlot: [{values: [{label: '不需要', value: 0}, {label: '1名', value: 1}, {label: '2名', value: 2}], flex: 1, defaultIndex: 1}],
                tableNumPickerVisible: false,
                isVip: false,
                vipAvaliableTime: 0,
                teaPickerVisible: false
            };
        },
        computed: {
            ...mapState({
                banquetTimeSeconds : state => {
                    return state.banquet.banquetTime;
                },
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
                banquetAddrPrice(state){
                    return `￥${state.banquet.banquetAddressInfo.price || 0}`;
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
                },
                tableNumSlot(){
                    return [{
                        values: range(1, 100).map(item => ({label: `${item}人`, value: item})),
                        flex: 1,
                        defaultIndex: 0
                    }, {
                        values: range(1, 10).map(item => ({label: `${item}桌`, value: item})),
                        flex: 1,
                        defaultIndex: 0
                    }];
                }
            }),
            ...mapGetters([
                'banquetTime',
                'tablePeopleNum'
            ]),
            selectPackage(){
                return this.$store.state.banquet.selectPackage;
            },
            banquetFoods(){
                return this.$store.state.banquet.banquetFoods;
            },
            cookerMoney(){
                return this.config.noCouponServerMoney * +this.cookerCount * this.$store.state.banquet.tableCount;
            },
            waiterMoney(){
                return this.config.serverMoney * +this.waiterCount;
            },
            somerwaerMoney(){
                return this.config.sommMoney * +this.somerwaerCount;
            },
            teaMoney(){
                return this.config.teaMoney * +this.teaCount;
            },
            allFoodsPrice(){
                let validationMoney = 0;
                this.$store.state.banquet.validationFoods.forEach(item => validationMoney += +item.price);
                return this.banquetFoods.price + validationMoney;
            },
            addrPrice(){
                return +this.$store.state.banquet.banquetAddressInfo.price || 0;
            },
            totalOrderMoney(){
                let validationMoney = 0;
                this.$store.state.banquet.validationFoods.forEach(item => validationMoney += +item.price);
                let price = this.allFoodsPrice + this.cookerMoney + this.waiterMoney + this.somerwaerMoney + this.addrPrice + this.teaMoney;
                if(this.vipAvaliableTime > 0) {
                    price -= this.cookerMoney * Math.min(this.vipAvaliableTime, this.$store.state.banquet.tableCount);
                }
                return price;
            },
            freeTime(){
                return Math.min(this.vipAvaliableTime, this.$store.state.banquet.tableCount);
            },
            orderPreTime(){
                if(this.$route.params.scence === 'banquet') {
                    return `请提前${+this.config.minBanquetOrderTime / 60 / 60}小时下单`;
                }else {
                    return `请提前${+this.config.minOrderTimeToStartTime / 60 / 60}小时下单`;
                }
            }
        },
        methods: {
            ...mapActions([
                'setBanquetTime',
                'setCookerCount',
                'setWaiterCount',
                'setSomerwaerCount',
                'setTablePeopleCount',
                'setBanquetFoods',
                'selectBanquetPackage',
                'setTeaCount',
                'setFoodValidationResult'
            ]),
            init(){
                let configParam = ['serverMoney','teaMoney', 'sommMoney','tableDefaultNumber','isCouponServerMoney',
                    'noCouponServerMoney','minOrderTimeToStartTime','maxOrderTimeToStartTime','limitMA','minBanquetOrderTime'];
                let dictionParam =['banquetNote','banquetTimeList'];
                api.getCfg(configParam).then(res => {
                    this.config = res.data.list;
                    api.getDiction(dictionParam).then(res => {
                        this.banquetNote = res.data.list.find(item => item.tag === 'banquetNote');
                        this.banquetTimeList = res.data.list.find(item => item.tag === 'banquetTimeList');
                        this.config.timeList = this.banquetTimeList.sonList;
                        this.timeSlots = this.generateTimeSlots(this.$route.params.scence);
                    });
                });

                api.getH5(['orderservicedesc']).then(res => {
                    this.serverDesc = res.data.list[0];
                });
                api.userIsVip().then(res => {
                    this.isVip = (res.data.isvip + '') === '1';
                    if(this.isVip) {
                        api.vipMonthAvaliableTimes().then(res => {
                            this.vipAvaliableTime = res.data.num;
                        }, ()=>{
                            this.vipAvaliableTime = 0;
                        });
                    }else {
                        this.vipAvaliableTime = 0;
                    }
                }, ()=>{
                    this.isVip = false;
                });
                if(this.$route.params.scence === 'company') {
                    //如果是星厨推荐过来，则需要同步所点菜品
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
            },
            selectTime(){

            },
            selectAddress(){
                this.$router.push({
                    name: 'AddressList',
                    query: {
                        scene: this.$route.params.scence,
                        addressType: this.$store.state.banquet.banquetAddrType === '1' ? 'user': 'thirdpart',
                        isChoose: '1'
                    }
                });
            },
            nextStep(){
                let validationList = [
                    {method: 'isAfterTime', message: '宴会时间不正确', param: [this.$store.state.banquet.banquetTime]},
                    {method: 'isNotEmpty', message: '请选择地址', param: [this.$store.state.banquet.banquetAddressInfo]},
                    {method: 'isNotEmpty', message: '请选择人数桌数', param: [this.$store.state.banquet.tableCount]},
                    {method: 'isNotEmpty', message: '请选择人数桌数', param: [this.$store.state.banquet.peopleCount]},
                ];
                if(!form.validate(validationList)) {
                    return;
                }
                //如果是高级私宴定制，则已经检验过菜品，直接下单
                if(this.$route.params.scence === 'banquet') {
                    this.doOrder();
                }else {
                    //否则，需要检验菜品，如果通过则正常下单，否则需要跳转检验菜品页面
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
                        this.doOrder();
                    },(res)=>{
                        this.setFoodValidationResult(res.data);
                        this.$router.push({
                            name: 'BanquetFoodValidation',
                            params: {
                                scene: this.$route.params.scence
                            }
                        });
                    });
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
                    this.setTablePeopleCount([{value: 10}, {value: 1}]);
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
            previewServerDesc(data){
                this.$router.push({
                    name: 'PreviewHtml',
                    query: {
                        href: encodeURIComponent(data.url),
                        title: '服务说明'
                    }
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
.pre-order {
    padding-top: 50px;
    padding-bottom: 50/37.5rem;
    .order-form {
        margin-top: 10/37.5rem;
        font-size: 15/37.5rem;
        input {
            font-size: 15/37.5rem;
        }
        .radio-picker {
            display: flex;
            width: 150/37.5rem;
            justify-content: space-between;
            color: #666;
        }
    }
    .order-btn-box {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 50/37.5rem;
        padding: 10/37.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: @white;
        border-top: 1px solid #dedede;
        .money {
            color: @red;
            font-size: 18/37.5rem;
            span {
                color: @golden;
                font-size: 12/37.5rem;
            }
        }
        .next-btn {
            width: 90/37.5rem;
            color: @white;
            text-align: center;
            height: 35/37.5rem;
            line-height: 35/37.5rem;
            background: @red;
            border-radius: 5/37.5rem;
        }
    }
    .vip-tip {
        color: @golden;
        font-size: 12/37.5rem;
    }
    .server-desc {
        width: 6rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
