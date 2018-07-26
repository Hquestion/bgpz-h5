<template>
    <div class="banquet-package-pick">
        <bg-header title="请选择套餐"></bg-header>
        <bg-article-title title="推荐方案"></bg-article-title>
        <ul class="package-list">
            <li v-for="pack in packageList" :key="pack.id" @click="onSelectBanquetPackage(pack)">
                <package-card :data="pack"></package-card>
            </li>
        </ul>
    </div>
</template>

<script>
    import BgHeader from '../components/BgHeader';
    import BgArticleTitle from '../components/BgArticleTitle';
    import PackageCard from '../components/PackageCard';
    import api from '../api';

    import {mapActions} from 'vuex'

    export default {
        name: "BanquetPackagePick",
        components: {
            PackageCard,
            BgHeader,
            BgArticleTitle
        },
        data(){
            return {
                packageList: []
            }
        },
        methods: {
            ...mapActions([
                'selectBanquetPackage'
            ]),
            init(){
                let {costPer, foodSeries, foodSpecial, peopleCount} = this.$store.state.banquet;
                let price = +costPer;
                if(this.$route.query.scene === 'package') {
                    api.getPackageList().then(res => {
                        this.packageList = res.data.list;
                    });
                }else {
                    api.filterBanquetPackageList(price, foodSeries.split('@')[0], foodSpecial.split('@')[0]).then(res => {
                        this.packageList = res.data.list;
                    });
                }
            },
            onSelectBanquetPackage(pack){
                this.selectBanquetPackage(pack);
                this.$router.push({
                    name: 'PackageDetail',
                    params: {
                        id: pack.id
                    },
                    query: {
                        scene: this.$route.query.scene || 'banquet'
                    }
                });
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    .banquet-package-pick {
        padding-top: 50px;
        .package-list {
            padding: 0 10/37.5rem 10/37.5rem;
            li + li{
                margin-top: 10/37.5rem;
            }
        }
    }
</style>
