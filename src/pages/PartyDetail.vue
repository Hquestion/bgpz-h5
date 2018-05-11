<template>
    <div class="party-detail">
        <bg-header title="聚会详情" type="back">
            <v-touch slot="action" @tap="share">
                <img src="../assets/image/share.png">
            </v-touch>
        </bg-header>
        <party-info :data="partyMeta"></party-info>
        <bg-article-title title="聚会主题"></bg-article-title>
        <div class="party-desc">
            {{partyMeta.description}}
        </div>
        <div class="theme-pic">
            <img :src="partyMeta.picTheme">
        </div>
        <bg-article-title title="聚会成员"></bg-article-title>
        <div class="member-list">
            <div v-if="partyMembers && partyMembers.length > 0">
                <PartyMemberCard v-for="(item, index) in partyMembers" :key="index" :data="item"></PartyMemberCard>
            </div>
            <div v-else style="text-align: center;padding: 10px;">
                暂无成员加入聚会
            </div>
        </div>
        <footer>
            <div>还缺少：<span class="golden">{{partyMeta.partyNumber - partyMeta.hasNumber}}</span>人</div>
            <v-touch class="btn" @tap="join()" v-show="!isUserInParty">立即报名</v-touch>
            <v-touch class="btn disable" v-show="isUserInParty">已参加</v-touch>
        </footer>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import PartyInfo from "../components/PartyInfo";
    import BgArticleTitle from "../components/BgArticleTitle";
    import api from '../api';
    import PartyMemberCard from "../components/PartyMemberCard";

    import share from '../mixins/share';
    import config from '../config';
    export default {
        name: "PartyDetail",
        mixins: [share],
        components: {
            PartyMemberCard,
            BgHeader,
            PartyInfo,
            BgArticleTitle
        },
        data(){
            return {
                partyMeta: {},
                partyMembers: []
            }
        },
        computed: {
            isUserInParty(){
                let userId = localStorage.getItem('openid');
                if(userId) {
                    let index = this.partyMembers.findIndex(item => {
                        return (item.id + '') === (userId + '');
                    });
                    return index >= 0;
                }else {
                    return false;
                }
            }
        },
        methods: {
            init(){
                api.getPartyDetail(this.$route.params.id).then(res => {
                    this.partyMeta = res.data;
                    this.initShareCfg({
                        description: this.partyMeta.description,
                        theme: this.partyMeta.theme,
                        href: `${config.partyDetailUrl}${this.$route.params.id}`,
                        shareImg: this.partyMeta.picTheme
                    });
                }, res => {
                    this.partyMeta = {};
                });
                api.getPartyMemberList(this.$route.params.id).then(res => {
                    this.partyMembers = res;
                }, res => {
                    this.partyMembers = [];
                });
            },
            join(){
                this.$router.push({
                    name: 'JoinParty',
                    params: {
                        id: this.$route.params.id
                    }
                });
            },
            share(){

            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .party-detail {
        padding-top: 50px;
        padding-bottom: 50/37.5rem;
        background: #fff;
        .party-desc {
            padding: 0 15/37.5rem;
        }
        .theme-pic {
            padding: 15/37.5rem;
            img {
                width: 100%;
            }
        }
        footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50/ 37.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            border-top: 1px solid #dedede;
            padding: 0 15/37.5rem;
            .golden{
                color: @golden;
                font-size: 0.6rem;
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
                &.disable {
                    background: @text-grey;
                }
            }
        }
    }
</style>
