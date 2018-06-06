<template>
    <div class="my-party-card">
        <v-touch @tap="toDetail">
            <div class="party-header">
                <bg-avatar :src="data.ownerAvatar"></bg-avatar>
                <div class="theme">
                    <div class="theme-box">{{data.theme}}</div>
                    <div class="party-time">{{data.partyTime | dateFormat('sec')}}</div>
                </div>
                <div class="status-text" :style="{color: statusText.color}">{{statusText.text}}</div>
            </div>
            <div class="party-detail">
                <div class="row">
                    <div class="label">聚会费用</div>
                    <div class="label-content">
                        <span class="red">￥{{data.costPer}}</span>/人
                    </div>
                </div>
                <div class="row">
                    <div class="label">聚会人数</div>
                    <div class="label-content">
                        {{data.partyNumber}}人
                    </div>
                </div>
                <div class="row">
                    <div class="label">聚会时间</div>
                    <div class="label-content">
                        {{data.partyTime | dateFormat('sec')}}
                    </div>
                </div>
                <div class="row">
                    <div class="label">聚会地点</div>
                    <div class="label-content">
                        {{data.partyAddress}}
                    </div>
                </div>
                <div class="row">
                    <div class="label">报名截止</div>
                    <div class="label-content">
                        {{data.closingTime | dateFormat('sec')}}
                    </div>
                </div>
            </div>
        </v-touch>
        <div class="actions" v-show="data.status + '' !== '3' && data.status + '' !== '-1' && type === '1'" >
            <div class="info" v-show="data.status + '' === '0'">
                <div class="share-text-tip"><img src="../assets/image/notice.png"><span>需转发到朋友圈才能完成发布</span></div>
                <v-touch class="btn" @tap="toShareParty">去转发</v-touch>
            </div>
            <div class="tip" v-show="data.status + '' === '1'">
                <v-touch class="btn" @tap="cancelParty">取消聚会</v-touch>
            </div>
        </div>
        <div class="actions" v-show="data.partyInStatus + '' === '0' && type === '2'" >
            <div class="info" v-show="data.partyInStatus + '' === '0'">
                <div class="share-text-tip"><span>支付剩余时间：<span v-text="showPayLeftTime"></span></span></div>
                <v-touch class="btn" @tap="toPay" v-show="payLeftTime > 0">去付款</v-touch>
            </div>
        </div>
    </div>
</template>

<script>
    import BgAvatar from "./BgAvatar";
    import filter from '../mixins/filter'

    import dayjs from 'dayjs';

    const statusTextMap = {
        '-1': {
            'text': '已关闭',
            'color': '#AA9069'
        },
        '0': {
            'text': '未发布',
            'color': '#E70022'
        },
        '1': {
            'text': '报名中',
            'color': '#AA9069'
        },
        '2': {
            'text': '待开始',
            'color': '#E70022'
        },
        '3': {
            'text': '已结束',
            'color': '#AA9069'
        }
    };
    const joinedStatusTextMap = {
        '0': {
            'text': '待付款',
            'color': '#E70022'
        },
        '1': {
            'text': '待开始',
            'color': '#AA9069'
        },
        '3': {
            'text': '已结束',
            'color': '#AA9069'
        },
        '-1': {
            'text': '已关闭',
            'color': '#AA9069'
        },
        '4': {
            text: '已评价',
            color: '#AA9069'
        }
    };
    export default {
        name: "MyPartyCard",
        mixins: [filter],
        props: {
            data: {},
            type: {
                default: '1'           //1:我发布的   2：我参加的
            }
        },
        components: {BgAvatar},
        data(){
            return {
                payLeftTime: 0
            };
        },
        computed: {
            statusText(){
                if(this.type === '1') {
                    return statusTextMap[this.data.status];
                }else {
                    if(+this.data.partyInStatus === 0) {
                        return joinedStatusTextMap[this.data.partyInStatus];
                    } else if(+this.data.partyInStatus === -1) {
                        return joinedStatusTextMap[this.data.partyInStatus];
                    } else if(+this.data.partyInStatus === 2) {
                        return joinedStatusTextMap[this.data.partyInStatus];
                    }else {
                        if(+this.data.status === -1) {
                            return joinedStatusTextMap[this.data.partyInStatus];
                        }else if(+this.data.status === 1) {
                            return joinedStatusTextMap['1'];
                        }else if(+this.data.status === 2) {
                            return joinedStatusTextMap['1'];
                        }else if(+this.data.status === 3) {
                            return joinedStatusTextMap['3'];
                        }
                    }
                }
            },
            showPayLeftTime(){
                if(this.payLeftTime > 0) {
                    return dayjs(this.payLeftTime).format('mm:ss');
                }else {
                    return '已超时';
                }
            }
        },
        methods: {
            init(){
                if(this.data.partyInStatus + '' === '0' && this.type === '2') {
                    let now = dayjs();
                    let partInTime = dayjs(this.data.partyInTime * 1000);
                    this.payLeftTime = partInTime.valueOf() + 15 * 60 *1000 - now.valueOf();
                    if(this.payLeftTime > 0) {
                        let timer = setInterval(()=>{
                            now = dayjs();
                            this.payLeftTime = partInTime.valueOf() + 15 * 60 *1000 - now.valueOf();
                            if(this.payLeftTime <= 0) {
                                clearInterval(timer);
                            }
                        }, 1000);
                    }
                }
            },
            cancelParty(){

            },
            toShareParty(){
                this.$router.push({
                    name: 'ShareParty',
                    params: {
                        id: this.data.id
                    }
                })
            },
            toPay(){
                this.$router.push({
                    name: 'Pay',
                    params: {
                        type: `party@${this.data.id}`,
                        id: this.data.orderId,
                        money: this.data.money
                    }
                });
            },
            toDetail(){
                this.$router.push({
                    name: 'PartyDetail',
                    params: {
                        id: this.data.id
                    }
                });
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .my-party-card {
        width: 100%;
        padding: 15/37.5rem;
        background: #fff;
        border-top: 1px solid #dedede;
        border-bottom: 1px solid #dedede;
        .party-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .theme {
                flex: 1;
                margin-left: 0.4rem;
                .theme-box{
                    font-size: 16/37.5rem;
                }
                .party-time {
                    color: @text-grey;
                    margin-top: 5/37.5rem;
                }
            }
            .status-text {
                padding: 0 8/37.5rem;
            }
        }
        .party-detail {
            padding: 15/37.5rem 15/37.5rem 15/37.5rem 65/37.5rem;
            .row {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                margin-top: 0.2rem;
                .label {
                    color: @text-grey;
                }
                .label-content {
                    margin-left: 0.3rem;
                    flex: 1;
                }
            }
        }
        .actions {
            padding-top: 10/37.5rem;
            border-top: 1/37.5rem solid #dedede;
            display: flex;
            justify-content: space-between;
            flex-direction: row-reverse;
            .info {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: @golden;
                .share-text-tip {
                    font-size: 0;
                    img {
                        margin-right: 0.2rem;
                        vertical-align: middle;
                    }
                    span {
                        font-size: 14/37.5rem;
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
                .btn {
                    border: 1px solid @red;
                    color: @red;
                }
            }
            .btn {
                display: inline-block;
                padding: 5/37.5rem 15/37.5rem;
                border: 1px solid @text-grey;
                color: @text-grey;
                border-radius: 5/37.5rem;
            }
        }
        & + .my-party-card {
            margin-top: 10/37.5rem;
        }
    }
</style>
