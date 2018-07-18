<template>
    <div class="join-party">
        <bg-header title="立即报名"></bg-header>
        <party-info :data="partyMeta" :is-join="true"></party-info>
        <div class="field row">
            <div class="label">报名人数</div>
            <div class="content">
                <number-input v-model="joinNumber" :min="1" :max="partyMeta.partyNumber - partyMeta.hasNumber"></number-input>
            </div>
        </div>
        <div class="field" v-show="partyMeta.partyType !== 3">
            <div class="label">打赏聚主</div>
            <div class="content">
                <div class="list">
                    <v-touch v-for="(item, index) in moneyList" :key="index" :class="{active: item === selectMoney}" @tap="setMoney(item)">
                        ￥{{item}}
                    </v-touch>
                </div>
                <div class="other">其他金额<span class="golden">（最低{{partyMeta.costPer}}元）</span></div>
                <div class="other-input">
                    <input type="number" v-model="payMoney" placeholder="请输入想打赏的金额" :min="+partyMeta.costPer"/>
                </div>
                <div class="pay-type">
                    <div>匿名打赏</div>
                    <div>
                        <mt-switch v-model="isNiming"></mt-switch>
                    </div>
                </div>
            </div>
        </div>
        <div class="field">
            <div class="label">跟大家打个招呼吧：</div>
            <div class="content">
                <input v-model="remark" type="text" placeholder="最多可以输入20个字" maxlength="20">
            </div>
        </div>
        <div class="golden tip">
            <div class="label">报名须知：</div>
            <div class="pay-party-tip" v-if="partyMeta.partyType !== 3">
                1、累计参加（活动聚会）10次，送2000元生日宴1桌；<br>
                2、打赏付费后分享到朋友圈才算报名成功；<br>
                3、报名成功后获得的微信消息通知可作为参会凭证；<br>
                4、打赏付款成功的名额，无法退款和改期，可自行转让名额；<br>
                5、不接受现场付款和临时加入，特殊情况请联系聚主；<br>
                6、聚会请着时装和正装；请不要迟到，活动准时开始；<br>
                7、未达成人数，聚主有权取消聚会，平台安排退款；<br>
                8、费用不包括酒水，可自带或现场AA制；<br>
                9、如需要平台帮助，请联系客服热线<a href="tel:4008-718-181">4008-718-181</a><br>
            </div>
            <div class="free-party-tip" v-else>
                1、报名后分享到朋友圈方视为报名成功；<br>
                2、报名成功后获得的微信消息通知可作为参会凭证；<br>
                3、报名成功的名额不可转让；<br>
                4、不接受现场报名和临时加入，特殊情况请联系聚主；<br>
                5、聚会请着时装和正装；请不要迟到，活动准时开始；<br>
                6、未达成人数，聚主有权取消聚会；<br>
                7、报名成员必须是聚主的朋友；<br>
                8、如需要平台帮助，请联系客服热线<a href="tel:4008-718-181">4008-718-181</a><br>
            </div>
        </div>
        <footer>
            <div class="count">合计<span class="red">￥{{totalMoney}}</span></div>
            <v-touch class="btn" @tap="pay">去支付</v-touch>
        </footer>
    </div>
</template>

