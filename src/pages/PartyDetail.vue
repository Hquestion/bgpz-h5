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
        <bg-article-title title="聚会成员"></bg-article-title>
        <div class="partner-tip">报名用户间点击用户头像可拨打电话</div>
        <div class="party-member-block">
            <div class="member-list" @scroll="onMemberListScroll">
                <div v-if="partyMembers && partyMembers.length > 0" class="member-list-items">
                    <div v-for="(item, index) in partyMembers" :key="index" class="member-list-item">
                        <a v-if="isUserInParty" :href="'tel:' + item.phone">
                            <party-member-card-new :data="item"></party-member-card-new>
                        </a>
                        <a v-if="!isUserInParty">
                            <party-member-card-new :data="item"></party-member-card-new>
                        </a>
                    </div>
                </div>
                <div v-else style="text-align: center;padding: 10px;">
                    暂无成员加入聚会
                </div>
            </div>
            <div class="arrow arrow-left" v-show="leftScrollable"></div>
            <div class="arrow arrow-right" v-show="rightScrollable"></div>
        </div>
        <bg-article-title title="聚会主题"></bg-article-title>
        <div class="theme-pic">
            <img :src="partyMeta.picTheme">
        </div>
        <div class="party-desc" v-html="descHtml">

        </div>
        <div class="party-video" v-show="partyMeta.videoContent && partyMeta.videoContent.length > 0">
            <video loop preload :src="video.img" v-for="(video,index) in partyMeta.videoContent" :key="index" @canplay="onloadVideo"></video>
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
        <bg-white-space></bg-white-space>
        <div class="party-comment">
            <div class="party-comment-header">
                <h3>聚会评论</h3>
                <div class="comment-btn" @click="prepareComment">发表评论</div>
            </div>
            <div class="party-comment-list">
                <mt-loadmore :bottom-method="loadComment" :bottom-all-loaded="!commentVisible" ref="loadmore">
                    <comment-card v-for="(item, index) in commentList" :data="item" :key="index"></comment-card>
                    <div v-if="commentList.length === 0" style="padding: 20px;text-align: center">暂无评论</div>
                </mt-loadmore>
            </div>
        </div>
        <footer>
            <!--<div>还缺少:<span class="golden">{{partyMeta.partyNumber - partyMeta.hasNumber}}</span>人<span class="cost">报名费:<span class="red">￥{{partyMeta.costPer}}/人起</span></span></div>-->
            <div class="icon-btns">
                <a href="tel:4008-718-181"><img src="../assets/image/kefu.png"></a>
                <!--<a @click="share"><img src="../assets/image/share.png"/></a>-->
            </div>
            <div class="party-count" style="flex: 1">
                已报名：<span v-text="partyMeta.hasNumber"></span>人
            </div>
            <div class="price-block">
                {{partyMeta.costPer}}元/人起
            </div>
            <v-touch class="btn" @tap="join()" v-show="+partyMeta.status === 1 && partyMeta.partyNumber - partyMeta.hasNumber > 0">立即报名</v-touch>
            <v-touch class="btn disable" v-show="partyMeta.partyNumber - partyMeta.hasNumber <= 0 && +partyMeta.status === 1">名额已满</v-touch>
            <v-touch class="btn disable" v-show="+partyMeta.status !== 1">已结束报名</v-touch>
        </footer>
        <vodal :show="commentVisible" animation="slideDown" @hide="commentVisible = false" :custom-styles="{width: '100vw', padding: '0', background: 'transparent'}">
            <div class="comment-modal-container">
                <div class="comment-modal-header">发表评论</div>
                <textarea placeholder="请输入评论内容" v-model="commentText"></textarea>
                <div class="comment-modal-tip">
                    <div>请遵守相关法律，严禁发表任何非法、低俗言论</div>
                    <div>200字以内</div>
                </div>
                <div class="comment-btns">
                    <bg-button type="default" @tap="commentVisible = false">取&nbsp;消</bg-button>
                    <bg-button @tap="doSendComment">发&nbsp;布</bg-button>
                </div>
            </div>
        </vodal>
    </div>
