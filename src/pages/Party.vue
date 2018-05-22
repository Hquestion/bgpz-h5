<template>
    <div class="party">
        <bg-header fixed title="聚会" type="default">
            <div slot="left">南京</div>
            <div slot="action">
                <v-touch class="add-party" @tap="startParty()">
                    <span>发起聚会</span>
                </v-touch>
            </div>
        </bg-header>
        <div class="party-actions" style="display: none;">
            <v-touch class="my-party flex-block" @tap="myParty()">
                <div class="img-block">
                    <img src="../assets/image/mine-party.png">
                </div>
                <div>我的聚会</div>
            </v-touch>
            <v-touch class="start-party flex-block" @tap="startParty()">
                <div class="img-block">
                    <img src="../assets/image/start-party.png">
                </div>
                <div>发起聚会</div>
            </v-touch>
        </div>
        <div class="party-search">
            <bg-search @search="doSearch" v-model="content"></bg-search>
        </div>
        <div class="party-status-tab">
            <div class="party-tab-item" :class="{active: currentStatus === 1}" @click="setStatus(1)">进行中</div>
            <div class="party-tab-item" :class="{active: currentStatus === 3}" @click="setStatus(3)">已结束</div>
        </div>
        <div class="party-list">
            <mt-loadmore :top-method="refresh" ref="loadmore">
                <ul v-show="partyList.length > 0">
                    <v-touch tag="li" v-for="(party, index) in partyList" :key="party.id" @tap="navigateToDetail(party)">
                        <party-card :data="party"></party-card>
                    </v-touch>
                </ul>
                <div class="no-content" v-show="partyList.length === 0" style="text-align: center;padding-top: 50px;">
                    暂无聚会
                </div>
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
    import {Loadmore} from 'mint-ui';
    import BgHeader from '../components/BgHeader';
    import PartyCard from '../components/PartyCard';
    import BgSearch from '../components/BgSearch';
    import api from '../api';
    import filter from '../mixins/filter';

    const pageSize = 999;
    const type = 1;
    export default {
        name: "Party",
        mixins: [filter],
        data(){
            return {
                allLoaded: false,
                partyList: [],
                pageIndex: 1,
                content: '',
                currentStatus: 1,
            };
        },
        components: {
            'mt-loadmore': Loadmore,
            BgHeader,
            PartyCard,
            BgSearch
        },
        methods: {
            init(){
                api.getPartyList(this.pageIndex, pageSize, this.currentStatus, type, this.content).then(res => {
                    this.partyList = res.data && res.data.list || [];
                });
            },
            startParty(){
                this.$router.push({
                    name: 'CreateParty'
                });
            },
            setStatus(status){
                this.currentStatus = status;
                this.init();
            },
            refresh(){
                this.pageIndex = 1;
                api.getPartyList(this.pageIndex, pageSize, this.currentStatus, type, this.content).then(res => {
                    this.partyList = res.data && res.data.list || [];
                    this.$refs.loadmore.onTopLoaded();
                });
            },
            loadMore(){
                this.pageIndex++;
                api.getPartyList(this.pageIndex, pageSize, this.currentStatus, type, this.content).then(res => {
                    this.partyList = this.partyList.concat(res.data && res.data.list || []);
                    this.$refs.loadmore.onBottomLoaded();
                    if(res.isLast === 1) {
                        this.allLoaded = true;
                    }else {
                        this.allLoaded = false;
                    }
                });
            },
            navigateToDetail(data){
                this.$router.push({
                    name: 'PartyDetail',
                    params: {
                        id: data.id
                    }
                });
            },
            doSearch(data){
                this.refresh();
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .party {
        padding-top: 50px;
        background: #fff;
        .add-party {
            width: auto;
            text-align: center;
            color: @white;
            background: @red;
            font-size: 0;
            border-radius: 5/37.5rem;
            padding: 10/37.5rem 0rem;
            display: flex;
            align-items: center;
            justify-content: center;
            span {
                display: block;
                font-size: 14/37.5rem;
            }
        }
        .party-actions {
            display: flex;
            padding: 20/37.5rem;
            text-align: center;
            .flex-block {
                flex: 1;
                .img-block {
                    width: 100%;
                    height: 50/37.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
        .party-search {
            padding: 0.2rem 0.5rem 0;
        }
        .party-status-tab {
            width: 100vw;
            height: 50/37.5rem;
            line-height: 50/37.5rem;
            background: @white;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            border-bottom: 1px solid #dedede;
            font-size: 14/37.5rem;
            .party-tab-item {
                color: @dark;
                flex: 1;
                &.active {
                    color: @red;
                    border-bottom: 3/37.5rem solid @red;
                }
            }
        }
        .party-list {
            height: calc(100vh - 50px - 2.6rem - 1.33333rem);
            overflow: auto;
            ul {
                padding: 15/37.5rem;
                li + li {
                    margin-top: 10/37.5rem;
                }
            }
            .no-content {
                height: calc(100vh - 50px - 2.6rem - 1.33333rem);
            }
        }
    }
</style>
