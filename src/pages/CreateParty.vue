<template>
    <div class="create-party">
        <bg-header title="发起聚会"></bg-header>
        <bg-article-title title="基本信息"></bg-article-title>
        <div class="base-info">
            <bg-cell arrow="true">
                <div slot="left">主题</div>
                <bg-input slot="middle" type="text" placeholder="最多20个字" reverse="true" v-model="model.theme"></bg-input>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="selectTime">
                <div slot="left">时间</div>
                <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="model.time" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell>
                <div slot="left">地址</div>
                <div class="address-selector" slot="middle">
                    <bg-radio-group v-model="model.addressType" :reverse="true" @change="onAddressTypeChange">
                        <bg-radio label="我有场地" :value="1"></bg-radio>
                        <bg-radio label="使用平台场地" :value="2"></bg-radio>
                    </bg-radio-group>
                </div>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="chooseAddress">
                <div slot="left">详细地址</div>
                <div slot="middle" v-text="model.address"></div>
            </bg-cell>
            <bg-cell>
                <div slot="left">报名截止时间</div>
                <bg-input slot="middle" type="text" :placeholder="`聚会开始前${partyEndJoinHour}小时`" reverse="true" v-model="endJoinTime" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="selectTableCount">
                <div slot="left">人数</div>
                <bg-input slot="middle" type="text" placeholder="聚会人数" reverse="true" v-model="tableCount" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="selectDinnerFee">
                <div slot="left">餐费标准</div>
                <bg-input slot="middle" type="text" placeholder="每桌消费标准" reverse="true" v-model="showFeePer" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell>
                <div slot="left">报名费</div>
                <bg-input slot="middle" type="text" placeholder="根据餐费标准计算" reverse="true" v-model="joinFee" read-only="true"></bg-input>
            </bg-cell>
        </div>
        <bg-article-title title="聚主信息"></bg-article-title>
        <div class="owner-info">
            <bg-cell :arrow="false">
                <div slot="left">头像</div>
                <bg-avatar slot="middle" :src="userInfo.avatar"></bg-avatar>
            </bg-cell>
            <bg-cell :arrow="false">
                <div slot="left">姓名</div>
                <div slot="middle">{{userInfo.nickname}}</div>
            </bg-cell>
            <bg-cell :arrow="false">
                <div slot="left">职业</div>
                <div slot="middle">{{userInfo.role}}</div>
            </bg-cell>
            <bg-cell :arrow="false">
                <div slot="left">电话</div>
                <div slot="middle">{{userInfo.phone}}</div>
            </bg-cell>
        </div>
        <bg-article-title title="选择背景图"></bg-article-title>
        <div class="party-bg-image-block">
            <div class="bg-images">
                <div class="user-local-image" v-show="!!model.localBgImg">
                    <v-touch class="local-img-box" @tap="selectBgImg(-1)">
                        <img :src="model.localBgImg">
                        <div class="check-radio" :class="{checked: model.selectedBgImg === model.localBgImg}"></div>
                    </v-touch>
                </div>
                <v-touch class="bg-images-item" v-for="(item, index) in partyBgList" :key="index" @tap="selectBgImg(index)">
                    <img :src="item">
                    <div class="check-radio" :class="{checked: model.selectedBgImg === item}"></div>
                </v-touch>
            </div>
            <div class="change-bg-btns">
                <v-touch class="user-upload-file">
                    <span>上传本地图片></span>
                    <input type="file" accept="image/*" @change="onPickImg">
                </v-touch>
                <v-touch class="change-list" @tap="changeBgImg">
                    <span>换一组</span><img src="../assets/image/changeicon.png">
                </v-touch>
            </div>
        </div>
        <bg-article-title title="主题说明"></bg-article-title>
        <div class="party-desc">
            <bg-cell column="true">
                <div slot="left">聚会说明</div>
                <textarea slot="middle" placeholder="请输入50-500字的主题说明" v-model="model.description"></textarea>
            </bg-cell>
            <bg-cell column="true" :reverse="false">
                <div slot="left">聚会宣传图片<span class="golden">（请上传4张以上）</span></div>
                <bg-image-picker slot="middle" v-model="model.partyPoster"></bg-image-picker>
            </bg-cell>
            <bg-cell column="true" :reverse="false">
                <div slot="left">聚会宣传视频<span class="golden">（请上传5M大小以内的视频）</span></div>
                <bg-video-picker slot="middle" v-model="model.partyVideo"></bg-video-picker>
            </bg-cell>
        </div>
        <div class="decalare">
            注：聚会成员给聚主最低打赏金额为{{joinFee}}元，此次聚会{{model.partyNumber}}人，可收益{{profit}}元。
        </div>
        <bg-button @tap="nextStep">下一步</bg-button>
        <popup-picker v-model="selectTimeVisible" :picker-slots="timeSlots" title="请选择聚会时间" @change="adjustDate" @data-change="onConfirmTime"></popup-picker>
        <popup-picker v-model="selectTableCountVisible" :picker-slots="tableCountSlots" title="请选择聚会人数" @change="adjustTableCount" @data-change="onConfirmTableCount"></popup-picker>
        <popup-picker v-model="selectDinnerFeeVisible" :picker-slots="dinnerFeeSlots" title="请选择餐费标准" @data-change="onConfirmDinnerFee"></popup-picker>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import BgArticleTitle from "../components/BgArticleTitle";
    import BgCell from "../components/BgCell";
    import BgInput from "../components/BgInput";
    import BgButton from "../components/BgButton";
    import PopupPicker from "../components/PopupPicker";

    import api from '../api';
    import timePickerGenerator from '../mixins/timePickerGenerator';
    import tableCountGenerator from '../mixins/tableCountGenerator';
    import dinnerFeeGenerator from '../mixins/dinnerFeePickerGenerator';
    import filter from '../mixins/filter';
    import uploadImg from '../mixins/uploadImg';
    import {fillZero} from "../util";
    import form from '../util/form';

    import dayjs from 'dayjs';
    import BgRadioGroup from "../components/BgRadioGroup";
    import BgRadio from "../components/BgRadio";
    import BgAvatar from "../components/BgAvatar";
    import BgImagePicker from "../components/BgImagePicker";
    import BgVideoPicker from "../components/BgVideoPicker";

    import {mapActions} from 'vuex';
    import {SET_PARTY_META} from "../store/modules/party";

    import {Toast, Indicator} from 'mint-ui';

    const party_bg_page_size = 6;
    const addressTypeMap = {
        1: 'user',      //用户地址
        2: 'platform'   //平台地址
    };
    export default {
        name: "CreateParty",
        mixins: [timePickerGenerator, tableCountGenerator, filter, dinnerFeeGenerator, uploadImg],
        components: {
            BgImagePicker,
            BgAvatar,
            BgRadio,
            BgRadioGroup,
            PopupPicker,
            BgButton,
            BgInput,
            BgCell,
            BgArticleTitle,
            BgHeader,
            BgVideoPicker
        },
        data(){
            return {
                selectTimeVisible: false,
                config: {},
                timeSlots: [],
                userInfo: {},
                partyBgPageIndex: 1,
                partyBgList: [],
                tableCountSlots: [],
                selectTableCountVisible: false,
                selectDinnerFeeVisible: false,
                dinnerFeeSlots: [],
                model: {

                }
            };
        },
        computed: {
            partyEndJoinHour(){
                return +Math.floor(this.config.minAppEndTimeToStartTime / 60 / 60 * 10) / 10;
            },
            endJoinTime(){
                if(this.model.timeDate) {
                    return this.formatTime(dayjs(this.model.timeDate.valueOf() - this.config.minAppEndTimeToStartTime * 1000).valueOf());
                }
            },
            joinFeeNumber(){
                return Math.ceil(this.model.feePer * this.model.partyTableNum * (100 + +this.config.partyUpRate) / 100 / this.model.partyNumber);
            },
            joinFee(){
                if(this.model.feePer) {
                    return `￥${this.joinFeeNumber}/人`;
                }else {
                    return '';
                }
            },
            tableCount(){
                return `${this.model.partyTableNum}桌、${this.model.partyNumber}人`;
            },
            profit(){
                if(this.joinFeeNumber) {
                    return (this.joinFeeNumber - Math.ceil(this.model.feePer * this.model.partyTableNum / this.model.partyNumber)) * this.model.partyNumber;
                }else {
                    return 0;
                }
            },
            showFeePer() {
                return `￥${this.model.feePer}/桌`;
            },
        },
        methods: {
            ...mapActions([SET_PARTY_META]),
            init(){
                api.getCfg(['minPartyTimeToStartTime', 'maxPartyTimeToStartTime', 'minPartyToApplyEndTime', 'minAppEndTimeToStartTime', 'partyUpRate']).then(res => {
                    this.config = res.data.list;
                    api.getDiction(['banquetTimeList', 'tablepeople', 'banquetPriceList']).then(dicRes => {
                        this.config.timeList = dicRes.data.list.find(item => item.tag === 'banquetTimeList').sonList;
                        this.timeSlots = this.generateTimeSlots();
                        let tableCountList = dicRes.data.list.find(item => item.tag === 'tablepeople').sonList;
                        this.tableCountSlots = this.generateTableCountSlots(tableCountList, [this.model.partyTableNum, this.model.partyNumber]);
                        let priceList = dicRes.data.list.find(item => item.tag === 'banquetPriceList').sonList;
                        this.model.feePer = +priceList[0].value;
                        this.dinnerFeeSlots = this.generateDinnerFeeSlots(priceList);
                    });
                });
                api.getUserInfo().then(res => {
                    this.userInfo = res.data;
                });
                api.getPartyImages(this.partyBgPageIndex, party_bg_page_size).then(res => {
                    this.partyBgList = res.data.list;
                });
            },
            selectTime(e){
                e.preventDefault();
                this.selectTimeVisible = true;
            },
            onConfirmTime(value){
                this.model.timeDate = dayjs(`${parseInt(value[0])}/${fillZero(parseInt(value[1]))}/${fillZero(parseInt(value[2]))} ${value[3]}`);
                this.model.time = this.formatTime(+this.model.timeDate.toDate());
            },
            changeBgImg(){
                api.getPartyImages(++this.partyBgPageIndex, party_bg_page_size).then(res => {
                    if(res.data.list && res.data.list.length > 0 ) {
                        this.partyBgList = res.data.list;
                    }else {
                        this.partyBgPageIndex = 1;
                        api.getPartyImages(this.partyBgPageIndex, party_bg_page_size).then(res => {
                            this.partyBgList = res.data.list;
                        });
                    }
                });
            },
            selectTableCount(e){
                e.preventDefault();
                this.selectTableCountVisible = true;
            },
            onConfirmTableCount(value){
                this.model.partyTableNum = parseInt(value[0]);
                this.model.partyNumber = parseInt(value[1]);
            },
            selectBgImg(index){
                if(index === -1) {
                    this.model.selectedBgImg = this.model.localBgImg;
                    this.model.selectedBgPageIndex = -1;
                }else {
                    this.model.selectedBgPageIndex = this.partyBgPageIndex;
                    this.model.selectedBgImg = this.partyBgList[index];
                }
            },
            chooseAddress(){
                this.$router.push({
                    name: 'AddressList',
                    query: {
                        isChoose: 1,
                        addressType: addressTypeMap[this.model.addressType]
                    }
                });
            },
            onAddressTypeChange(){
                this.model.address = '';
                this.model.partyPoster = [];
            },
            selectDinnerFee(){
                this.selectDinnerFeeVisible = true;
            },
            onConfirmDinnerFee(value){
                this.model.feePer = value[0].value;
            },
            onPickImg(e){
                let imgs = Array.from(e.target.files);
                if(imgs.length === 0) {
                    return;
                }
                Indicator.open({
                    text: '正在上传图片...',
                    spinnerType: 'fading-circle'
                });
                this.uploadImg(imgs[0]).then(res => {
                    this.model.localBgImg = res.img;
                    Indicator.close();
                }, ()=>{
                    Toast({
                        message: '上传图片失败，请重试',
                        position: 'bottom'
                    });
                    Indicator.close();
                });
            },
            nextStep(){
                let validationList = [
                    {method: 'isNotEmpty', message: '请输入聚会主题', param: [this.model.theme]},
                    {method: 'isNotEmpty', message: '请选择时间', param: [this.model.time]},
                    {method: 'isNotEmpty', message: '请选择地址', param: [this.model.address]},
                    {method: 'isNotEmpty', message: '请选择聚会场景图片', param: [this.model.selectedBgImg]},
                    {method: 'isMatchLength', message: '请输入50-500字的聚会说明', param: [this.model.description, 50, 500]},
                    {method: 'isMatchLength', message: '请添加4张以上聚会图片', param: [this.model.partyPoster, 4, 100]}
                ];
                if(form.validate(validationList)) {
                    //发布聚会
                    let releaseParam = {
                        theme: this.model.theme,
                        tableNumber: this.model.partyTableNum,
                        picTheme: this.model.selectedBgImg,
                        picContent: this.model.partyPoster,
                        partyTime: Math.ceil(this.model.timeDate.valueOf() / 1000),
                        applyEndTime: dayjs(this.model.timeDate.valueOf() - this.config.minAppEndTimeToStartTime * 1000).valueOf() / 1000,
                        partyNumber: this.model.partyNumber,
                        partyAddress: this.model.address,
                        description: this.model.description,
                        companyId: 0,
                        costPer: this.joinFeeNumber,
                        cost: this.model.feePer,
                        descOne: '1',
                        descTwo: '2',
                        descThree: '3',
                        videoContent: this.model.partyVideo
                    };
                    api.releaseParty(releaseParam).then(res => {
                        this.$router.push({
                            name: 'ShareParty',
                            params: {
                                id: res.data.partyId
                            }
                        });
                    }, (res)=>{
                        Toast({
                            message: res.msg,
                            position: 'bottom'
                        });
                    })
                }
            }
        },
        watch: {

        },
        mounted(){
            let self = this;
            this.$watch('model', function(val, oldVal){
                self[SET_PARTY_META](val);
            }, {deep: true});
            this.model = this.$store.getters.getPartyMeta;
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .create-party {
        padding-top: 50px;
        padding-bottom: 60/37.5rem;
        .address-selector {
            width: 90%;
        }
        .party-bg-image-block {
            background-color: #fff;
            .change-bg-btns {
                font-size: 14/37.5rem;
                width: 100vw;
                height: 50/37.5rem;
                line-height: 50/37.5rem;
                display: flex;
                justify-content: space-between;
                .user-upload-file {
                    display: inline-block;
                    width: 50vw;
                    height: 50/37.5rem;
                    padding-left: 15/37.5rem;
                    position: relative;
                    color: #444;
                    input {
                        position: absolute;
                        opacity: 0;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                    }
                }
            }
            .change-list {
                width: 50vw;
                padding-right: 15/37.5rem;
                text-align: right;
                span {
                    display: inline-block;
                    vertical-align: middle;
                    color: @golden;
                }
                img {
                    vertical-align: middle;
                }
            }
            .bg-images {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                padding: 0 15/37.5rem;
                .local-img-box {
                    width: calc(50% - 0.13333rem);
                    height: auto;
                    position: relative;
                    margin: 15/37.5rem auto 0;
                    img {
                        width: 100%;
                        display: block;
                    }
                    .check-radio {
                        position: absolute;
                        top: 3/37.5rem;
                        right: 3/37.5rem;
                        width: 20/37.5rem;
                        height: 20/37.5rem;
                        background-image: ~"url(../assets/image/chosed-w.png)";
                        z-index: 2;
                        background-size: 100% 100%;
                        &.checked {
                            background-image: ~"url(../assets/image/chose.png)";
                        }
                    }
                }
                .bg-images-item {
                    width: calc(50% - 0.13333rem);
                    height: auto;
                    margin-top: 15/37.5rem;
                    position: relative;
                    &:nth-child(2n + 1) {
                        margin-left: 10/37.5rem;
                    }
                    img {
                        width: 100%;
                        display: block;
                    }
                    .check-radio {
                        position: absolute;
                        top: 3/37.5rem;
                        right: 3/37.5rem;
                        width: 20/37.5rem;
                        height: 20/37.5rem;
                        background-image: ~"url(../assets/image/chosed-w.png)";
                        z-index: 2;
                        background-size: 100% 100%;
                        &.checked {
                            background-image: ~"url(../assets/image/chose.png)";
                        }
                    }
                }
            }
        }
        .party-desc {
            background-color: #fff;
            textarea {
                width: 100%;
                height: 150/37.5rem;
                border: 1px solid #dedede;
                border-radius: 5/37.5rem;
                font-size: 16/37.5rem;
                padding: 0.2rem;
                outline: none;
                resize: none;
            }
            .golden {
                font-size: 12/37.5rem;
                color: @golden;
            }
        }
        .decalare {
            padding: 20/37.5rem 15/37.5rem;
            font-size: 14/37.5rem;
            color: @golden;
        }
    }
</style>
