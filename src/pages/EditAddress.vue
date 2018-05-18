<template>
    <div class="edit-address">
        <bg-header :title="editAddressTitle"></bg-header>
        <bg-cell arrow="true">
            <div slot="left">会员名称</div>
            <bg-input slot="middle" type="text" placeholder="请输入" reverse="true" v-model="addressInfo.name"></bg-input>
        </bg-cell>
        <bg-cell arrow="true">
            <div slot="left">联系电话</div>
            <bg-input slot="middle" type="tel" placeholder="请输入" reverse="true" v-model="addressInfo.phone"></bg-input>
        </bg-cell>
        <bg-cell arrow="true" @click.native.prevent="selectAddress">
            <div slot="left">省市区</div>
            <bg-input slot="middle" type="text" placeholder="请选择" reverse="true" v-model="position" :read-only="true"></bg-input>
        </bg-cell>
        <div class="detail-address">
            <textarea v-model="addressInfo.addr" placeholder="请输入详细地址"></textarea>
        </div>
        <bg-white-space></bg-white-space>
        <bg-cell :arrow="false">
            <div slot="left">设为默认</div>
            <div slot="middle">
                <mt-switch v-model="isSetDefault"></mt-switch>
            </div>
        </bg-cell>
        <bg-white-space height="0.8rem"></bg-white-space>
        <bg-button @tap="saveAddress">保存</bg-button>
        <popup-picker v-model="selectAddressVisible"
                      :picker-slots="addressPickerSlots"
                      title="请选择地址"
                      value-key="name"
                      @change="adjustAddress"
                      @data-change="onConfirmAddress"
        ></popup-picker>
    </div>
</template>

<script>
    import BgCell from "../components/BgCell";
    import BgInput from '../components/BgInput';
    import BgWhiteSpace from "../components/BgWhiteSpace";
    import BgButton from "../components/BgButton";
    import BgHeader from "../components/BgHeader";
    import {Switch, Toast} from 'mint-ui';

    import api from '../api';
    import addressPickerGenerator from '../mixins/addressPickerGenerator';
    import PopupPicker from "../components/PopupPicker";

    export default {
        name: "EditAddress",
        components: {
            PopupPicker,
            BgHeader,
            BgButton,
            BgWhiteSpace,
            BgCell,
            BgInput,
            MtSwitch: Switch
        },
        mixins: [addressPickerGenerator],
        data(){
            return {
                addressInfo: {
                    name: '',
                    phone: '',
                    addr: '',
                    cityInfo: {},
                    stateInfo: {},
                    regionInfo: {}
                },
                isSetDefault: true,
                addressPickerSlots: [],
                selectAddressVisible: false
            };
        },
        computed: {
            editAddressTitle(){
                if(this.$route.query.id) {
                    return '编辑地址';
                }else {
                    return '添加地址';
                }
            },
            addressId(){
                return this.$route.query.id;
            },
            position(){
                let stateInfo = this.addressInfo.stateInfo || {name: ''},
                    cityInfo = this.addressInfo.cityInfo || {name: ''},
                    regionInfo = this.addressInfo.regionInfo || {name: ''};
                return `${stateInfo.name || ''}${cityInfo.name || ''}${regionInfo.name || ''}`;
            }
        },
        methods: {
            init(){
                // 江苏省id
                if(this.addressId) {
                    // 获取地址详情并渲染
                    api.getAddressDetail(this.addressId).then(res => {
                        this.addressInfo = res.data.list[0];
                        this.isSetDefault = this.addressInfo['default'] === 1;
                        api.getRegionList().then(res => {
                            this.addressPickerSlots = this.generateAddressSlots(res.data, this.addressInfo);
                        });
                    });
                } else {
                    api.getRegionList().then(res => {
                        this.addressPickerSlots = this.generateAddressSlots(res.data);
                    });
                }
            },
            saveAddress(){
                let param = {
                    name: this.addressInfo.name,
                    phone: this.addressInfo.phone,
                    addr: this.addressInfo.addr,
                    default: this.isSetDefault ? 1 : 0,
                    regionId: this.addressInfo.regionInfo.id
                };
                if(this.addressInfo.id) {
                    param.id = this.addressInfo.id;
                }
                api.saveAddress(param).then(res => {
                    this.$router.go(-1);
                }, ()=>{
                    Toast({
                        message: '保存地址失败，请重试',
                        position: 'bottom'
                    });
                });
            },
            selectAddress(){
                this.selectAddressVisible = true;
            },
            onConfirmAddress(value){
                this.addressInfo['stateInfo'] = {id: value[0].id, name: value[0].name};
                if(value[2]) {
                    this.addressInfo['cityInfo'] = {id: value[1].id, name: value[1].name};
                    this.addressInfo['regionInfo'] = {id: value[2].id, name: value[2].name};
                }else {
                    this.addressInfo['cityInfo'] = {};
                    this.addressInfo['regionInfo'] = {id: value[1].id, name: value[1].name};
                }
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    .edit-address {
        padding-top: 50px;
        padding-bottom: 30/37.5rem;
        .detail-address {
            width: 100%;
            padding: 0 15/37.5rem;
            background: #fff;
            textarea {
                width: 100%;
                height: 80/37.5rem;
                border: 1px solid #dedede;
                outline: none;
                font-size: 15/37.5rem;
                padding: 5/37.5rem;
                border-radius: 5/37.5rem;
                resize: none;
            }
        }
    }
</style>
