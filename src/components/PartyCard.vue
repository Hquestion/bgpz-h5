<template>
    <div class="party-card">
        <div class="party-img">
            <img :src="data.picTheme">
        </div>
        <div class="party-footer">
            <div class="avatar">
                <bg-avatar class="avatar-box" :src="data.ownerAvatar"></bg-avatar>
                <div class="avatar-tag">
                    <span>聚主</span>
                </div>
            </div>
            <div class="party-detail">
                <div class="party-theme" v-text="data.theme"></div>
                <div class="party-owner">
                    <span v-text="data.ownerName"></span><span>联合创始人</span>
                </div>
                <div class="party-money">
                    <img src="../assets/image/money.png"><span>￥{{data.costPer}}/人</span>
                </div>
                <div class="party-count">
                    <img src="../assets/image/user.png">
                    <span>
                        <span class="has-count">{{data.hasNumber}}</span>/<span class="sub">{{data.partyNumber}}</span>人
                        <span class="party-indicator">报名中</span>
                    </span>
                </div>
                <div class="party-time">
                    <img src="../assets/image/time.png"><span>{{data.partyTime | dateFormat('sec')}}</span>
                </div>
                <div class="party-address">
                    <img src="../assets/image/location.png"><span>{{data.partyAddress}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import filter from '../mixins/filter';
    import BgAvatar from "./BgAvatar";
    export default {
        name: "PartyCard",
        components: {BgAvatar},
        mixins: [filter],
        props: {
            data: {}
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .party-card {
        width: 100%;
        height: auto;
        border-radius: 6/37.5rem;
        box-shadow: 0 0 10px 4px #dedede;
        background: @white;
        .party-img {
            width: 100%;
            height: 55vw;
            img {
                width: 100%;
                height: 100%;
                border-top-left-radius: 6/37.5rem;
                border-top-right-radius: 6/37.5rem;
            }
        }
        .party-footer {
            padding: 20/37.5rem 10/37.5rem;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            .avatar {
                width: 20%;
                text-align: center;
                .avatar-box {
                    margin: 0 auto;
                }
                .avatar-tag {
                    margin-top: 0.2rem;
                    span {
                        padding: 3/37.5rem 5/37.5rem;
                        background: @golden;
                        color: @white;
                        font-size: 0.4rem;
                        border-radius: 3/37.5rem;
                        display: inline-block;
                    }
                }
            }
            .party-detail {
                flex: 1;
                color: #1b1b1b;
                .party-theme {
                    color: #000;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    text-overflow: ellipsis;
                    /* autoprefixer: off */
                    -webkit-box-orient: vertical;
                    /* autoprefixer: on */
                    font-size: 0.5rem;
                    line-height: 1.3;
                }
                .party-owner {
                    font-size: 0.46rem;
                    color: #000;
                    span + span {
                        color: #666;
                        font-size: 0.4rem;
                        margin-left: 0.2rem;
                    }
                }
                .party-money {
                    color: @red;
                    margin-top: 0.6rem;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    img {
                        margin-top: 0.1rem;
                    }
                    span {
                        flex: 1;
                        margin-left: 0.2rem;
                    }
                }
                .party-count {
                    display: flex;
                    justify-content: flex-start;
                    margin-top: 0.1rem;
                    align-items: flex-start;
                    img {
                        margin-top: 0.1rem;
                    }
                    & > span {
                        flex: 1;
                        margin-left: 0.2rem;
                        .has-count {
                            font-size: 0.46rem;
                            color: #1b1b1b;
                        }
                        .party-indicator {
                            padding: 0.05rem 0.2rem;
                            border: 1px solid @red;
                            color: @red;
                            border-radius: 50px;
                            font-size: 0.4rem;
                            margin-left: 0.5rem;
                        }
                    }
                }
                .party-time {
                    display: flex;
                    justify-content: flex-start;
                    margin-top: 0.1rem;
                    align-items: flex-start;
                    img {
                        margin-top: 0.1rem;
                    }
                    span {
                        flex: 1;
                        margin-left: 0.2rem;
                    }
                }
                .party-address {
                    display: flex;
                    justify-content: flex-start;
                    margin-top: 0.1rem;
                    align-items: flex-start;
                    img {
                        margin-top: 0.1rem;
                    }
                    span {
                        flex: 1;
                        margin-left: 0.2rem;
                    }
                }
            }
        }
    }
</style>