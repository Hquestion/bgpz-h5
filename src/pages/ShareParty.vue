<template>
    <div class="share-party">
        <bg-header title="分享"></bg-header>
        <div class="party-container">
            <party-card :data="partyMeta"></party-card>
        </div>
        <v-touch class="share-area" @tap="doShareParty">
            <div class="golden">须分享后才能完成聚会发布</div>
            <div class="pyq-logo">
                <img src="../assets/image/pengyouquan.png">
            </div>
        </v-touch>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import PartyCard from "../components/PartyCard";

    import api from '../api';
    import share from '../mixins/share';
    import config from '../config';

    import {Toast} from 'mint-ui';

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
                    this.wxconfig();
                    this.initShareCfg({
                        description: this.partyMeta.description,
                        theme: this.partyMeta.theme,
                        href:  config.partyDetailUrl(this.$route.params.id, localStorage.getItem('openid')),
                        shareImg: this.partyMeta.picTheme,
                        successCb(){
                            api.openParty(this.partyId).then(res => {
                                this.$router.push({
                                    name: 'PartyDetail',
                                    params: {
                                        id: this.partyId
                                    }
                                });
                            }, ()=>{
                                Toast({
                                    message: '开始聚会失败，请分享重试',
                                    position: 'bottom'
                                });
                            });
                        }
                    });
                });
            },
            doShareParty(){
                window.EventBus.$emit('share-visible', true);
            }
        },
        mounted(){
            //分享hack
            if(!this.$route.query.refresh) {
                let refreshHref;
                let queryIndex = location.href.lastIndexOf('?');
                let hashIndex = location.href.lastIndexOf('#');
                if(hashIndex > queryIndex) {
                    refreshHref = location.href + '?refresh=1';
                }else {
                    refreshHref = location.href.slice(0, queryIndex + 1) + 'refresh=1&' + location.href.slice(queryIndex + 1);
                }
                window.location.href = refreshHref;
                location.reload();
                return;
            }
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
            border-top: 1px solid #dedede;
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