<script>
    import PartyInfo from '../components/PartyInfo';
    import BgHeader from "../components/BgHeader";
    import NumberInput from "../components/NumberInput";
    import {Switch, Toast} from 'mint-ui';
    import api from '../api';
    export default {
        name: "JoinParty",
        data(){
            return {
                partyMeta: {},
                joinNumber: 1,
                payMoney: '',
                selectMoney: '',
                isNiming: false,
                remark: ''
            };
        },
        components: {
            BgHeader,
            PartyInfo,
            NumberInput,
            'mt-switch': Switch
        },
        computed: {
            totalMoney(){
                return this.joinNumber * (+this.payMoney || +this.selectMoney || 0);
            },
            moneyList(){
                let result = [];
                if(this.partyMeta && this.partyMeta.costPer) {
                    for(let i =0; i < 4; i++) {
                        result.push(+this.partyMeta.costPer + 100 * i);
                    }
                }
                return result;
            }
        },
        methods: {
            init() {
                api.getPartyDetail(this.$route.params.id).then(res => {
                    this.partyMeta = res.data;
                    this.selectMoney = +this.partyMeta.costPer;
                }, res => {
                    this.partyMeta = {};
                });
            },
            setMoney(money){
                this.selectMoney = money;
            },
            pay(){
                if(this.joinNumber === 0) {
                    Toast({
                        message: `请选择报名人数`,
                        position: 'bottom'
                    });
                    return;
                }
                if(this.payMoney && this.payMoney < +this.partyMeta.costPer) {
                    Toast({
                        message: `打赏金额不能低于${this.partyMeta.costPer}元`,
                        position: 'bottom'
                    });
                    return;
                }
                if(this.partyMeta.partyType === 3) {
                    //如果是免费聚会,直接调用余额支付
                    api.joinParty({
                        anonymous: this.isNiming ? 1: 0,
                        cost: 0,
                        number: this.joinNumber,
                        partyId: this.$route.params.id,
                        remark: this.remark
                    }).then(res => {
                        api.pay({
                            orderId: res.data.applyId,
                            payType: '3',
                            paySence: 6,
                            payPwd: '111111'
                        }).then(payRes => {
                            this.$router.replace({
                                name: 'PaySuccess',
                                params: {
                                    type: `party@${this.$route.params.id}`,
                                    id: res.data.applyId
                                },
                                query: {
                                    isNiming: this.isNiming ? 1: 0
                                }
                            });
                        }, ()=>{
                            commonToast({
                                message: '聚会报名失败，请重试',
                                position: 'bottom'
                            });
                        })
                    }, ()=>{
                        commonToast({
                            message: '聚会报名失败，请重试',
                            position: 'bottom'
                        });
                    });
                    return;
                }
                if(this.totalMoney === 0) {
                    Toast({
                        message: `打赏金额不能低于${this.partyMeta.costPer}元`,
                        position: 'bottom'
                    });
                    return;
                }
                api.joinParty({
                    anonymous: this.isNiming ? 1: 0,
                    cost: this.totalMoney,
                    number: this.joinNumber,
                    partyId: this.$route.params.id,
                    remark: this.remark
                }).then(res => {
                    this.$router.push({
                        name: 'Pay',
                        params: {
                            type: `party@${this.$route.params.id}`,
                            id: res.data.applyId,
                            money: res.data.money
                        },
                        query: {
                            isNiming: this.isNiming ? 1: 0
                        }
                    });
                }, res => {
                    Toast({
                        message: '加入聚会失败，请重试',
                        position: 'bottom'
                    });
                });
            }
        },
        watch: {
            payMoney(val){
                if(val) {
                    this.selectMoney = '';
                }
            },
            selectMoney(val){
                if(val) {
                    this.payMoney = '';
                }
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .join-party {
        padding-top: 50px;
        padding-bottom: 50/37.5rem;
        background: #fff;
        font-size: 15/37.5rem;
        .field {
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            padding: 10/37.5rem 15/37.5rem;
            &.row {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
            .label {
                font-size: 16/37.5rem;
                color: #000;
            }
            .content {
                .list {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10/37.5rem 0;
                    div{
                        width: 20%;
                        height: 35/37.5rem;
                        line-height: 35/37.5rem;
                        text-align: center;
                        border: 1px solid #dedede;
                        border-radius: 5/37.5rem;
                        &.active {
                            color: @red;
                            border: 1px solid @red;
                        }
                    }
                }
                .other {
                    font-size: 15/37.5rem;
                    padding: 5/37.5rem 0;
                    .golden {
                        color: @golden;
                        font-size: 15/37.5rem;
                    }
                }
                .other-input {
                    width: 100%;
                }
                .pay-type {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 15/37.5rem;
                    padding: 10/37.5rem 0;
                }
            }
        }
        input {
            width: 100%;
            height: 40/37.5rem;
            text-indent: 0.2rem;
            border: 1px solid #dedede;
            outline: none;
            border-radius: 5/37.5rem;
            font-size: 0.45rem;
            margin-top: 10/37.5rem;
        }
        .tip {
            color: @golden;
            padding: 0 0.4rem 0.3rem 0.4rem;
            font-size: 0.32rem;
            line-height: 1.5;
            .label {
                padding: 0 5px 5px 0;
            }
            a {
                color: @red;
            }
        }
        footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50/37.5rem;
            background: #fff;
            padding: 15/37.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #dedede;
            .count {
                color: @text-grey;
                font-size: 0.5rem;
                .red {
                    color: @red;
                    margin-left: 0.2rem;
                }
            }
            .btn {
                background: @red;
                width: 100/37.5rem;
                height: 40/37.5rem;
                line-height: 40/37.5rem;
                text-align: center;
                color: @white;
                font-size: 0.5rem;
                border-radius: 5/37.5rem;
            }
        }
    }
</style>
