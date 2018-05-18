<template>
    <div class="my-party-list">
        <bg-header title="我参加的聚会"></bg-header>
        <div class="party-tabs">
            <v-touch class="tab-item" :class="{active: currentStatus === '4'}" @tap="setCurrentStatus('4')">全部</v-touch>
            <v-touch class="tab-item" :class="{active: currentStatus === '0'}" @tap="setCurrentStatus('0')">待付款</v-touch>
            <v-touch class="tab-item" :class="{active: currentStatus === '1'}" @tap="setCurrentStatus('1')">待开始</v-touch>
            <v-touch class="tab-item" :class="{active: currentStatus === '3'}" @tap="setCurrentStatus('3')">已结束</v-touch>
        </div>
        <tab-container swipeable v-model="currentStatus" class="party-container">
            <tab-container-item id="4">
                <my-party-card v-for="(item, index) in allPartyList" :key="index" :data="item" type="2"></my-party-card>
            </tab-container-item>
            <tab-container-item id="0">
                <my-party-card v-for="(item, index) in unpayPartyList" :key="index" :data="item" type="2"></my-party-card>
            </tab-container-item>
            <tab-container-item id="1">
                <my-party-card v-for="(item, index) in toStartPartyList" :key="index" :data="item" type="2"></my-party-card>
            </tab-container-item>
            <tab-container-item id="3">
                <my-party-card v-for="(item, index) in endPartyList" :key="index" :data="item" type="2"></my-party-card>
            </tab-container-item>
        </tab-container>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import { TabContainer, TabContainerItem } from 'mint-ui';
    import api from '../api';
    import MyPartyCard from "../components/MyPartyCard";

    const statusListMap = {
        '0': 'unpayPartyList',
        '1': 'toStartPartyList',
        '3': 'endPartyList',
        '4': 'allPartyList'
    };
    export default {
        name: "MyJoinedParty",
        data(){
            return {
                allPartyList: null,
                unpayPartyList: null,
                toStartPartyList: null,
                endPartyList: null,
                pageIndex: 1,
                pageSize: 20,
                currentStatus: '4'
            };
        },
        components: {
            MyPartyCard,
            BgHeader,
            TabContainer,
            TabContainerItem
        },
        methods: {
            init(){
                api.getPartyList(this.pageIndex,this.pageSize, this.currentStatus, 3).then(res => {
                    this.allPartyList = res.data && res.data.list || [];
                });
            },
            setCurrentStatus(id){
                this.currentStatus = id;
            },
            getPartyList(status){
                if(!this[statusListMap[status]]) {
                    api.getPartyList(this.pageIndex,this.pageSize, status, 3).then(res => {
                        this[statusListMap[status]] = res.data && res.data.list || [];
                    });
                }
            }
        },
        watch: {
            currentStatus(val, oldVal){
                if(val !== oldVal) {
                    //获取聚会列表
                    this.getPartyList(val);
                }
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .my-party-list{
        padding-top: 50px;
        font-size: 14/37.5rem;
        .party-tabs {
            width: 100vw;
            height: 60px;
            line-height: 60px;
            font-size: 14/37.5rem;
            text-align: center;
            background: @white;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .tab-item {
                height: 100%;
                flex: 1;
                color: #1b1b1b;
                &.active {
                    border-bottom: 3/37.5rem solid @red;
                    color: @red;
                }
            }
        }
        .party-container {
            width: 100vw;
            height: calc(100vh - 110px);
            overflow: auto;
        }
    }
</style>
