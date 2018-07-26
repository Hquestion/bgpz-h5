<template>
    <div class="order-extension">
        <bg-header title="厨房信息"></bg-header>
        <div class="bg-wall"></div>
        <div class="main-content">
            <p>为了更好得给您提供服务，请您完善厨房相关信息！</p>
            <div class="extension-content">
                <div class="banquet-type-selector" v-if="scene !== 'banquet'">
                    <h3>宴会类型<span>（必选）</span></h3>
                    <bg-checkbox-group :single="true">
                        <bg-checkbox-item v-for="(item, index) in banquetTypeList" :key="index" v-model="item.isChecked">
                            {{item.name}}
                        </bg-checkbox-item>
                    </bg-checkbox-group>
                </div>
                <div class="kitchen-extension-container">
                    <div class="kitchen-extension" v-for="(extension, index) in extensionList" :key="index">
                        <h3>{{extension.ExtensionName}}</h3>
                        <bg-checkbox-group :single="extension.ExtensionType === 1">
                            <bg-checkbox-item v-for="(item, index) in extension.DataList" :key="index" v-model="item.isChecked">
                                {{item.select_name}}
                            </bg-checkbox-item>
                        </bg-checkbox-group>
                    </div>
                </div>
                <div class="mark-container">
                    <div class="remark-item-list">
                        <div class="remark-item" v-for="(remark, index) in banquetNote" :key="index" @click="toggleStatus(remark, index)">
                            <div class="remark-icon">
                                <img :src="showRemarkIndicateIcon(remark)">
                            </div>
                        </div>
                    </div>
                    <div class="remark-input">
                        <textarea placeholder="其他信息，比如口味偏好等" v-model="remarkText"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-box">
            <div class="btn btn-pay" @click="doSubmit">确&nbsp;定</div>
        </div>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import BgCheckboxGroup from "../components/BgCheckboxGroup";
    import BgCheckboxItem from "../components/BgCheckboxItem";
    import api from '../api';

    const remarkIcons = {
        '有小孩': {
            icon: require('../assets/image/01h.jpg'),
            activeIcon: require('../assets/image/01.jpg')
        },
        '有老人': {
            icon: require('../assets/image/02h.jpg'),
            activeIcon: require('../assets/image/02.jpg')
        },
        '有孕妇': {
            icon: require('../assets/image/03h.jpg'),
            activeIcon: require('../assets/image/03.jpg')
        },
        '不吃辣': {
            icon: require('../assets/image/04h.jpg'),
            activeIcon: require('../assets/image/04.jpg')
        },
        '不吃海鲜': {
            icon: require('../assets/image/05h.jpg'),
            activeIcon: require('../assets/image/05.jpg')
        },
        '穆斯林': {
            icon: require('../assets/image/06h.jpg'),
            activeIcon: require('../assets/image/06.jpg')
        },
    };
    export default {
        name: "OrderExtension",
        components: {BgCheckboxItem, BgCheckboxGroup, BgHeader},
        data(){
            return {
                banquetTypeList: [{
                    name: '家宴',
                    value: '1',
                    isChecked: this.$store.state.banquet.banquetType === '1'
                }, {
                    name: '商务宴',
                    value: '2',
                    isChecked: this.$store.state.banquet.banquetType === '2'
                }],
                extensionList: [],
                banquetNote: [],
                money: this.$route.query.money,
                remarkText: ''
            };
        },
        computed: {
            scene(){
                return this.$route.params.scence;
            }
        },
        methods: {
            init(){
                api.getOrderExtension().then(res=> {
                    this.extensionList = res.data;
                });
                let dictionParam =['banquetNote'];
                api.getDiction(dictionParam).then(res => {
                    this.banquetNote = res.data.list.find(item => item.tag === 'banquetNote').sonList;
                    this.banquetNote.forEach(item => {
                        item.indicator = remarkIcons[item.value];
                        item.isChecked = false;
                    })
                });
            },
            showRemarkIndicateIcon(remark){
                return remark.isChecked ? remark.indicator.activeIcon : remark.indicator.icon;
            },
            toggleStatus(remark, index){
                remark.isChecked = !remark.isChecked;
                this.$set(this.banquetNote, index, remark);
            },
            doSubmit(){
                //提交信息成功后，跳转订单详情页面
                let modelList = [];
                this.extensionList.forEach(item => {
                    item.DataList.forEach(data => {
                        if(data.isChecked) {
                            modelList.push({
                                extension_fid: item.id,
                                select_value: data.select_value,
                                select_name: data.select_name,
                                select_type: data.select_type
                            })
                        }
                    })
                });
                let remark = this.banquetNote.filter(item => item.isChecked).map(item => item.value).join(',') + this.remarkText ? `,${this.remarkText}` : '';
                Promise.all([
                    //更新订单扩展信息
                    api.saveOrderExtension(this.$route.query.orderId, modelList),
                    api.updateOrderRemark(this.$route.query.orderId, remark)
                    //更新订单备注信息
                ]).then(res => {
                    //跳转订单详情页
                    window.location.href = "http://app.bagepanzi.com/user/allMyOrderDetail.html?orderId="+this.$route.query.orderId;
                });
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .order-extension {
        padding-top: 50/37.5rem;
        min-height: 100vh;
        .bg-wall {
            width: 100%;
            height: 25vh;
            background: #E94B40;
            position: absolute;
            top: 50px;
            left: 0;
        }
        .main-content {
            position: relative;
            z-index: 1;
            p {
                color: #fff;
                text-align: center;
                width: 5.2rem;
                margin: 0 auto;
                padding: 0.5rem 0;
                font-size: 15/37.5rem;
            }
            .extension-content {
                width: 92vw;
                background: #fff;
                border-radius: 8/37.5rem;
                margin: 0 auto;
                padding: 10/37.5rem;
                .banquet-type-selector {
                    padding-bottom: 20/37.5rem;
                    border-bottom: 1px dashed #dedede;
                }
                h3 {
                    font-size: 16/37.5rem;
                    font-weight: 400;
                    color: #1b1b1b;
                    padding: 10/37.5rem 0;
                    text-align: center;
                    margin-top: 10/37.5rem;
                    span {
                        color: @red;
                        font-weight: normal;
                        font-size: 15/37.5rem;
                    }
                }
                .mark-container {
                    margin-top: 35/37.5rem;
                    padding-top: 20/37.5rem;
                    border-top: 1px dashed #dedede;
                    .remark-item-list {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        flex-wrap: wrap;
                        width: 100%;
                        position: relative;
                        left: -5/37.5rem;
                        .remark-item {
                            width: calc(25% - 0.4rem);
                            height: calc(23vw - 0.4rem - 0.13333rem);
                            border-radius: calc(23vw - 0.4rem);
                            border: 1px solid #dedede;
                            margin-left: 15/37.5rem;
                            margin-top: 10/37.5rem;
                            text-align: center;
                            font-size: 14/37.5rem;
                            .remark-icon {
                                width: 100%;
                                height: 100%;
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                    .remark-input {
                        margin-top: 10/37.5rem;
                        textarea {
                            width: 100%;
                            height: 100/37.5rem;
                            padding: 5/37.5rem;
                            border: 1px solid #dedede;
                            border-radius: 5/37.5rem;
                            outline: none;
                            resize: none;
                        }
                    }
                }
            }
        }
        .btn-box {
            padding: 30/37.5rem 0;
            .btn-pay {
                width: 80%;
                height: 50/37.5rem;
                background: @red;
                color: @white;
                text-align: center;
                line-height: 50/37.5rem;
                margin: 0 auto;
                border-radius: 2/37.5rem;
            }
        }

    }
</style>
