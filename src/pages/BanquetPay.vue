<template>
    <div class="banquet-pay">
        <bg-header title="支付"></bg-header>
        <order-brief-card :package-info.once="selectPackage" :food-info.once="banquetFoods"
                          :avatar="orderDetail.packageAvatar" :name="orderDetail.name" :price="orderDetail.price" :num="orderDetail.foodNumber"></order-brief-card>
        <bg-white-space height="0.26667rem"></bg-white-space>
        <bg-cell :arrow="false">
            <div slot="left">时间</div>
            <div slot="middle">{{orderDetail.dinnerTime | dateFormat('sec')}}</div>
        </bg-cell>
        <bg-cell :arrow="false">
            <div slot="left">电话</div>
            <div slot="middle" v-text="orderDetail.userLink"></div>
        </bg-cell>
        <bg-cell :arrow="false">
            <div slot="left">地址</div>
            <div slot="middle" v-text="orderDetail.userAddress"></div>
        </bg-cell>
        <div class="vip-selector" @click="toggleVipChecked" v-show="!isVip">
            <div class="vip-info">
                <div class="vip-name">
                    成为<span class="red">年费会员</span>
                </div>
                <div>
                    免<span class="red">一年</span>(每桌限4桌，连续12个月)厨师服务费(268元/次)，并且<span class="red">赠送9800元账户余额</span>
                </div>
            </div>
            <div class="vip-price">
                <span class="red">13400元/年</span>
            </div>
            <div class="vip-checkbox">
                <div class="checkbox" :class="{active: isVipChecked}"></div>
            </div>
        </div>
        <div class="pay-container">
            <div class="yu_e-box">
                <img src="../assets/image/black.png">
                <div class="yu_e-info">
                    <div>账户余额￥{{accountMoney}}元</div>
                    <div class="tip" v-show="!isBanlanceEnough || isVipChecked">
                        <span v-show="!isBanlanceEnough && toRechargeMoney <= 0 && !isVipChecked">(账户余额不足，请在下方充值)</span>
                        <span v-show="!isBanlanceEnough && toRechargeMoney > 0 && !isVipChecked">支付后余额：{{moneyAfterRecharge}}</span>
                        <span v-show="isVipChecked">
                            充值VIP为您减免本次订单<span v-text="reduceTable"></span>桌厨师服务费,共计<span v-text="reduceMoney"></span>元
                        </span>
                    </div>
                </div>
            </div>
            <div class="money-selector" v-show="!isVipChecked && !isBanlanceEnough">
                <div class="fill-tip">请选择充值金额</div>
                <div class="money-grid">
                    <div class="money-item" @click="selectRechargeItem(5000, 1000)" :class="{active: toRechargeMoney === 5000}">
                        <div class="new-tip"><div>新</div><div>用</div><div>户</div></div>
                        <div class="money-box">
                            <div>5000元</div>
                            <div>送1000粮票</div>
                        </div>
                    </div>
                    <div class="money-item" @click="selectRechargeItem(10000, 5000)" :class="{active: toRechargeMoney === 10000}">
                        <div class="money-box">
                            <div>10000元</div>
                            <div>送5000粮票</div>
                        </div>
                    </div>
                    <div class="money-item" @click="selectRechargeItem(20000, 10000)" :class="{active: toRechargeMoney === 20000}">
                        <div class="money-box">
                            <div>20000元</div>
                            <div>送10000粮票</div>
                        </div>
                    </div>
                    <div class="money-item" @click="selectRechargeItem(30000, 16000)" :class="{active: toRechargeMoney === 30000}">
                        <div class="money-box">
                            <div>30000元</div>
                            <div>送16000粮票</div>
                        </div>
                    </div>
                </div>
                <div class="tip"><span class="red">注：</span>暂不支持其他金额充值，粮票只能用于商城</div>
            </div>
        </div>
        <div class="ticket-selector" @click="isTicketChecked = !isTicketChecked" v-show="!isBanlanceEnough || isVipChecked">
            <div class="left">
                <div>需要发票</div>
                <textarea placeholder="请输入发票抬头及税务登记证号" @click.stop v-model="ticketInfo"></textarea>
            </div>
            <div class="right">
                <div class="checkbox" :class="{active: isTicketChecked}"></div>
            </div>
        </div>
        <div class="netbank-pay-container" @click="isPayByNetBank = !isPayByNetBank" v-show="!isBanlanceEnough || isVipChecked">
            <div class="icon">
                <img src="../assets/image/netbank.png">
            </div>
            <div class="pay-desc">
                <div>网银快捷支付</div>
                <div>有银行卡就能支付，单笔限额50000.00元</div>
            </div>
            <div class="checkbox" :class="{active: isPayByNetBank}"></div>
        </div>
        <div class="btn-box">
            <div class="btn" @click="doPay">确认支付￥{{realPayMoney}}</div>
        </div>
    </div>
