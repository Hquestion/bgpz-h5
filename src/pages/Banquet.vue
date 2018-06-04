<template>
    <div class="banquet">
        <bg-header title="高级私宴定制"></bg-header>
        <bg-article-title title="请选择宴会类型"></bg-article-title>
        <div class="banquet-type-container">
            <bg-action-card-group>
                <bg-action-card-item :active="banquetType === '1'" @click.native="setBanquetType('1')">
                    <div slot="title">家宴</div>
                    <div>人均300元起</div>
                </bg-action-card-item>
                <bg-action-card-item :active="banquetType === '2'" @click.native="setBanquetType('2')">
                    <div slot="title">商务宴</div>
                    <div>人均400元起</div>
                </bg-action-card-item>
            </bg-action-card-group>
        </div>
        <bg-article-title title="请选择宴会需求"></bg-article-title>
        <bg-action-card-group>
            <bg-action-card-item :arrow="true" @click.native="foodSeriesPickerVisible = true">
                <div slot="title">菜&nbsp;系</div>
                <span>{{foodSeries}}</span>
            </bg-action-card-item>
            <bg-action-card-item :arrow="true" @click.native="foodSpecialPickerVisible = true">
                <div slot="title">特&nbsp;色</div>
                <span>{{foodSpecial}}</span>
            </bg-action-card-item>
        </bg-action-card-group>
        <bg-action-card-group>
            <bg-action-card-item :arrow="true" @click.native="costPickerVisible = true">
                <div slot="title">人&nbsp;均</div>
                <span>{{costPer}}</span>
            </bg-action-card-item>
            <bg-action-card-item :arrow="true">
                <div slot="title">人数桌数</div>
                <span>请选择</span>
            </bg-action-card-item>
        </bg-action-card-group>
        <bg-action-card-group>
            <bg-action-card-item :arrow="true" @click.native="selectTimeVisible = true">
                <div slot="title">宴会时间</div>
                <span>{{banquetTime}}</span>
            </bg-action-card-item>
        </bg-action-card-group>
        <bg-action-card-group>
            <bg-action-card-item :arrow="true" @click.native="cookerPickerVisible = true">
                <div slot="title">厨&nbsp;师</div>
                <span>{{cookerCount}}</span>
            </bg-action-card-item>
            <bg-action-card-item :arrow="true" @click.native="waiterPickerVisible = true">
                <div slot="title">服务员</div>
                <span>{{waiterCount}}</span>
            </bg-action-card-item>
            <bg-action-card-item :arrow="true" @click.native="somerwaerPickerVisible = true">
                <div slot="title">侍酒师</div>
                <span>{{somerwaerCount}}</span>
            </bg-action-card-item>
        </bg-action-card-group>
        <bg-article-title title="请选择宴会场地"></bg-article-title>
        <bg-action-card-group>
            <bg-action-card-item :active="banquetAddrType === '1'" @click.native="setBanquetAddrType('1')">
                <div slot="title">自有场地</div>
                <div>您自己的场地</div>
            </bg-action-card-item>
            <bg-action-card-item :active="banquetAddrType === '2'" @click.native="setBanquetAddrType('2')">
                <div slot="title">平台场地</div>
                <div><p>平台提供场地</p><p style="font-size: 0.32rem;">收取200元场地费</p></div>
            </bg-action-card-item>
        </bg-action-card-group>
        <div class="banquet-price-tip"></div>
        <div class="banquet-next-btn">
            <bg-button shape="circle">下一步></bg-button>
        </div>
        <popup-picker v-model="foodSeriesPickerVisible" :picker-slots="foodSeriesSlot" title="请选择菜系" @data-change="onSeriesChange"></popup-picker>
        <popup-picker v-model="foodSpecialPickerVisible" :picker-slots="foodSpecialSlot" title="请选择特色" @data-change="onSpecialChange"></popup-picker>
        <popup-picker v-model="costPickerVisible" :picker-slots="costSlot" title="请选择人均餐标" @data-change="onCostChange"></popup-picker>
        <popup-picker v-model="selectTimeVisible" :picker-slots="timeSlots" title="请选择宴会时间" @change="adjustDate" @data-change="setBanquetTime"></popup-picker>
        <popup-picker v-model="cookerPickerVisible" :picker-slots="cookerSlot" title="请选择厨师" @data-change="setCookerCount"></popup-picker>
        <popup-picker v-model="waiterPickerVisible" :picker-slots="waiterSlot" title="请选择服务员" @data-change="setWaiterCount"></popup-picker>
        <popup-picker v-model="somerwaerPickerVisible" :picker-slots="somerwaerSlot" title="请选择侍酒师" @data-change="setSomerwaerCount"></popup-picker>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import BgActionCardGroup from "../components/BgActionCardGroup";
    import BgActionCardItem from "../components/BgActionCardItem";
    import BgArticleTitle from "../components/BgArticleTitle";
    import BgButton from "../components/BgButton";
    import PopupPicker from "../components/PopupPicker";
    import api from '../api';
    import banquetTimePickerGenerator from '../mixins/banquetTimePickerGenerator';

    import {mapActions, mapGetters} from 'vuex';
    export default {
        name: "Banquet",
        components: {PopupPicker, BgButton, BgArticleTitle, BgActionCardItem, BgActionCardGroup, BgHeader},
        mixins: [banquetTimePickerGenerator],
        data(){
            return {
                foodSeriesPickerVisible: false,
                foodSeriesSlot: [],
                foodSpecialSlot: [],
                foodSpecialPickerVisible: false,
                costPickerVisible: false,
                costSlot: [{
                    values: [{
                        label: '300元',
                        value: 300
                    }, {
                        label: '400元',
                        value: 400
                    }, {
                        label: '500元',
                        value: 500
                    }, {
                        label: '600元',
                        value: 600
                    }, {
                        label: '800元',
                        value: 800
                    }],
                    flex: 1,
                    defaultIndex: 0
                }],
                selectTimeVisible: false,
                config: {},
                timeSlots: [],
                cookerPickerVisible: false,
                cookerSlot: [{values: [{label: '1名', value: 1}], flex:1, defaultIndex: 0}],
                waiterPickerVisible: false,
                waiterSlot: [{values: [{label: '不需要', value: 0}, {label: '1名', value: 1}, {label: '2名', value: 2}], flex: 1, defaultIndex: 1}],
                somerwaerPickerVisible: false,
                somerwaerSlot: [{values: [{label: '不需要', value: 0}, {label: '1名', value: 1}, {label: '2名', value: 2}], flex: 1, defaultIndex: 1}]
            }
        },
        computed: {
            ...mapGetters([
                'foodSeries',
                'foodSpecial',
                'banquetType',
                'costPer',
                'banquetTime',
                'cookerCount',
                'waiterCount',
                'somerwaerCount',
                'banquetAddrType'
            ])
        },
        methods: {
            ...mapActions([
                'setFoodSeries',
                'setFoodSpecial',
                'setBanquetType',
                'setCostPer',
                'setBanquetTime',
                'setCookerCount',
                'setWaiterCount',
                'setSomerwaerCount',
                'setBanquetAddrType'
            ]),
            init(){
                api.getFoodSeries().then(res => {
                    this.foodSeriesSlot = [{values: res.map(item => ({label: item.name, value: item.name})),flex: 1,defaultIndex: 0}]
                });
                api.getFoodSpecial().then(res => {
                    this.foodSpecialSlot = [{values: res.map(item => ({label: item.name, value: item.name})),flex: 1,defaultIndex: 0}]
                });
                Promise.all([
                    api.getCfg(['minOrderTimeToStartTime', 'maxOrderTimeToStartTime']),
                    api.getDiction(['banquetTimeList'])
                ]).then(([cfg, dic]) => {
                    this.config = {
                        ...cfg.data.list,
                        timeList: dic.data.list[0].sonList
                    };
                    this.timeSlots = this.generateTimeSlots();
                });
            },
            onSeriesChange(value){
                this.setFoodSeries(value[0].value);
            },
            onSpecialChange(value){
                this.setFoodSpecial(value[0].value);
            },
            onCostChange(value){
                this.setCostPer(value[0].value);
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    .banquet {
        padding-top: 50px;
        background: #f2f2f2;
        .banquet-price-tip {
            padding: 10/37.5rem 20/37.5rem;
        }
        .banquet-next-btn {
            padding:10/37.5rem 0 40/37.5rem;
        }
    }
</style>
