<template>
    <div class="share-party">
        <bg-header title="分享到朋友圈"></bg-header>
        <div class="party-container">
            <party-card :data="partyMeta"></party-card>
        </div>
        <div class="share-area">
            <div class="golden">须转发到朋友圈后才能完成聚会发布</div>
            <div class="pyq-logo">
                <img src="../assets/image/pengyouquan.png">
            </div>
        </div>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import PartyCard from "../components/PartyCard";

    import api from '../api';
    import share from '../mixins/share';
    import config from '../config';

    export default {
        name: "ShareParty",
        mixins: [share],
        components: {PartyCard, BgHeader},
        data(){
            return {
                partyMeta: {}
            };
        },
        computed: {
            partyId(){
                return this.$route.params.id;
            }
        },
        methods: {
            init(){
                api.getPartyDetail(this.partyId).then(res => {
                    this.partyMeta = res.data;
                    this.initShareCfg({
                        description: this.partyMeta.description,
                        theme: this.partyMeta.theme,
                        href: `${config.partyDetailUrl}${this.$route.params.id}`,
                        shareImg: this.partyMeta.picTheme,
                        successCb(){
                            this.$router.push({
                                name: 'PartyDetail',
                                params: {
                                    id: this.partyId
                                }
                            });
                        }
                    });
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
    .share-party {
        padding-top: 50px;
        padding-bottom: 120/37.5rem;
        .party-container {
            padding: 15/37.5rem;
            background: #fff;
        }
        .share-area {
            text-align: center;
            height: 120/37.5rem;
            background: #fff;
            position: fixed;
            width: 100%;
            left: 0;
            bottom: 0;
            padding-top: 20/37.5rem;
            .golden {
                color: @golden;
                font-size: 14/37.5rem;
            }
            img {
                margin-top: 10/37.5rem;
                width: 58/37.5rem;
                height: 58/37.5rem;
            }
        }
    }
</style>