</template>

<script>
    import OrderBriefCard from '../components/OrderBriefCard';
    import {mapGetters, mapState} from 'vuex'
    import BgCell from "../components/BgCell";
    import BgInput from "../components/BgInput";
    import BgHeader from "../components/BgHeader";
    import BgWhiteSpace from "../components/BgWhiteSpace";
    import filter from '../mixins/filter'
    import dayjs from 'dayjs';

    import api from '../api';
    export default {
        name: "BanquetPay",
        components: {
            BgWhiteSpace,
            BgHeader,
            BgCell,
            OrderBriefCard,
            BgInput
        },
        mixins: [filter],
        data(){
            return {
                isVipChecked: false,
                isTicketChecked: false,
                isPayByNetBank: false,
                accountMoney: 0,
                toRechargeMoney: 0,
                ticketInfo: '',
                isFirstTimeRecharge: false,
                isVip: false,
                orderDetail: {},
                config: {},
                liangpiao: 0
            }
        },
        computed: {
            ...mapGetters([
                'banquetTime'
            ]),
            ...mapState({
                banquetAddress: state => {
                    let addrInfo =  state.banquet.banquetAddressInfo || {};
                    let stateName = addrInfo.stateInfo && addrInfo.stateInfo.name || '';
                    let cityName = addrInfo.cityInfo && addrInfo.cityInfo.name || '';
                    let regionName = addrInfo.regionInfo && addrInfo.regionInfo.name || '';
                    return `${stateName}${cityName}${regionName}${addrInfo.addr || ''}`
                },
            }),
            selectPackage(){
                return this.$store.state.banquet.selectPackage;
            },
            banquetFoods(){
                return this.$store.state.banquet.banquetFoods;
            },
            banquetPhone(){
                return this.$store.state.banquet.banquetAddressInfo.phone || '';
            },
            isBanlanceEnough(){
                return (this.accountMoney - +this.$route.query.money) >= 0;
            },
            realPayMoney(){
                if(this.isVipChecked) {
                    //如果充值vip，则支付金额为13400元
                    if(this.isTicketChecked) {
                        return 13400 * 1.06;
                    }else {
                        return 13400;
                    }
                }else {
                    if(this.isBanlanceEnough) {
                        //如果余额充足，支付金额为订单价格
                        return this.$route.query.money;
                    }else {
                        return this.toRechargeMoney;
                    }
                }
            },
            moneyAfterRecharge(){
                if(this.isVipChecked) {
                    //如果充值VIP,扣除年费3600元后计算充值后余额
                    return 9800 + +this.accountMoney - +this.$route.query.money - this.reduceMoney;
                }else {
                    return this.toRechargeMoney + +this.accountMoney - +this.$route.query.money;
                }
            },
            reduceTable(){
                if(this.isVipChecked) {
                    return Math.min(this.orderDetail.tableNumber, 4);
                }else {
                    return 0;
                }
            },
            reduceMoney(){
                return this.reduceTable * +this.config.noCouponServerMoney;
            }
        },
        methods: {
            init(){
                api.getOrderDetail(this.$route.query.orderId).then(res => {
                    this.orderDetail = res.data;
                });
                api.getAccountInfo().then(res => {
                    this.accountMoney = res.data.fundsCur;
                });
                api.isUserFirstTimeRecharge().then(res => {
                    this.isFirstTimeRecharge = (res.data.isfirst + '') === '1';
                }, ()=>{
                    this.isFirstTimeRecharge = false;
                });
                api.userIsVip().then(res => {
                    this.isVip = (res.data.isvip + '') === '1';
                }, ()=>{
                    this.isVip = false;
                });
                api.getCfg(['serverMoney', 'noCouponServerMoney']).then(res => {
                    this.config = res.data.list;
                });
            },
            selectRechargeItem(money, liangpiao){
                this.toRechargeMoney = money;
                this.liangpiao = liangpiao;
                this.isPayByNetBank = true;
            },
            toggleVipChecked(){
                this.isVipChecked = !this.isVipChecked;
                if(this.isVipChecked) {
                    this.isPayByNetBank = true;
                }
            },
            doPay(){
                if(this.isVipChecked) {
                    //如果要充值vip,必定使用网银支付
                    api.updateOrderInfo({
                        orderId: this.$route.query.orderId,
                        comevip: '1',
                        givestamp: 0,
                        topupmoney: 13400,
                        invoicetitle: this.ticketInfo,
                        reducetablenum: this.reduceTable,
                        reducemoney: this.reduceMoney,
                        paymoney: +this.orderDetail.price - +this.reduceMoney
                    }).then(res => {
                        window.location.href = 'http://api.bagepanzi.com/llpay/index.php?user_id=' + res.data.uid + '&no_order='+res.data.payno
                            + '&is_vip=' + res.data.comevip + '&money=' + res.data.topupmoney + '&phone=' + res.data.phone
                            + '&createtime=' + dayjs(+res.data.createtime * 1000).format('YYYYMMDDHHmmss');
                        // this.$router.replace({
                        //     name: 'LlPayForm',
                        //     query: {
                        //         userId: res.data.uid,
                        //         orderNo: res.data.payno,
                        //         comevip: res.data.comevip,
                        //         orderMoney: res.data.topupmoney,
                        //         phone: res.data.phone,
                        //         createtime: dayjs(+res.data.createtime * 1000).format('YYYYMMDDHHmmss')
                        //     }
                        // });
                    });
                }else {
                    if(this.isBanlanceEnough) {
                        //如果余额充足，则使用余额支付
                        let param = {
                            money: this.realPayMoney,
                            orderId: this.$route.query.orderId,
                            payPwd: '111111',
                            paySence: 2,
                            payType: 3,
                            isHtml5: 1,
                            isJSAPI: 173
                        };
                        api.pay(param).then(res => {
                            this.$router.replace({
                                name: 'OrderExtension',
                                params: {
                                    scence: 'banquet'
                                },
                                query: {
                                    orderId: this.$route.query.orderId,
                                    money: this.$route.query.money
                                }
                            });
                        }, (res) => {
                            commonToast({
                                position:'bottom',
                                message: res.msg
                            });
                        });
                    }else {
                        //余额不足，则使用网银支付
                        api.updateOrderInfo({
                            orderId: this.$route.query.orderId,
                            comevip: '0',
                            givestamp: this.liangpiao,
                            topupmoney: this.toRechargeMoney,
                            invoicetitle: this.ticketInfo,
                            reducetablenum: this.reduceTable,
                            reducemoney: this.reduceMoney,
                            paymoney: +this.orderDetail.price
                        }).then(res => {
                            window.location.href = 'http://api.bagepanzi.com/llpay/index.php?user_id=' + res.data.uid + '&no_order='+res.data.payno
                                + '&is_vip=' + res.data.comevip + '&money=' + res.data.topupmoney + '&phone=' + res.data.phone
                                + '&createtime=' + dayjs(+res.data.createtime * 1000).format('YYYYMMDDHHmmss');
                            // this.$router.replace({
                            //     name: 'LlPayForm',
                            //     query: {
                            //         userId: res.data.uid,
                            //         orderNo: res.data.payno,
                            //         comevip: res.data.comevip,
                            //         orderMoney: res.data.topupmoney,
                            //         phone: res.data.phone,
                            //         createtime: dayjs(+res.data.createtime * 1000).format('YYYYMMDDHHmmss')
                            //     }
                            // });
                        });
                    }
                }
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import url(../assets/less/variable);
    .checkbox {
        width: 25/37.5rem;
        height: 25/37.5rem;
        background-image: ~'url("../assets/image/unchose.png")';
        background-size: 100% 100%;
        &.active {
            background-image: ~'url("../assets/image/chose.png")';
        }
    }
    .banquet-pay {
        padding-top: 50px;
        .red {
            color: @red;
        }
        .vip-selector {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            margin-top: 10/37.5rem;
            padding: 10/37.5rem 5/37.5rem;
            background: #fff;
            border-left: 4px solid @red;
            .vip-info {
                font-size: 12/37.5rem;
                width: 66%;
                .vip-name {
                    font-size: 18/37.5rem;
                }
            }
            .vip-price {
                font-size: 16/37.5rem;
                width: calc(32% - 0.666rem);
                text-align: center;
            }
            .vip-checkbox {
                width: 25/37.5rem;
                height: 25/37.5rem;
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
        }
        .pay-container {
            margin-top: 10/37.5rem;
            background: #fff;
            padding: 10/37.5rem;
            .yu_e-box {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding-bottom: 10/37.5rem;
                .yu_e-info {
                    margin-left: 10/37.5rem;
                    div {
                        font-size: 16/37.5rem;
                        &.tip {
                            color: #f82;
                            font-size: 14/37.5rem;
                        }
                    }
                }
            }
            .money-selector {
                .tip {
                    font-size: 14/37.5rem;
                }
                .fill-tip {
                    font-size: 14/37.5rem;
                }
                .money-grid {
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                    align-items: center;
                    padding: 0 0 10/37.5rem 0;
                    .money-item {
                        width: 32%;
                        margin-left: 2%;
                        border: 1px solid #dedede;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        font-size: 14/37.5rem;
                        text-align: center;
                        height: 60/37.5rem;
                        margin-top: 10/37.5rem;
                        border-radius: 5/37.5rem;
                        &.active {
                            border: 1px solid @red;
                            color: @red;
                            .new-tip {
                                background: @red;
                            }
                        }
                        &:nth-child(3n+1) {
                            margin-left: 0;
                        }
                        .new-tip {
                            width: 20/37.5rem;
                            height: 100%;
                            text-align: center;
                            background: @grey;
                            color: #fff;
                            display: flex;
                            justify-content: center;
                            flex-direction: column;
                            align-items: center;
                            border-top-left-radius: 5/37.5rem;
                            border-bottom-left-radius: 5/37.5rem;
                            font-size: 14/37.5rem;
                        }
                        .money-box {
                            display: flex;
                            justify-content: center;
                            flex-direction: column;
                            align-items: center;
                            flex: 1;
                            font-size: 12/37.5rem;
                            div:first-child {
                                font-size: 18/37.5rem;
                            }
                        }
                    }
                }
            }
        }
        .ticket-selector {
            margin-top: 10/37.5rem;
            background: #fff;
            padding: 10/37.5rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .left {
                flex: 1;
                textarea {
                    margin-top: 5/37.5rem;
                    width: 90%;
                    height: 50/37.5rem;
                    border: 1px solid #dedede;
                    resize: none;
                    outline: none;
                    padding: 5/37.5rem;
                }
            }
        }
        .netbank-pay-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 10/37.5rem;
            background: #fff;
            padding: 10/37.5rem;
            .icon {
                width: 50/37.5rem;
                height: 50/37.5rem;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .pay-desc {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                flex-direction: column;
                font-size: 18/37.5rem;
                flex: 1;
                margin-left: 5/37.5rem;
                div+div {
                    font-size: 14/37.5rem;
                    color: @grey;
                    margin-top: 3/37.5rem;
                }
            }
        }
        .btn-box {
            width: 100%;
            padding: 30/37.5rem;
            .btn {
                width: 90%;
                margin: 0 auto;
                background: @red;
                color: @white;
                height: 50/37.5rem;
                line-height: 50/37.5rem;
                border-radius: 3/37.5rem;
                text-align: center;
            }
        }
    }
</style>
