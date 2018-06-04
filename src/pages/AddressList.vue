<template>
    <div class="address-list">
        <bg-header :title="title">
            <div slot="action" v-show="addressType === 'user'">
                <v-touch class="add-address" @tap="addAddress">
                    <img src="../assets/image/Add.png">
                </v-touch>
            </div>
        </bg-header>
        <div class="address-container">
            <address-card class="address-item" v-for="(item, index) in addressList" :key="`${item.id}-${item.default}`"
                          :data="item"
                          :show-use="isChoose"
                          :type="addressType"
                          @edit="onEditAddress"
                          @delete="onDeleteAddress(item, index)"
                          @change-default-address="onChangeDefault"
                          @use="onUseAddress"
            ></address-card>
        </div>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import api from '../api';
    import AddressCard from "../components/AddressCard";

    import {MessageBox} from 'mint-ui';

    import {mapActions} from 'vuex';
    import {SET_USER_ADDRESS} from "../store/modules/party";

    export default {
        name: "AddressList",
        components: {AddressCard, BgHeader},
        data(){
            return {
                addressList: [],
                addressType: 'user',
                isChoose: false,
                title: '管理常用地址'
            };
        },
        methods: {
            ...mapActions([SET_USER_ADDRESS]),
            init(){
                if(this.addressType === 'user') {
                    //如果地址类型是用户地址，则获取用户地址
                    api.getUserAddress(1, 20).then(res => {
                        this.addressList = res.data.list;
                    });
                } else if(this.addressType === 'platform'){
                    api.getPlatformAddress(1, 20).then(res => {
                        this.addressList = res.data.list;
                    });
                }else if(this.addressType === 'thirdpart') {
                    api.getThirdpartAddress().then(res => {
                        this.addressList = res.data.list;
                    });
                }
            },
            addAddress(){
                this.$router.push({
                    name: 'EditAddress'
                });
            },
            onEditAddress(data){
                this.$router.push({
                    name: 'EditAddress',
                    query: {
                        id: data.id
                    }
                });
            },
            onDeleteAddress(data, index){
                MessageBox.confirm('确认删除本地址吗？', '删除地址').then(res => {
                    api.deleteAddress(data.id).then(()=>{
                        this.addressList.splice(index, 1);
                    }, ()=>{
                        Toast({
                            message: '删除地址失败',
                            position: 'bottom'
                        });
                    })
                }, (res => {}));
            },
            onChangeDefault(data){
                api.setDefaultAddress(data.id).then(res => {
                    this.addressList.forEach(item => {
                        item['default'] = 0;
                    });
                    data['default'] = 1;
                });
            },
            onUseAddress(data){
                this[SET_USER_ADDRESS](data);
                this.$router.push({
                    name: 'CreateParty'
                });
            }
        },
        mounted(){
            this.isChoose = (this.$route.query.isChoose + '') === '1';
            if(this.$route.query.addressType) {
                this.addressType = this.$route.query.addressType;
            }
            if(this.isChoose) {
                this.title = '选择地址';
            }
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    .address-list {
        padding-top: 50px;
        .address-item {
            margin-top: 15/37.5rem;
        }
    }
</style>
