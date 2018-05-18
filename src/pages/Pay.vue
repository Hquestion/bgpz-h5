<template>
    <div class="pay">
        <bg-header title="支付"></bg-header>
        <img :src="adsUrl">
        <div class="row">
            <div class="project-avatar">
                <bg-avatar :src="imgUrl" :width="`${60/37.5}rem`"></bg-avatar>
            </div>
            <div class="project-name">
                <div>{{projectName}}</div>
            </div>
            <div class="project-money">
                <div>
                    <img src="../assets/image/moneyicon.png">
                    <span>{{projectMoney}}元</span>
                </div>
            </div>
        </div>
        <bg-white-space></bg-white-space>
        <v-touch class="cell" @tap="setPayType('ACCOUNT')">
            <div class="pay-logo">
                <img src="../assets/image/black.png">
            </div>
            <div class="pay-tip-box">
                <div class="account">账户余额￥{{accountMoney}}元</div>
                <div class="pay-tip golden">使用账户余额可获双倍积分</div>
            </div>
            <div class="checkbox">
                <div class="radio" :class="{checked: payType === 'ACCOUNT'}"></div>
            </div>
        </v-touch>
        <v-touch class="cell" @tap="setPayType('WEIXIN')">
            <div class="pay-logo">
                <img src="../assets/image/weixin.png">
            </div>
            <div class="pay-tip-box">
                <div class="account">微信支付</div>
                <div class="pay-tip">推荐安装微信5.0及以上版本的用户使用</div>
            </div>
            <div class="checkbox">
                <div class="radio" :class="{checked: payType === 'WEIXIN'}"></div>
            </div>
        </v-touch>
        <div class="golden-tip">
            注：您的聚会名额我们会给您保留3分钟，请尽快完成支付！
        </div>
        <div class="pay-tip">
            请在{{showTimeLeft}}内完成支付
        </div>
        <div class="btn-block">
            <v-touch class="btn" @tap="doPay()">确认支付￥{{projectMoney}}</v-touch>
        </div>
    </div>
</template>

