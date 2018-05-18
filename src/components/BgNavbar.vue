<template>
    <div class="bg-navbar">
        <v-touch class="bg-navbar-item" @tap="doNavigate('home')" :class="{'active': selected === '首页'}">
            <img src="../assets/image/index.png" v-if="selected !== '首页'">
            <img src="../assets/image/index-red.png" v-else>
            <div>首页</div>
        </v-touch>
        <v-touch class="bg-navbar-item" @tap="doNavigate('party')" :class="{'active': selected === '聚会'}">
            <img src="../assets/image/meet.png" v-if="selected !== '聚会'">
            <img src="../assets/image/meet-red.png" v-else>
            <div>聚会</div>
        </v-touch>
        <v-touch class="bg-navbar-item" @tap="doNavigate('shop')" :class="{'active': selected === '商城'}" style="display: none;">
            <img src="../assets/image/shop.png" v-if="selected !== '商城'">
            <img src="../assets/image/shop-red.png" v-else>
            <div>商城</div>
        </v-touch>
        <v-touch class="bg-navbar-item" @tap="doNavigate('mine')" :class="{'active': selected === '我的'}">
            <img src="../assets/image/mine.png" v-if="selected !== '我的'">
            <img src="../assets/image/mine-red.png" v-else>
            <div>我的</div>
        </v-touch>
    </div>
</template>

<script>
    const routerNameMap = {
        'home': '../index/index.html',
        'party': 'Party',
        'shop': 'Shop',
        'mine': '../user/index.html'
    };
    export default {
        name: "BgNavbar",
        data(){
            return {

            }
        },
        computed: {
            selected(){
                return this.$route.meta.routeName;
            }
        },
        methods: {
            doNavigate(tab){
                if(tab === 'party' || tab === 'shop') {
                    this.$router.push({
                        name: routerNameMap[tab]
                    });
                }else {
                    //todo 部署时换成现网地址
                    window.location.href = routerNameMap[tab]
                }
            }
        },
        mounted(){

        }
    }
</script>

<style scoped lang="less">
    @import "../assets/less/variable";
    .bg-navbar {
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        z-index: 99;
        font-size: 13/37.5rem;
        text-align: center;
        width: 100%;
        height: 50/37.5rem;
        background: #fff;
        border-top: 1px solid #dedede;
        .bg-navbar-item {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            align-items: center;
            &.active {
                color: @red;
            }
            img {

            }
        }
    }
</style>
