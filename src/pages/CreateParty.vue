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
                <v-touch class="bg-images-item" v-for="(item, index) in partyBgList" :key="index" @tap="selectBgImg(index)">
                    <img :src="item">
                    <div class="check-radio" :class="{checked: model.selectedBgImg === item}"></div>
                </v-touch>
            </div>
            <v-touch class="change-list" @tap="changeBgImg">
                <span>换一组</span><img src="../assets/image/changeicon.png">
            </v-touch>
        </div>
        <bg-article-title title="主题说明"></bg-article-title>
        <div class="party-desc">
            <bg-cell column="true">
                <div slot="left">聚会说明</div>
                <textarea slot="middle" placeholder="请输入不超过200字的主题说明" v-model="model.description"></textarea>
            </bg-cell>
            <bg-cell column="true" :reverse="false">
                <div slot="left">聚会宣传图片<span class="golden">（请上传4-6张）</span></div>
                <bg-image-picker slot="middle" v-model="model.partyPoster"></bg-image-picker>
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
    import {fillZero} from "../util";
    import form from '../util/form';

    import dayjs from 'dayjs';
    import BgRadioGroup from "../components/BgRadioGroup";
    import BgRadio from "../components/BgRadio";
    import BgAvatar from "../components/BgAvatar";
    import BgImagePicker from "../components/BgImagePicker";

    import {mapActions} from 'vuex';
    import {SET_PARTY_META} from "../store/modules/party";

    import {Toast} from 'mint-ui';

    const party_bg_page_size = 6;
    const addressTypeMap = {
        1: 'user',      //用户地址
        2: 'platform'   //平台地址
    };
    export default {
        name: "CreateParty",
        mixins: [timePickerGenerator, tableCountGenerator, filter, dinnerFeeGenerator],
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
            BgHeader
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
                if(this.model.joinFee) {
                    return (this.model.joinFee - Math.ceil(this.model.feePer * this.model.partyTableNum / this.model.partyNumber)) * this.model.partyNumber;
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
                this.model.timeDate = dayjs(`${parseInt(value[0])}-${fillZero(parseInt(value[1]))}-${fillZero(parseInt(value[2]))} ${value[3]}`);
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
                this.model.selectedBgPageIndex = this.partyBgPageIndex;
                this.model.selectedBgImg = this.partyBgList[index];
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
            },
            selectDinnerFee(){
                this.selectDinnerFeeVisible = true;
            },
            onConfirmDinnerFee(value){
                this.model.feePer = value[0].value;
            },
            nextStep(){
                let validationList = [
                    {method: 'isNotEmpty', message: '请输入聚会主题', param: [this.model.theme]},
                    {method: 'isNotEmpty', message: '请选择时间', param: [this.model.time]},
                    {method: 'isNotEmpty', message: '请选择地址', param: [this.model.address]},
                    {method: 'isNotEmpty', message: '请选择聚会场景图片', param: [this.model.selectedBgImg]},
                    {method: 'isMatchLength', message: '请输入50-200字的聚会说明', param: [this.model.description, 50, 200]},
                    {method: 'isMatchLength', message: '请添加4-6张聚会图片', param: [this.model.partyPoster, 4, 6]}
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
                        descThree: '3'
                    };
                    api.releaseParty(releaseParam).then(res => {
                        this.$router.push({
                            name: 'ShareParty',
                            params: {
                                id: res.data.partyId
                            }
                        });
                    }, ()=>{
                        Toast({
                            message: '聚会发布失败，请重试',
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
            .change-list {
                padding: 15/37.5rem;
                text-align: center;
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
                .bg-images-item {
                    width: calc(50% - 0.13333rem);
                    height: auto;
                    margin-top: 15/37.5rem;
                    position: relative;
                    &:nth-child(2n + 2) {
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
                        width: 30/37.5rem;
                        height: 30/37.5rem;
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
