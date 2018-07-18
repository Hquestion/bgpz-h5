<template>
    <div class="pay-success">
        <bg-header title="报名成功" to="/party"></bg-header>
        <div class="success-tip">
            <div class="success-indicator">
                <img src="../assets/image/chosed-w.png">
                <span>您已报名成功！</span>
            </div>
            <div class="project-theme">
                【{{payTypeName}}：{{projectData.theme}}】
            </div>
        </div>
        <bg-cell>
            <div slot="left">时间</div>
            <div slot="middle">{{projectData.partyTime | dateFormat('sec')}}</div>
        </bg-cell>
        <bg-cell>
            <div slot="left">地址</div>
            <div slot="middle">{{projectData.partyAddress}}</div>
        </bg-cell>
        <bg-cell>
            <div slot="left">人数</div>
            <div slot="middle">{{projectData.partyNumber}}人</div>
        </bg-cell>
        <bg-cell>
            <div slot="left">聚主电话</div>
            <div slot="middle"><a :href="'tel:' + projectData.ownerPhone">{{projectData.ownerPhone}}</a></div>
        </bg-cell>
        <bg-button style="margin-top: 0.8rem;display: none;" @tap="goHome">返回列表</bg-button>
        <v-touch class="share-area" @tap="doShareParty">
            <div class="golden">您的聚会还没有分享到朋友圈</div>
            <div class="pyq-logo">
                <img src="../assets/image/pengyouquan.png">
            </div>
        </v-touch>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import BgCell from "../components/BgCell";
    import filter from '../mixins/filter';
    import api from '../api';
    import BgButton from "../components/BgButton";
    import share from '../mixins/share';
    import {Toast} from 'mint-ui';
    import config from '../config';

    const typeNameMap = {
        'party': '聚会'
    };
    export default {
        name: "PaySuccess",
        mixins: [filter, share],
        components: {BgButton, BgCell, BgHeader},
        data(){
            return {
                payType: '',
                payTypeId: '',
                projectData: {},
                isShared: false
            }
        },
        computed: {
            payTypeName(){
                return typeNameMap[this.payType];
            }
        },
        methods: {
            init(){
                if(this.payType === 'party') {
                    this.initPartyData();
                }
            },
            initPartyData(){
                api.getPartyDetail(this.payTypeId).then(res => {
                    this.projectData = res.data;
                    this.wxconfig();
                    if(this.projectData.partyType === 3) {
                        this.hideMenu(['menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:QZone']);
                    }
                    this.initShareCfg({
                        description: this.projectData.description,
                        theme: this.projectData.theme,
                        href: config.partyDetailUrl(this.payTypeId, localStorage.getItem('openid')),
                        shareImg: this.projectData.picTheme,
                        successCb(){
                            this.isShared = true;
                            api.userSharePartyPay(this.$route.params.id).then(res => {
                                this.$router.replace({
                                    name: 'Party'
                                });
                            }, ()=>{
                                commonToast({
                                    message: '操作失败，请重试',
                                    position: 'bottom'
                                });
                            });
                        },
                        failCb(){
                            this.isShared = false;
                        }
                    });
                });
            },
            goHome(){
                this.$router.replace({
                    name: 'Party'
                });
            },
            doShareParty(){
                window.EventBus.$emit('share-visible', true);
            }
        },
        mounted(){
            let typeName = this.$route.params.type.split('@')[0];
            let typeId = this.$route.params.type.split('@')[1];
            this.payType = typeName;
            this.payTypeId = typeId;
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
            if(+this.$route.query.isNiming !== 1) {
                this.isShared = false;
            }else {
                api.userSharePartyPay(this.$route.params.id);
                this.isShared = true;
            }
            this.init();
        },
        beforeRouteLeave(to, from, next){
            if(this.payType === 'party') {
                if(this.isShared) {
                    next();
                }else {
                    Toast({
                        message: '请先分享聚会',
                        position: 'bottom'
                    });
                    next(false);
                }
            }else {
                next();
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .pay-success{
        padding-top: 50px;
        padding-bottom: 120/37.5rem;
        .success-tip {
            background: @red;
            color: #fff;
            text-align: center;
            padding: 25/ 37.5rem;
            .success-indicator {
                font-size: 0;
                padding: 10/37.5rem;
                img {
                    vertical-align: middle;
                }
                span {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 0.56rem;
                    margin-left: 0.3rem;
                }
            }
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
            z-index: 10;
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
