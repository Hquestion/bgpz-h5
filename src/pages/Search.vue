<template>
    <div class="search">
        <bg-header :title="headerText + '搜索'"></bg-header>
        <div class="search-box">
            <bg-search @search="doSearch" v-model="content"></bg-search>
        </div>
        <div class="search-result">
            <div class="party-results" v-if="searchType === 'party'">
                <party-card :data="item" v-for="(item, index) in resultList" :key="index" @click.native.prevent="navigateToDetail(item)"></party-card>
            </div>
            <div class="empty-result" v-show="isSearchEnd && (!resultList || resultList.length === 0)">
                未搜索到合适的结果
            </div>
        </div>
    </div>
</template>

<script>
    import BgSearch from '../components/BgSearch';
    import PartyCard from '../components/PartyCard';
    import api from '../api';
    import BgHeader from "../components/BgHeader";

    const pageSize = 10;
    const typeNameMap = {
        'party': '聚会'
    };
    export default {
        name: "Search",
        components: {
            BgHeader,
            BgSearch,
            PartyCard
        },
        data(){
            return {
                content: '',
                pageIndex: 1,
                resultList: [],
                isSearchEnd: false
            }
        },
        computed: {
            searchType(){
                return this.$route.query.type;
            },
            headerText(){
                return typeNameMap[this.searchType] || '';
            }
        },
        methods: {
            doSearch(){
                this.pageIndex = 1;
                if(this.searchType === 'party') {
                    this.searchParty();
                }
            },
            searchParty(){
                api.getPartyList(this.pageIndex, pageSize, 1, 1, this.content).then(res => {
                    this.resultList = res.data && res.data.list || [];
                    this.isSearchEnd = true;
                }, ()=> {
                    this.resultList = [];
                    this.isSearchEnd = true;
                });
            },
            navigateToDetail(item){
                this.$router.push({
                    name: 'PartyDetail',
                    params: {
                        id: item.id
                    }
                });
            }
        },
        watch: {
            'content': function (val, oldval) {
                if(val !== oldval) {
                    this.isSearchEnd = false;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .search {
        padding-top: 50px;
        padding-bottom: 30px;
        background: #fff;
        min-height: 100vh;
        font-size: 15/37.5rem;
        .search-box {
            width: 100vw;
            padding: 10/37.5rem 20/37.5rem;
        }
        .search-result {
            padding: 0 15/37.5rem;
        }
        .empty-result {
            text-align: center;
            padding: 20/37.5rem 0;
        }
    }
</style>
