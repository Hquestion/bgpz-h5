<template>
    <div class="party-detail">
        <bg-header title="聚会详情" type="back" :to="backTo">
            <v-touch slot="action" @tap="share">
                <img src="../assets/image/share.png" style="width: 0.7rem;">
            </v-touch>
        </bg-header>
        <div class="theme-pic">
            <img :src="partyAds" v-if="!partyMeta.videoContent || partyMeta.videoContent.length === 0">
            <div class="party-video" v-else>
                <video id="partyVideo" controls="controls" preload autoplay loop  v-for="(video,index) in partyMeta.videoContent" :key="index"@canplay="onloadVideo">
                    <source :src="video.img" type="video/mp4"/>
                </video>
            </div>
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
        <bg-white-space></bg-white-space>
        <div class="detail-tab-anchor" :class="{fixed: currentAnchor > 0}">
            <div class="anchor-container">
                <div class="anchor-item" :class="{active: currentAnchor === 1}" @click="toAnchor(1)">主题</div>
                <div class="anchor-item" :class="{active: currentAnchor === 2}" @click="toAnchor(2)">菜单</div>
                <div class="anchor-item" :class="{active: currentAnchor === 3}" @click="toAnchor(3)">环境</div>

            </div>
        </div>
        <div id="anchor1"></div>
        <div class="party-part-indicator">
            <img src="../assets/image/party-theme.jpg">
        </div>
        <bg-article-title title="聚会主题"></bg-article-title>
        <div class="theme-pic">
            <img :src="partyMeta.picTheme">
        </div>
        <div class="party-desc" v-html="descHtml">

        </div>
        <div id="anchor2"></div>
        <div class="party-part-indicator">
            <img src="../assets/image/party-package.jpg">
        </div>
        <bg-article-title title="聚会菜单"></bg-article-title>
        <div class="party-foods" v-show="!partyMeta.picOwnfood || partyMeta.picOwnfood.length === 0">
            <swiper :options="swiperOption" class="swiper-block" style="margin-top: 0;">
                <swiper-slide v-for="(food, index) in showFoodList" :key="index">
                    <img class="poster-img" :src="food && food.imageUrl">
                    <div class="food-name"><span>{{index + 1}}</span>{{food.name}} -- {{food.typeName}}</div>
                </swiper-slide>
            </swiper>
        </div>
        <div class="party-foods" v-show="partyMeta.picOwnfood && partyMeta.picOwnfood.length > 0">
            <swiper :options="swiperOption" class="swiper-block" style="margin-top: 0;">
                <swiper-slide v-for="(food, index) in partyMeta.picOwnfood" :key="index">
                    <img class="poster-img" :src="food && food.img">
                </swiper-slide>
            </swiper>
        </div>
        <bg-white-space></bg-white-space>
        <div id="anchor3"></div>
        <div class="party-part-indicator">
            <img src="../assets/image/party-env.jpg">
        </div>
        <div class="party-img" v-for="(pic, index) in partyMeta.picContent" :key="index">
            <img class="poster-img" :src="pic && pic.img || pic">
        </div>

        <bg-white-space></bg-white-space>
        <div class="party-comment">
            <div class="party-comment-header">
                <h3>聚会评论</h3>
                <div class="comment-btn" @click="prepareComment" style="display: none;">评论</div>
            </div>
            <div class="party-comment-list">
                <mt-loadmore :auto-fill="false" :bottom-method="loadComment" :bottom-all-loaded="!commentVisible" ref="loadmore">
                    <comment-card v-for="(item, index) in commentList" :data="item" :key="index" :index="index" @delete="onDeleteComment"></comment-card>
                    <div v-if="commentList.length === 0" style="padding: 20px;text-align: center">暂无评论</div>
                </mt-loadmore>
            </div>
        </div>
        <footer>
            <!--<div>还缺少:<span class="golden">{{partyMeta.partyNumber - partyMeta.hasNumber}}</span>人<span class="cost">报名费:<span class="red">￥{{partyMeta.costPer}}/人起</span></span></div>-->
            <div class="info">
                <div class="icon-btns">
                    <a :href="'tel:' + partyMeta.ownerPhone"><img src="../assets/image/kefu.png"></a>
                    <a @click="share"><img src="../assets/image/share.png"/></a>
                </div>
                <div class="party-count" style="flex: 1">
                    <div><span class="red">{{partyMeta.hasNumber}}</span>/<span>{{partyMeta.partyNumber}}</span></div>
                </div>
            </div>
            <div class="price-block" @click="prepareComment">
                评&nbsp;论({{commentTotal}})
            </div>
            <v-touch class="btn" @tap="join()" v-show="+partyMeta.status === 1 && partyMeta.partyNumber - partyMeta.hasNumber > 0">
                <!--<span>{{partyMeta.costPer}}元起/人</span>-->
                <div>立即报名</div>
            </v-touch>
            <v-touch class="btn disable" v-show="partyMeta.partyNumber - partyMeta.hasNumber <= 0 && +partyMeta.status === 1">
                <!--<span>{{partyMeta.costPer}}元起/人</span>-->
                <div>名额已满</div>
            </v-touch>
            <v-touch class="btn disable" v-show="+partyMeta.status !== 1">
                <!--<span>{{partyMeta.costPer}}元起/人</span>-->
                <div>已结束报名</div>
            </v-touch>
        </footer>
        <vodal :show="commentVisible" animation="zoom" @hide="commentVisible = false" :custom-styles="{width: '100vw', padding: '0', background: 'transparent'}">
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
    import {Loadmore} from 'mint-ui';
    import BgHeader from "../components/BgHeader";
    import PartyInfo from "../components/PartyInfo";
    import BgArticleTitle from "../components/BgArticleTitle";
    import api from '../api';
    import PartyMemberCard from "../components/PartyMemberCard";

    import 'swiper/dist/css/swiper.css'
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
                rightScrollable: false,
                commentTotal: 0,
                currentAnchor: 1
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
                    if(this.partyMeta.picOwnfood) {
                        this.partyMeta.picOwnfood = JSON.parse(this.partyMeta.picOwnfood);
                    }
                    this.initShareCfg({
                        description: this.partyMeta.description,
                        theme: this.partyMeta.theme,
                        href: `${config.partyDetailUrl}${this.$route.params.id}`,
                        shareImg: this.partyMeta.picTheme
                    });
                    this.$nextTick(()=>{
                        wx.ready(function() {
                            document.getElementById('partyVideo').play();
                        });
                        document.addEventListener("WeixinJSBridgeReady", function() {
                            document.getElementById("partyVideo").play();
                        }, false);
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
                this.loadComment();
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
                            this.commentTotal = res.data && res.data.totalsize;
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
                            this.commentList.unshift({
                                id: res.data.id,
                                avatar: userInfo.avatar,
                                nickname: userInfo.nickname,
                                cmt_time: res.data.cmt_time,
                                cmt_content: this.commentText,
                                uid: userInfo.id
                            });
                            this.commentText = '';
                        }, (res) => {
                            window.commonToast({
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
                    window.commonToast({
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
            },
            onDeleteComment(id, index){
                window.msgBox.confirm('确认删除本条评论？', '提示').then(()=>{
                    api.deleteComment(id).then(res => {
                        this.commentList.splice(index, 1);
                    }, ()=>{
                        window.commonToast({
                            message: '删除评论失败',
                            position: 'bottom'
                        });
                    });
                });
            },
            toAnchor(id){
                let pOffset = this.$el.scrollTop;
                let anchor = this.$el.querySelector('#anchor'+id).getBoundingClientRect().top - 95;
                this.$el.scrollTop = pOffset + anchor;
            }
        },
        mounted(){
            if(window.history.length === 1) {
                this.backTo = '/party';
            }
            this.handleScroll = (e)=> {
                let anchorPositions = [];
                for(let i = 1; i <= 3; i++) {
                    let el = this.$el.querySelector('#anchor'+ i);
                    anchorPositions.push(el.getBoundingClientRect().top - 100);
                }
                if(anchorPositions[0] > 0) {
                    this.currentAnchor = 0;
                }else {
                    let currentIndex = anchorPositions.findIndex(item => item > 0);
                    if(currentIndex >= 0) {
                        this.currentAnchor = currentIndex;
                    }else {
                        this.currentAnchor = 3;
                    }
                }
            };
            this.handleScroll = this.handleScroll.bind(this);
            this.$nextTick(()=>{
                this.$el.addEventListener('scroll', this.handleScroll);
            });
            this.init();
        },
        beforeDestroy(){
            console.log('组件销毁');
            this.$el.removeEventListener('scroll', this.handleScroll);
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
        .detail-tab-anchor {
            width: 100%;
            height: 50/37.5rem;
            line-height: 50/37.5rem;
            .anchor-container {
                width: 100%;
                height: 50/37.5rem;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                background: #fff;
                font-size: 16/37.5rem;
                transition: transform ease-in .5s;
            }
            .anchor-item {
                text-align: center;
                flex: 1;
                height: 100%;
                border-bottom: 1px solid #dedede;
                &.active {
                    color: @red;
                    border-bottom: 3/37.5rem solid @red;
                }
            }
            &.fixed {
                .anchor-container {
                    position: fixed;
                    top: 50px;
                    left: 0;
                    z-index: 10;
                    width: 100vw;
                }
            }
        }
        .party-desc {
            padding: 0 15/37.5rem;
            font-size: 16/37.5rem;
            line-height: 1.8;
        }
        .party-video {
            padding: 0;
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
            .info {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 44vw;
                .icon-btns {
                    a, img {
                        margin-left: 5/37.5rem;
                        display: inline-block;
                        vertical-align: middle;
                        width: 0.7rem;
                        height: 0.7rem;
                    }
                    a + a  img{
                        width: 0.7rem;
                        height: 0.7rem;
                    }
                    a img {
                        margin-left: 0;
                    }
                }
                .party-count {
                    flex: 1;
                    text-align: center;
                    font-size: 18/37.5rem;
                    div {
                        font-size: 18/37.5rem;
                        .red {
                            color: @red;
                        }
                    }
                }
            }
            .price-block {
                width: 26vw;
                height: 50/37.5rem;
                line-height: 50/37.5rem;
                background: @golden;
                text-align: center;
                color: #fff;
                font-size: 16/37.5rem;
            }
            .golden{
                color: @golden;
                font-size: 0.6rem;
            }
            .btn {
                background: @red;
                width: 30vw;
                height: 50/37.5rem;
                text-align: center;
                color: @white;
                font-size: 16/37.5rem;
                display: flex;
                flex-direction: column;
                /*align-items: flex-end;*/
                align-items: center;
                justify-content: center;
                /*padding-right: 0.2rem;*/
                span {
                    font-size: 16/37.5rem;
                }
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
        .party-part-indicator {
            text-align: center;
            img {
                width: 45/37.5rem;
            }
        }
    }
    .share-visible .fixed .anchor-container {
        transform: translateY(80/37.5rem);
    }
</style>
