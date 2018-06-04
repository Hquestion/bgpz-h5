<template>
    <div class="party-info" :class="{'to-join': isRunning, 'join-end': isEnd, 'finish': isFinish}">
        <div class="party-theme">{{data.theme}}</div>
        <div class="party-owner">
            <div class="avatar">
                <bg-avatar :src="data.ownerAvatar"></bg-avatar>
            </div>
            <div class="owner-name">
                <div>
                    <span>{{data.ownerName}}</span><span>聚主</span>
                </div>
                <div>
                    职业：{{data.ownerIdentity || '无'}}
                </div>
            </div>
            <!--<div class="party-status" v-show="!isJoin">-->
                <!--<div class="indicator" v-if="data.status === 1">报名中</div>-->
                <!--<div class="party-count">-->
                    <!--已报名：<span v-text="data.hasNumber"></span>人-->
                <!--</div>-->
            <!--</div>-->
        </div>
        <div class="row">
            <div class="label">聚会费用</div>
            <div class="label-content">
                <span class="red">￥{{data.costPer}}</span>/人
            </div>
        </div>
        <div class="row">
            <div class="label">聚会人数</div>
            <div class="label-content">
                <span class="red">{{data.hasNumber}}</span>/{{data.partyNumber}}人
                <span v-show="isJoin">(已报名：<span v-text="data.hasNumber"></span>人)</span>
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
</template>

<script>
    import filter from '../mixins/filter';
    import BgAvatar from "./BgAvatar";
    export default {
        name: "PartyInfo",
        components: {BgAvatar},
        mixins: [filter],
        data(){
            return {}
        },
        props: {
            data: {},
            isJoin: {
                default: false
            }
        },
        computed: {
            isRunning(){
                return +this.data.status === 1 && this.data.partyNumber - this.data.hasNumber > 0
            },
            isEnd(){
                return (this.data.partyNumber - this.data.hasNumber <= 0 && +this.data.status === 1) || +this.data.status === 2;
            },
            isFinish(){
                return +this.data.status === 3;
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .party-info {
        padding: 15/37.5rem;
        .party-theme {
            font-size: 0.5rem;
            font-weight: bold;
        }
        .party-owner {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0.2rem 0;
            .avatar {
                width: 60/37.5rem;
                height: 60/37.5rem;
                border-radius: 60/37.5rem;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 60/37.5rem;
                }
            }
            .owner-name {
                margin-left: 0.3rem;
                flex: 1;
                div:nth-child(1) {
                    font-size: 0.48rem;
                    span+span {
                        padding: 3/37.5rem 5/37.5rem;
                        background: @golden;
                        color: @white;
                        font-size: 0.4rem;
                        border-radius: 3/37.5rem;
                        margin-left: 0.1rem;
                        position: relative;
                        top: -0.05rem;
                    }
                }
                div:nth-child(2) {
                    color: @text-grey;
                    margin-top: 0.1rem;
                }
            }
            .party-status {
                width: 100/37.5rem;
                text-align: center;
                .indicator{
                    padding: 0.05rem 0.2rem;
                    border: 1px solid @red;
                    color: @red;
                    border-radius: 50px;
                    font-size: 12/37.5rem;
                    display: inline-block;
                }
                .party-count {
                    span {
                        color: @golden;
                        font-size: 0.5rem;
                    }
                }
            }
        }
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
                .red {
                    color: @red;
                }
            }
        }
        &.to-join {
            background-image: ~"url('../assets/image/label-join-in.png')";
            background-size: 90/37.5rem 90/37.5rem;
            background-position: calc(100% - 0.4rem) 120/37.5rem;
            background-repeat: no-repeat;
        }
        &.join-end {
            background-image: ~"url('../assets/image/label-to-begin.png')";
            background-size: 90/37.5rem 90/37.5rem;
            background-position: calc(100% - 0.4rem) 120/37.5rem;
            background-repeat: no-repeat;
        }
        &.finish {
            background-image: ~"url('../assets/image/label-finish.png')";
            background-size: 90/37.5rem 90/37.5rem;
            background-position: calc(100% - 0.4rem) 120/37.5rem;
            background-repeat: no-repeat;
        }
    }
</style>
