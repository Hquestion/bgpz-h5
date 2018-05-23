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
        <div class="field">
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
            注：如聚会被取消，则费用将退到账户余额。
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
                isNiming: true,
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
            padding: 15/37.5rem;
            font-size: 0.4rem;
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