</template>

<script>
    import {Loadmore, Toast} from 'mint-ui';
    import BgHeader from "../components/BgHeader";
    import PartyInfo from "../components/PartyInfo";
    import BgArticleTitle from "../components/BgArticleTitle";
    import api from '../api';
    import PartyMemberCard from "../components/PartyMemberCard";

    import 'swiper/dist/css/swiper.css'
    import 'vodal/common.css';
    import 'vodal/slide-down.css';
    import {swiper, swiperSlide} from 'vue-awesome-swiper';

    import share from '../mixins/share';
    import config from '../config';
    import PartyMemberCardNew from "../components/PartyMemberCardNew";
    import CommentCard from "../components/CommentCard";
    import BgWhiteSpace from "../components/BgWhiteSpace";
    import Vodal from "vodal";
    import BgButton from "../components/BgButton";
    import form from '../util/form';

    const commentPageSize = 20;
    export default {
        name: "PartyDetail",
        mixins: [share],
        components: {
            BgButton,
            Vodal,
            BgWhiteSpace,
            CommentCard,
            PartyMemberCardNew,
            PartyMemberCard,
            BgHeader,
            PartyInfo,
            BgArticleTitle,
            swiper,
            swiperSlide,
            'mt-loadmore': Loadmore
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
                packageFoodList: [],
                commentList: [],
                commentVisible: false,
                commentPageIndex: 1,
                commentText: '',
                commentHaveMore: true,
                leftScrollable: false,
                rightScrollable: false
            }
        },
        computed: {
            isUserInParty(){
                let userId = localStorage.getItem('openid');
                if(userId) {
                    let index = this.partyMembers.findIndex(item => {
                        return (item.id + '') === (userId + '');
                    });
                    return index >= 0 || this.partyMeta.uid + '' === userId + '';
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
            },
            descHtml(){
                return this.partyMeta.description && this.partyMeta.description.replace(/\n/g, '<br>');
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
                    if(res.length > 3) {
                        this.rightScrollable = true;
                    }
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
            },
            loadComment(){
                if(this.commentHaveMore) {
                    api.getPartyCommentList(this.$route.params.id, this.commentPageIndex++, commentPageSize).then(res =>{
                        if(res.data) {
                            this.commentList = this.commentList.concat(res.data && res.data.list || []);
                            if(+res.data.isLast === 1) {
                                this.commentHaveMore = false;
                            }else {
                                this.commentHaveMore = true;
                            }
                        }else {
                            this.commentHaveMore = false;
                        }
                        this.$refs.loadmore.onBottomLoaded();
                    }, ()=>{
                        this.$refs.loadmore.onBottomLoaded();
                    });
                }
            },
            doSendComment(){
                let validationList = [
                    {method: 'isNotEmpty', message: '请输入评论内容', param: [this.commentText]},
                ];
                if(form.validate(validationList)) {
                    api.getUserInfo().then(data => {
                        let userInfo = data.data;
                        api.sendComment(this.$route.params.id, this.commentText).then(res => {
                            this.commentVisible = false;
                            this.commentList.push({
                                id: res.data.id,
                                avatar: userInfo.avatar,
                                nickname: userInfo.nickname,
                                cmt_time: res.data.cmt_time,
                                cmt_content: this.commentText
                            });
                        }, (res) => {
                            Toast({
                                message: '评论失败,请重试',
                                position: 'bottom'
                            });
                        });
                    })
                }
            },
            prepareComment(){
                if(this.isUserInParty) {
                    this.commentVisible = true;
                }else {
                    Toast({
                        message: '报名后才可以发表评论',
                        position: 'bottom'
                    });
                }
            },
            onMemberListScroll(e){
                if(e.target.scrollLeft === 0) {
                    this.leftScrollable = false;
                    this.rightScrollable = true;
                }else if(e.target.clientWidth + e.target.scrollLeft === e.target.scrollWidth) {
                    this.leftScrollable = true;
                    this.rightScrollable = false;
                }else {
                    this.leftScrollable = true;
                    this.rightScrollable = true;
                }
            },
            onloadVideo(e){
                console.log(e);
                e.target.play();
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
        }
        .party-video {
            padding: 0 15/37.5rem;
            width: 100vw;
            video {
                width: 100%;
            }
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
        .partner-tip {
            position: relative;
            font-size: 12px;
            text-align: center;
            top: -10px;
            color: @text-grey;
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
        .member-list {
            width: 100vw;
            overflow: auto;
            padding: 10/37.5rem 0;
            position: relative;
            .member-list-items {
                display: inline;
                white-space: nowrap;
                .member-list-item {
                    width: 33.33vw;
                    display: inline-block;
                }
            }
        }
        .party-member-block {
            position: relative;
            width: 100vw;
            overflow: hidden;
            height: auto;
            .arrow {
                position: absolute;
                width: 12/37.5rem;
                height: 20/37.5rem;
                top: 50%;
                background-image:~"url('../assets/image/arrow-right.png')";
                background-size: 100% 100%;
                &.arrow-left {
                    left: 5/37.5rem;
                    transform: translate3d(0, -50%, 0) rotate(180deg);
                }
                &.arrow-right {
                    right: 5/37.5rem;
                    transform: translate3d(0, -50%, 0);
                }
            }
        }
        .party-comment {
            background: #fff;
            .party-comment-header {
                padding: 15/ 37.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #dedede;
                border-bottom: 1px solid #dedede;
                h3 {
                    color: @golden;
                    font-size: 18/37.5rem;
                }
                .comment-btn {
                    font-size: 12/37.5rem;
                    padding: 8/37.5rem 20/37.5rem;
                    color: #454545;
                    background: #eeeeee;
                    border-radius: 50/37.5rem;
                    border: 1px solid #ccc;
                }
            }
            .party-comment-list {
                padding: 0 10/37.5rem;
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
            padding: 0;
            z-index: 5;
            .icon-btns {
                width: 10vw;
                a, img {
                    margin-left: 5/37.5rem;
                    display: inline-block;
                    vertical-align: middle;
                    width: 21/37.5rem;
                    height: 21/37.5rem;
                }
            }
            .price-block {
                width: 30vw;
                height: 50/37.5rem;
                line-height: 50/37.5rem;
                background: @golden;
                text-align: center;
                color: #fff;
            }
            .golden{
                color: @golden;
                font-size: 0.6rem;
            }
            .btn {
                background: @red;
                width: 30vw;
                height: 50/37.5rem;
                line-height: 50/37.5rem;
                text-align: center;
                color: @white;
                font-size: 16/37.5rem;
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
        .comment-modal-container {
            background: #fff;
            border-radius: 10/37.5rem;
            padding: 10/37.5rem;
            width: 94%;
            margin: 0 auto;
            .comment-modal-header {
                font-size: 18/37.5rem;
                text-align: center;
                padding: 5/37.5rem 0 5/37.5rem;
            }
            textarea {
                width: 100%;
                height: 120/37.5rem;
                border-radius: 5/37.5rem;
                border: 1px solid #dedede;
                padding: 0.2rem;
                resize: none;
                outline: none;
            }
            .comment-modal-tip {
                display: flex;
                justify-content: space-between;
                font-size: 12/37.5rem;
                padding: 0 0 0.1rem 0;
                color: @text-grey;
            }
            .comment-btns {
                display: flex;
                padding: 10/37.5rem 0;
                .bg-button {
                    width: 45%;
                    height: 50/37.5rem;
                    line-height: 50/37.5rem;
                }
            }
        }
    }
</style>
