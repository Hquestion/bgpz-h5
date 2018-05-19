<template>
    <div class="party-member-card-new">
        <div class="avatar-box">
            <bg-avatar class="avatar" :src="data.avatar">
                <div class="join-count">&times;{{data.number}}</div>
            </bg-avatar>
        </div>
        <div class="phone">{{showPhone}}</div>
        <div class="money">{{data.money}}元</div>
    </div>
</template>

<script>
    import BgAvatar from "./BgAvatar";
    export default {
        name: "PartyMemberCardNew",
        components: {BgAvatar},
        props: {
            data: {}
        },
        computed: {
            showPhone(){
                return this.data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .party-member-card-new {
        width: 30vw;
        text-align: center;
        .avatar-box {
            .avatar{
                margin: 0 auto;
                position: relative;
                .join-count {
                    position: absolute;
                    bottom: 5/37.5rem;
                    color: @text-grey;
                    font-size: 12/37.5rem;
                    right: -0.6rem;
                }
            }
        }
        .phone {
            margin-top: 10/37.5rem;
            color: @text-grey;
            font-size: 12/37.5rem;
        }
        .money {
            margin-top: 10/37.5rem;
            color: @golden;
            font-size: 14/37.5rem;
        }
    }
</style>
