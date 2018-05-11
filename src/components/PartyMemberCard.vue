<template>
    <div class="party-member-card">
        <bg-avatar class="avatar" :src="data.avatar">
        </bg-avatar>
        <div class="brief">
            <div class="name">
                <span v-text="data.nickname"></span>
                <span class="tag">成员</span>
            </div>
            <div class="remark" v-text="data.remark"></div>
        </div>
        <div class="number">
            <span>{{data.number}}</span>人
        </div>
        <div class="money">
            <span class="red">{{data.money}}元</span>
        </div>
    </div>
</template>

<script>
    import BgAvatar from "./BgAvatar";
    export default {
        name: "PartyMemberCard",
        components: {BgAvatar},
        props: {
            data: {}
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .party-member-card {
        padding: 0.2rem 15/37.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
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
        .brief {
            flex: 1;
            .remark {
                color: @text-grey;
                min-height: 0.5rem;
                word-break: break-all;
                line-height: 1;
            }
            .name {
                font-size: 0.5rem;
                span.tag {
                    padding: 3/37.5rem 5/37.5rem;
                    background: @text-grey;
                    color: @white;
                    font-size: 0.4rem;
                    border-radius: 3/37.5rem;
                }
            }
        }
        .number {
            margin-left: 0.3rem;
            color: @text-grey;
        }
        .money {
            margin-left: 0.3rem;
            .red {
                color: @red;
            }
        }
    }
</style>
