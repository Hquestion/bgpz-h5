<template>
    <div class="party-detail">
        <bg-header title="聚会详情" type="back" :to="backTo">
            <v-touch slot="action" @tap="share">
                <img src="../assets/image/share.png">
            </v-touch>
        </bg-header>
        <div class="theme-pic">
            <img :src="partyAds">
        </div>
        <party-info :data="partyMeta"></party-info>
        <bg-article-title title="聚会主题"></bg-article-title>
        <div class="theme-pic">
            <img :src="partyMeta.picTheme">
        </div>
        <div class="party-desc">
            {{partyMeta.description}}
        </div>
        <div class="party-img" v-for="(pic, index) in partyMeta.picContent" :key="index">
            <img class="poster-img" :src="pic && pic.img || pic">
        </div>
        <bg-article-title title="聚会菜单" style="display: none;"></bg-article-title>
        <div class="party-foods" style="display: none;">
            <swiper :options="swiperOption" class="swiper-block" style="margin-top: 0;">
                <swiper-slide v-for="(food, index) in showFoodList" :key="index">
                    <img class="poster-img" :src="food && food.imageUrl">
                    <div class="food-name"><span>{{index + 1}}</span>{{food.name}} -- {{food.typeName}}</div>
                </swiper-slide>
            </swiper>
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
            <div>还缺少:<span class="golden">{{partyMeta.partyNumber - partyMeta.hasNumber}}</span>人<span class="cost">报名费:<span class="red">￥{{partyMeta.costPer}}/人起</span></span></div>
            <v-touch class="btn" @tap="join()" v-show="+partyMeta.status === 1 && partyMeta.partyNumber - partyMeta.hasNumber > 0">立即报名</v-touch>
            <v-touch class="btn disable" v-show="partyMeta.partyNumber - partyMeta.hasNumber <= 0 && +partyMeta.status === 1">名额已满</v-touch>
            <v-touch class="btn disable" v-show="+partyMeta.status !== 1">已结束报名</v-touch>
        </footer>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import PartyInfo from "../components/PartyInfo";
    import BgArticleTitle from "../components/BgArticleTitle";
    import api from '../api';
    import PartyMemberCard from "../components/PartyMemberCard";

    import 'swiper/dist/css/swiper.css'
    import {swiper, swiperSlide} from 'vue-awesome-swiper';

    import share from '../mixins/share';
    import config from '../config';
    export default {
        name: "PartyDetail",
        mixins: [share],
        components: {
            PartyMemberCard,
            BgHeader,
            PartyInfo,
            BgArticleTitle,
            swiper,
            swiperSlide
        },
        data(){
            return {
                partyMeta: {},
                partyAds: '',
                partyMembers: [],
                swiperOption: {
                    autoplay:true,
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    spaceBetween: 0,
                    setWrapperSize: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        // type: 'progressbar'
                    }
                },
                backTo: '',
                packageFoodList: []
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
            },
            showFoodList() {
                let result = [];
                this.packageFoodList.forEach(item => {
                    item.typeList.forEach(food => {
                        food.typeName = item.typeName;
                    });
                    result = result.concat(item.typeList);
                });
                return result;
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
                    api.getPackageFoodList(this.partyMeta.packageId).then(res => {
                        this.packageFoodList = res.data && res.data.list;
                    });
                }, res => {
                    this.partyMeta = {};
                });
                api.getPartyMemberList(this.$route.params.id).then(res => {
                    this.partyMembers = res;
                }, res => {
                    this.partyMembers = [];
                });
                api.getAds('partyDetail').then(res => {
                    this.partyAds = res.data.list[0].imageUrl;
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
                window.EventBus.$emit('share-visible', true);
            }
        },
        mounted(){
            if(window.history.length === 1) {
                this.backTo = '/party';
            }
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
        font-size: 14/37.5rem;
        .party-desc {
            padding: 0 15/37.5rem;
            font-size: 16/37.5rem;
            line-height: 1.8;
            text-indent: 32/37.5rem;
        }
        .theme-pic {
            img {
                width: 100%;
            }
        }
        .party-img {
            width: calc(100vw - 0.8rem);
            margin: 0 auto;
            img {
                width: 100%;
            }
        }
        .swiper-block {
            margin-top: 20/37.5rem;
            width: calc(100vw - 0.8rem);
            .swiper-slide {
                width: calc(100vw - 0.8rem);
                .poster-img {
                    width: calc(100vw - 0.8rem);
                }
            }
        }
        .party-foods {
            position: relative;
            width: calc(100vw - 0.8rem);
            height: auto;
            margin: 0 auto;
            .swiper-slide {
                height: calc(50vw - 0.2rem);
                img {
                    height: 100%;
                    width: 100%;
                }
                .food-name {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: auto;
                    height: 25/37.5rem;
                    line-height: 25/37.5rem;
                    padding: 0 15/37.5rem 0 0;
                    background: rgba(0,0,0, .5);
                    color: #fff;
                    span {
                        width: 25/37.5rem;
                        height: 25/37.5rem;
                        line-height: 25/37.5rem;
                        background: @red;
                        display: inline-block;
                        text-align: center;
                        margin-right: 5/37.5rem;
                    }
                }
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
            z-index: 5;
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
            .cost {
                margin-left: 0.2rem;
                span.red {
                    color: @red;
                }
            }
        }
    }
</style>
