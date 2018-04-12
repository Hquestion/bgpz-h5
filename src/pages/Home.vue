<template>
    <div class="home-container">
        <div>this is home page!</div>
        <div class="bg">

        </div>
        <bg-tab v-model="currentTab">
            <bg-tab-card id="22">222</bg-tab-card>
            <bg-tab-card id="33">333</bg-tab-card>
            <bg-tab-card id="44">444</bg-tab-card>
            <bg-tab-card id="55">555</bg-tab-card>
            <bg-tab-card id="66">666</bg-tab-card>
            <bg-tab-card id="77">777</bg-tab-card>
        </bg-tab>
    </div>
</template>

<script>
    import api from '../api/index';
    import BgTab from '../components/BgTab';
    import BgTabCard from '../components/BgTabCard';

    export default {
        name: "home",
        data(){
            return {
                currentTab: '22'
            }
        },
        components: {
            BgTab,
            BgTabCard
        },
        methods: {
            init(){
                console.log(api);
                api.getRestaurantList().then(res => {
                    console.log(res)
                })
            }
        },
        mounted() {
            this.init()
        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        overflow: hidden;
    }
    .home-container .bg {
        width: 200%;
        height: 20vh;
        background: #26a2ff;
        transform: rotate(60deg);
    }
</style>
