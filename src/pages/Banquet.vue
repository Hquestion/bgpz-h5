<template>
    <div class="banquet">
        <bg-header title="高级私宴定制"></bg-header>
        <bg-article-title title="请选择宴会类型"></bg-article-title>
        <div class="banquet-type-container">
            <bg-action-card-group>
                <bg-action-card-item :active="banquetType === '1'" @click.native="chooseBanquetType('1')">
                    <div slot="title">家宴</div>
                    <div>{{(banquetType === '1' && costPer > 0) ? `人均${costPer}元` : `人均${config.leastPriceFamilyBanquet}元起`}}</div>
                </bg-action-card-item>
                <bg-action-card-item :active="banquetType === '2'" @click.native="chooseBanquetType('2')">
                    <div slot="title">商务宴</div>
                    <div>{{(banquetType === '2' && costPer > 0) ? `人均${costPer}元` : `人均${config.leastPriceBusinessBanquet}元起`}}</div>
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
            <bg-action-card-item :arrow="true" @click.native="addrPickerVisible = true">
                <div slot="title">场地类型</div>
                <span>{{banquetAddrTypeLabel}}</span>
            </bg-action-card-item>
            <bg-action-card-item :arrow="true" @click.native="tableNumPickerVisible = true">
                <div slot="title">人数桌数</div>
                <span>{{tablePeopleNum}}</span>
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
        <div class="banquet-price-tip"></div>
        <div class="banquet-next-btn">
            <bg-button shape="circle" @tap="nextStep">下一步></bg-button>
        </div>
        <popup-picker v-model="foodSeriesPickerVisible" :picker-slots="foodSeriesSlot" title="请选择菜系" @data-change="onSeriesChange"></popup-picker>
        <popup-picker v-model="foodSpecialPickerVisible" :picker-slots="foodSpecialSlot" title="请选择特色" @data-change="onSpecialChange"></popup-picker>
        <popup-picker ref="costPicker" v-model="costPickerVisible" :picker-slots="costSlot" title="请选择人均餐标" @data-change="onCostChange"></popup-picker>
        <popup-picker v-model="selectTimeVisible" :picker-slots="timeSlots" title="请选择宴会时间" @change="adjustDate" @data-change="setBanquetTime"></popup-picker>
        <popup-picker v-model="cookerPickerVisible" :picker-slots="cookerSlot" title="请选择厨师" @data-change="setCookerCount"></popup-picker>
        <popup-picker v-model="waiterPickerVisible" :picker-slots="waiterSlot" title="请选择服务员" @data-change="setWaiterCount"></popup-picker>
        <popup-picker v-model="somerwaerPickerVisible" :picker-slots="somerwaerSlot" title="请选择侍酒师" @data-change="setSomerwaerCount"></popup-picker>
        <popup-picker v-model="addrPickerVisible" :picker-slots="addrSlot" title="请选择场地类型" @data-change="setBanquetAddrType"></popup-picker>
        <popup-picker v-model="tableNumPickerVisible" :picker-slots="tableNumSlot" title="请选择场地类型" @data-change="setTablePeopleCount"></popup-picker>
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
    import {range} from "../util";
    import form from '../util/form';

    const addrTypeMap = {
        '1': '自有场地（免费）',
        '2': '平台场地（收费）'
    };
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
                selectTimeVisible: false,
                config: {},
                timeSlots: [],
                cookerPickerVisible: false,
                cookerSlot: [{values: [{label: '1名', value: 1}], flex:1, defaultIndex: 0}],
                waiterPickerVisible: false,
                waiterSlot: [{values: [{label: '不需要', value: 0}, {label: '1名', value: 1}, {label: '2名', value: 2}], flex: 1, defaultIndex: 1}],
                somerwaerPickerVisible: false,
                somerwaerSlot: [{values: [{label: '不需要', value: 0}, {label: '1名', value: 1}, {label: '2名', value: 2}], flex: 1, defaultIndex: 1}],
                addrPickerVisible: false,
                addrSlot: [{values: [{label: addrTypeMap['1'], value: '1'},{label: addrTypeMap['2'], value: '2'}], flex: 1, defaultIndex: 1}],
                tableNumPickerVisible: false,
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
                'banquetAddrType',
                'tablePeopleNum'
            ]),
            banquetAddrTypeLabel(){
                return addrTypeMap[this.banquetAddrType];
            },
            costSlot(){
                let slotData;
                if(this.banquetType === '1') {
                    slotData = [{
                        values: range(+this.config.leastPriceFamilyBanquet || 300, 800, 100).map(item => ({label: `${item}元`, value: item})),
                        flex: 1,
                        defaultIndex: 0
                    }];
                }else {
                    slotData = [{
                        values: range(+this.config.leastPriceBusinessBanquet || 400, 800, 100).map(item => ({label: `${item}元`, value: item})),
                        flex: 1,
                        defaultIndex: 0
                    }];
                }
                return slotData
            },
            tableNumSlot(){
                return [{
                    values: range(1, 100).map(item => ({label: `${item}人`, value: item})),
                    flex: 1,
                    defaultIndex: 0
                }, {
                    values: range(1, 10).map(item => ({label: `${item}桌`, value: item})),
                    flex: 1,
                    defaultIndex: 0
                }];
            }
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
                'setBanquetAddrType',
                'setTablePeopleCount'
            ]),
            init(){
                api.getFoodSeries().then(res => {
                    this.foodSeriesSlot = [{values: res.data.list.map(item => ({label: item.sname, value: item.id + '@' + item.sname})),flex: 1,defaultIndex: 0}]
                });
                api.getFoodSpecial().then(res => {
                    this.foodSpecialSlot = [{values: res.data.list.map(item => ({label: item.sname, value: item.id + '@' + item.sname})),flex: 1,defaultIndex: 0}]
                });
                Promise.all([
                    api.getCfg(['minOrderTimeToStartTime', 'maxOrderTimeToStartTime', 'cookFamilyBanquet', 'waiterFamilyBanquet', 'sommFamilyBanquet',
                        'cookBusinessBanquet', 'waiterBusinessBanquet', 'sommBusinessBanquet', 'leastPriceFamilyBanquet', 'leastPriceBusinessBanquet',
                        'leastPriceThirdPlace']),
                    api.getDiction(['banquetTimeList'])
                ]).then((data) => {
                    let cfg = data[0];
                    let dic = data[1];
                    this.config = {
                        timeList: dic.data.list[0].sonList
                    };
                    for(let k in cfg.data.list) {
                        this.config[k] = cfg.data.list[k];
                    }
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
            },
            chooseBanquetType(type){
                this.setBanquetType(type);
                this.setCostPer(this.banquetType === '1' ? 300: 400);
                this.costPickerVisible = true;
            },
            nextStep(){
                let validationList = [
                    {method: 'isNotEmpty', message: '请选择菜系', param: [this.$store.state.banquet.foodSeries]},
                    {method: 'isNotEmpty', message: '请选择特色', param: [this.$store.state.banquet.foodSpecial]},
                    {method: 'isAfterTime', message: '宴会时间不正确', param: [this.$store.state.banquet.banquetTime]},
                ];
                if(form.validate(validationList)) {
                    this.$router.push({
                        name: 'BanquetPackagePick'
                    });
                }
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
