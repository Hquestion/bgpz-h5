<template>
    <div class="create-party">
        <bg-header title="发起聚会"></bg-header>
        <bg-article-title title="基本信息"></bg-article-title>
        <div class="base-info">
            <bg-cell arrow="true">
                <div slot="left">主题</div>
                <bg-input slot="middle" type="text" placeholder="最多30个字" reverse="true" v-model="model.theme" maxlength="30"></bg-input>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="selectPartyTypeVisible = true">
                <div slot="left">聚会类型</div>
                <bg-input slot="middle" type="text" placeholder="聚会类型" reverse="true" v-model="partyTypeText" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="selectTime">
                <div slot="left">时间</div>
                <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="model.time" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell>
                <div slot="left">报名截止时间</div>
                <bg-input slot="middle" type="text" :placeholder="`聚会开始前${partyEndJoinHour}小时`" reverse="true" v-model="endJoinTime" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="chooseAddressType">
                <div slot="left">地址</div>
                <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="showAddressType" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell arrow="true" @click.native.prevent.stop="chooseAddress">
                <div slot="left">详细地址</div>
                <div slot="middle" v-text="model.address"></div>
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
            <bg-cell arrow="true" @click.native.prevent.stop="chooseFoodType">
                <div slot="left">菜单</div>
                <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="showFoodType" read-only="true"></bg-input>
            </bg-cell>
            <bg-cell column="true" :reverse="false" v-show="model.foodType === 2">
                <div slot="left">聚会菜单<span class="golden">（请上传4张以上）</span></div>
                <bg-image-picker slot="middle" v-model="model.partyFoods"></bg-image-picker>
            </bg-cell>
        </div>
        <bg-article-title title="聚主信息"></bg-article-title>
        <div class="owner-info">
            <bg-cell :arrow="true">
                <div slot="left">头像</div>
                <div slot="middle" class="avatar-selector">
                    <bg-avatar :src="userInfo.avatar"></bg-avatar>
                    <input type="file" accept="image/*" name="file" @change="onChangeAvatar">
                </div>
            </bg-cell>
            <bg-cell :arrow="true">
                <div slot="left">姓名</div>
                <bg-input slot="middle" type="text" placeholder="请输入姓名" reverse="true" v-model="userInfo.nickname"></bg-input>
            </bg-cell>
            <bg-cell :arrow="true">
                <div slot="left">职业</div>
                <bg-input slot="middle" type="text" placeholder="请输入职业" reverse="true" v-model="userInfo.identity"></bg-input>
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
                        <div class="delete-local-img-btn" @click="deleteLocalImg"></div>
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
        <bg-article-title title="宣传视频"></bg-article-title>
        <div class="video-upload-area">
            <div class="tip">(请上传10M以内视频，只支持抖音和快手视频)</div>
            <bg-video-picker v-model="model.partyVideo"></bg-video-picker>
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
        </div>
        <div class="decalare">
            注：聚会成员给聚主最低打赏金额为{{joinFee}}元，此次聚会{{model.partyNumber}}人，可收益{{profit}}元。
        </div>
        <bg-button @tap="nextStep">下一步</bg-button>
        <popup-picker v-model="selectTimeVisible" :picker-slots="timeSlots" title="请选择聚会时间" @change="adjustDate" @data-change="onConfirmTime"></popup-picker>
        <popup-picker v-model="selectTableCountVisible" :picker-slots="tableCountSlots" title="请选择聚会人数" @change="adjustTableCount" @data-change="onConfirmTableCount"></popup-picker>
        <popup-picker v-model="selectDinnerFeeVisible" :picker-slots="dinnerFeeSlots" title="请选择餐费标准" @data-change="onConfirmDinnerFee"></popup-picker>
        <popup-picker v-model="selectAddressTypeVisible" :picker-slots="addressTypeSlots" title="请选择地址" @data-change="onConfirmAddressType"></popup-picker>
        <popup-picker v-model="selectFoodTypeVisible" :picker-slots="foodTypeSlots" title="请选择菜单" @data-change="onConfirmFoodType"></popup-picker>
        <popup-picker v-model="selectPartyTypeVisible" :picker-slots="partyTypeSlots" title="请选择聚会类型" @data-change="onConfirmPartyType"></popup-picker>
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
        2: 'platform',   //平台地址
        3: 'thirdpart'   //第三方地址
    };
    const addTypeCNMap = {
        1: '自有地址（免费）',      //用户地址
        2: '平台地址（免费）',      //平台地址
        3: '第三方地址（收费）'   //第三方地址
    };
    const foodTypeMap = {
        1: '系统菜单',
        2: '自定义菜单'
    };
    const partyTypeMap = {
        1: '社交聚会',
        2: 'AA制聚会',
        3: '免费聚会'
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

                },
                selectAddressTypeVisible: false,
                selectFoodTypeVisible: false,
                selectPartyTypeVisible: false,
                partyTypeSlots: [{values: [
                        {
                            label: partyTypeMap[1],
                            val: 1
                        }, {
                            label: partyTypeMap[2],
                            val: 2
                        }, {
                            label: partyTypeMap[3],
                            val: 3
                        }
                    ], flex: 1, defaultIndex: 0}]
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
                if(this.model.partyType === 3) {
                    return 0;
                }
                let partyUpRate = 0;
                // 打赏聚会才有收益比例
                if(this.model.partyType === 1) {
                    partyUpRate = +this.config.partyUpRate;
                }
                if(this.model.addressType !== 3) {
                    return Math.ceil(this.model.feePer * this.model.partyTableNum * (100 + partyUpRate) / 100 / this.model.partyNumber);
                }else {
                    return Math.ceil((this.model.feePer * this.model.partyTableNum + this.model.addressFee) * (100 + partyUpRate) / 100 / this.model.partyNumber);
                }
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
                    if(this.model.addressType === 3) {
                        return (this.joinFeeNumber - Math.ceil((this.model.feePer * this.model.partyTableNum + this.model.addressFee) / this.model.partyNumber)) * this.model.partyNumber;
                    }else {
                        return (this.joinFeeNumber - Math.ceil(this.model.feePer * this.model.partyTableNum / this.model.partyNumber)) * this.model.partyNumber;
                    }
                }else {
                    return 0;
                }
            },
            showFeePer() {
                return `￥${this.model.feePer}/桌`;
            },
            showAddressType(){
                if(this.model.addressType !== 3) {
                    return addTypeCNMap[this.model.addressType];
                }else {
                    return `第三方地址(￥${this.model.addressFee})`;
                }
            },
            showFoodType(){
                return foodTypeMap[this.model.foodType];
            },
            partyTypeText(){
                return partyTypeMap[this.model.partyType];
            },
            addressTypeSlots(){
                // if(this.model.partyType === 2) {
                //     return [{
                //         values: [{
                //             label: addTypeCNMap[2],
                //             val: 2
                //         }, {
                //             label: addTypeCNMap[3],
                //             val: 3
                //         }],
                //         defaultIndex: 0,
                //         flex: 1
                //     }];
                // } else {
                //     return [{
                //         values: [{
                //             label: addTypeCNMap[1],
                //             val: 1
                //         }, {
                //             label: addTypeCNMap[2],
                //             val: 2
                //         }, {
                //             label: addTypeCNMap[3],
                //             val: 3
                //         }],
                //         defaultIndex: 0,
                //         flex: 1
                //     }];
                // }
                return [{
                    values: [{
                        label: addTypeCNMap[1],
                        val: 1
                    }, {
                        label: addTypeCNMap[2],
                        val: 2
                    }, {
                        label: addTypeCNMap[3],
                        val: 3
                    }],
                    defaultIndex: 0,
                    flex: 1
                }];
            },
            foodTypeSlots(){
                // if(this.model.addressType === 1 && this.model.partyType !== 3) {
                //     return [
                //         {
                //             values: [{
                //                 label: foodTypeMap[1],
                //                 val: 1
                //             }, {
                //                 label: foodTypeMap[2],
                //                 val: 2
                //             }],
                //             defaultIndex: 0,
                //             flex: 1
                //         }
                //     ]
                // }else {
                //     return [
                //         {
                //             values: [{
                //                 label: foodTypeMap[1],
                //                 val: 1
                //             }],
                //             defaultIndex: 0,
                //             flex: 1
                //         }
                //     ]
                // }
                return [
                    {
                        values: [{
                            label: foodTypeMap[1],
                            val: 1
                        }, {
                            label: foodTypeMap[2],
                            val: 2
                        }],
                        defaultIndex: 0,
                        flex: 1
                    }
                ]
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
            chooseAddressType(){
                this.selectAddressTypeVisible = true;
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
            onConfirmAddressType(value){
                if(value[0].val !== this.model.addressType) {
                    this.model.addressType = value[0].val;
                    this.onAddressTypeChange();
                    this.chooseAddress();
                }
            },
            onAddressTypeChange(){
                this.model.address = '';
                this.model.partyPoster = [];
                if(this.model.addressType !== 1) {
                    this.model.foodType = 1;
                }
            },
            selectDinnerFee(){
                this.selectDinnerFeeVisible = true;
            },
            chooseFoodType(){
                this.selectFoodTypeVisible = true;
            },
            onConfirmFoodType(value){
                this.model.foodType = value[0].val;
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
                    this.model.selectedBgImg = this.model.localBgImg;
                    this.model.selectedBgPageIndex = -1;
                    Indicator.close();
                }, ()=>{
                    Toast({
                        message: '上传图片失败，请重试',
                        position: 'bottom'
                    });
                    Indicator.close();
                });
            },
            onChangeAvatar(e){
                let imgs = Array.from(e.target.files);
                if(imgs.length === 0) {
                    return;
                }
                Indicator.open({
                    text: '正在上传头像...',
                    spinnerType: 'fading-circle'
                });
                this.uploadImg(imgs[0]).then(res => {
                    this.userInfo.avatar = res.img;
                    Indicator.close();
                }, ()=>{
                    Toast({
                        message: '更新头像失败，请重试',
                        position: 'bottom'
                    });
                    Indicator.close();
                });
            },
            onConfirmPartyType(value){
                if(this.model.partyType !== value[0].val) {
                    this.model.partyType = value[0].val;
                    // 如果选择了聚会类型为AA制聚会
                    if(this.model.partyType === 2) {
                        //如果当前选择的地址为自有地址
                        if(this.model.addressType === 1) {
                            //修改地址为平台地址，AA制聚会不允许选择自有场地
                            this.model.addressType = 2;
                            this.model.address = '';
                            this.model.partyPoster = [];
                            //不允许选择自有场地时，同时不允许选择自定义菜单
                            if(this.model.foodType === 2) {
                                this.model.foodType = 1;
                            }
                        }
                    } else if (this.model.partyType === 3) {
                        // 如果是免费聚会，只允许使用平台菜单
                        if(this.model.foodType === 2) {
                            this.model.foodType = 1;
                        }
                    }
                }
            },
            deleteLocalImg(){
                this.model.localBgImg = '';
                this.model.selectedBgImg = '';
                this.model.selectedBgPageIndex = '';
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
                    if(this.model.foodType === 2) {
                        let ispass = form.validate([{method: 'isMatchLength', message: '请添加4张以上菜单图片', param: [this.model.partyFoods, 4, 100]}]);
                        if(!ispass){
                            return;
                        }
                    }
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
                        videoContent: this.model.partyVideo,
                        placetype: this.model.addressType,
                        party_type: this.model.partyType
                    };
                    if(this.model.foodType === 2) {
                        releaseParam.pic_ownfood = this.model.partyFoods;
                    }
                    if(this.model.addressType === 3) {
                        releaseParam.placecost = this.model.addressFee;
                    }
                    api.releaseParty(releaseParam).then(res => {
                        if(this.model.partyType === 3) {
                            //免费聚会需要先支付才能完成发布
                            api.joinParty({
                                anonymous: 0,
                                cost: this.model.feePer * this.model.partyTableNum + this.model.addressFee,
                                number: this.model.partyNumber,
                                partyId: res.data.partyId,
                                remark: ''
                            }).then(resp => {
                                this.$router.push({
                                    name: 'Pay',
                                    params: {
                                        type: `party@${res.data.partyId}`,
                                        id: resp.data.applyId,
                                        money: resp.data.money
                                    },
                                    query: {
                                        isNiming: 0
                                    }
                                });
                            }, ()=> {
                                window.commonToast({
                                    message: '创建聚会失败，请重试',
                                    position: 'bottom'
                                });
                            });
                        }else {
                            this.$router.push({
                                name: 'ShareParty',
                                params: {
                                    id: res.data.partyId
                                }
                            });
                        }
                    }, (res)=>{
                        window.commonToast({
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
            this.$watch('userInfo', function(val, oldVal){
                if(oldVal && oldVal.id) {
                    api.updateUserInfo(val);
                }
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
                    .delete-local-img-btn {
                        position: absolute;
                        top: 3/37.5rem;
                        left: 3/37.5rem;
                        width: 20/37.5rem;
                        height: 20/37.5rem;
                        background-image: ~"url(../assets/image/delete-icon.png)";
                        z-index: 2;
                        background-size: 100% 100%;
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
        .owner-info {
            .avatar-selector {
                display: flex;
                flex-direction: row-reverse;
                position: relative;
                input {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    opacity: 0;
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
        .video-upload-area {
            background: #fff;
            text-align: center;
            font-size: 0.3rem;
            color: #999;
            padding: 0 15/37.5rem 20/37.5rem;
            .tip {
                padding: 5/37.5rem 0 15/37.5rem;
            }
        }
    }
</style>
