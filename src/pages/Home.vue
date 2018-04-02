<template>
    <div class="home-container">
        <div>this is home page!</div>
        <div class="bg"></div>
    </div>
</template>

<script>
    import api from '../api/index';

    export default {
        name: "home",
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
        display: flex;
    }
    .home-container .bg {
        width: 200%;
        height: 20vh;
        background: #26a2ff;
        transform: rotate(60deg);
    }
</style>