<script>
    import BgHeader from '../components/BgHeader';
    import BgWhiteSpace from '../components/BgWhiteSpace';
    import api from '../api';
    import BgAvatar from "../components/BgAvatar";
    import {Toast, MessageBox} from 'mint-ui';
    import {fillZero} from "../util";
    import dayjs from 'dayjs';

    const PayTypeMap = {
        'ACCOUNT': 3,
        'WEIXIN': 2
    };
    export default {
        name: "Pay",
        components: {
            BgAvatar,
            BgHeader,
            BgWhiteSpace
        },
        data(){
            return {
                imgUrl: '',
                projectName: '',
                projectMoney: '',
                accountMoney: '',
                payType: 'ACCOUNT',
                adsUrl: '',
                isPaid: false,
                timeLeft: 3 * 60 * 1000
            };
        },
        computed: {
            showTimeLeft(){
                let min = Math.floor(this.timeLeft / 1000 / 60);
                let seconds = Math.floor((this.timeLeft - 60 * 1000 * min) / 1000);
                return `${fillZero(min)}:${fillZero(seconds)}`;
            }
        },
        methods: {
            init(){
                this.projectMoney = this.$route.params.money;
                api.getAds('paybanner').then(res => {
                    this.adsUrl = res.data.list[0].imageUrl;
                });
                api.getAccountInfo().then(res => {
                    this.accountMoney = res.data.fundsCur;
                });
                if(this.typeName === 'party') {
                    this.initPartyData(this.typeId);
                    api.getPartyOrderDetail(this.$route.params.id).then(res => {
                        let endTime = dayjs(res.data.create_time * 1000 + 3 * 60 * 1000);
                        let now = dayjs();
                        this.timeLeft = endTime.valueOf() - now.valueOf();
                        this.startTimer();
                    });
                }
            },
            initPartyData(typeId){
                api.getPartyDetail(typeId).then(res => {
                    this.imgUrl = res.data.ownerAvatar;
                    this.projectName = res.data.theme;
                });
            },
            startTimer(){
                this.timer = setTimeout(()=>{
                    this.timeLeft = this.timeLeft - 1000;
                    if(this.timeLeft > 0) {
                        this.startTimer();
                    }else {
                        clearTimeout(this.timer);
                        api.getPartyOrderDetail(this.$route.params.id).then(data => {
                            if(+data.data.status === -1) {
                                this.isPaid = true;
                                this.$router.replace({
                                    name: 'Party'
                                });
                            }else {
                                api.updateOrderStatus(this.$route.params.id, -1).then(data => {
                                    this.isPaid = true;
                                    this.$router.replace({
                                        name: 'Party'
                                    });
                                }, () => {
                                    Toast({
                                        message: '取消订单失败',
                                        position: 'bottom'
                                    });
                                    this.$router.replace({
                                        name: 'Party'
                                    });
                                });
                            }
                        }, ()=>{
                            this.isPaid = true;
                            this.$router.replace({
                                name: 'Party'
                            });
                        });
                    }
                }, 1000)
            },
            setPayType(type){
                this.payType = type;
            },
            doPay(){
                if(this.typeName === 'party') {
                    this.doPayParty()
                }
            },
            doPayParty(){
                let param = {
                    orderId: this.$route.params.id,
                    payType: PayTypeMap[this.payType]
                };
                if(PayTypeMap[this.payType] === 2) {
                    param.paySence = 6;
                    param.isHtml5 = 1;
                    param.isJSAPI = 1;
                }else {
                    param.paySence = 6;
                    param.payPwd = '111111';
                }
                api.pay(param).then((res) => {
                    //支付成功
                    if(PayTypeMap[this.payType] === 3) {
                        this.isPaid = true;
                        this.$router.push({
                            name: 'PaySuccess',
                            params: {
                                type: this.$route.params.type,
                                id: this.$route.params.id
                            }
                        });
                    }else {
                        //todo js调用支付api
                        this.callWxPay(JSON.parse(res.data.text));
                    }
                }, ()=> {
                    this.isPaid = false;
                    Toast({
                        message: '支付失败，请重试',
                        position: 'bottom'
                    });
                })
            },
            callWxPay(data){
                WeixinJSBridge.invoke('getBrandWCPayRequest',{
                    signType:data.signType+"",
                    paySign:data.paySign+"",
                    appId:data.appId+"",
                    nonceStr:data.nonceStr+"",
                    timeStamp:data.timeStamp+"",
                    total_fee:"1",
                    package:data.package+""
                },function(res) {
                    if(res.err_msg === 'get_brand_wcpay_request:ok') {
                        Toast({
                            message: '支付成功',
                            position: 'bottom'
                        });
                        //todo 跳转支付成功页面
                        this.isPaid = true;
                        this.$router.replace({
                            name: 'PaySuccess',
                            params: {
                                type: this.$route.params.type,
                                id: this.$route.params.id
                            }
                        });
                    } else {
                        this.isPaid = false;
                        Toast({
                            message: '支付失败',
                            position: 'bottom'
                        });
                    }
                });
            }
        },
        mounted(){
            let type = this.$route.params.type;
            let typeName = type.split('@')[0];
            let typeId = type.split('@')[1];
            this.typeName = typeName;
            this.typeId = typeId;
            this.init();
        },
        beforeRouteLeave(to, from, next){
            if(this.typeName === 'party' && !this.isPaid) {
                MessageBox.confirm('您确定取消报名吗？', '提示').then(res => {
                    // 取消订单
                    api.getPartyOrderDetail(this.$route.params.id).then(data => {
                        if(+data.data.status === -1) {
                            this.isPaid = true;
                            next({
                                name: 'Party'
                            });
                        }else {
                            api.updateOrderStatus(this.$route.params.id, -1).then(data => {
                                this.isPaid = true;
                                next({
                                    name: 'Party'
                                });
                            }, () => {
                                Toast({
                                    message: '取消订单失败',
                                    position: 'bottom'
                                });
                                next(false);
                            });
                        }
                    }, ()=>{
                        this.isPaid = true;
                        next({name: 'Party'});
                    });
                }, ()=> {
                    next(false);
                });
            }else {
                next();
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .pay {
        padding-top: 50px;
        img {
            max-width: 100%;
            min-height: 100%;
            height: auto;
        }
        .row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 15/37.5rem;
            background: #fff;
            .project-avatar {
                width: 60/37.5rem;
                height: 60/37.5rem;
                border-radius: 60/37.5rem;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 60/37.5rem;
                }
            }
            .project-name {
                font-size: 0.5rem;
                flex: 1;
                margin-left: 0.3rem;
                div {
                    display: -webkit-box;
                    /* autoprefixer: off */
                    -webkit-box-orient: vertical;
                    /* autoprefixer: on */
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .project-money {
                color: @red;
                font-size: 0;
                img {
                    vertical-align: middle;
                }
                span {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 0.48rem;
                    margin-left: 0.2rem;
                }
            }
        }
        .cell {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 15/37.5rem;
            border-bottom: 1px solid #dedede;
            background: #fff;
            .pay-logo {
                width: 30/37.5rem;
                height: 30/37.5rem;
                border-radius: 30/37.5rem;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 30/37.5rem;
                }
            }
            .pay-tip-box {
                margin-left: 0.2rem;
                flex: 1;
                color: @dark;
                .pay-tip {
                    color: @text-grey;
                    font-size: 14/37.5rem;
                    &.golden {
                        color: @golden;
                    }
                }
            }
            .checkbox {
                width: 30/37.5rem;
                height: 30/37.5rem;
                .radio {
                    width: 100%;
                    height: 100%;
                    background-image: ~"url(../assets/image/unchose.png)";
                    background-size: 100% 100%;
                    &.checked {
                        background-image: ~"url(../assets/image/chose.png)";
                    }
                }
            }
        }
        .golden-tip {
            padding: 15/37.5rem;
            font-size: 14/37.5rem;
            color: @golden;
            text-align: left;
        }
        .pay-tip {
            text-align: center;
            color: @text-grey;
            font-size: 13/37.5rem;
            padding: 3/37.5rem;
        }
        .btn-block {
            margin-top: 0.2rem;
            width: 100%;
            .btn {
                margin: 0 auto;
                background: @red;
                width: 80%;
                height: 55/37.5rem;
                line-height: 55/37.5rem;
                text-align: center;
                color: @white;
                font-size: 0.5rem;
                border-radius: 5/37.5rem;
                span {
                    font-size: 15/37.5rem;
                    color: @golden;
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }
    }
</style>
