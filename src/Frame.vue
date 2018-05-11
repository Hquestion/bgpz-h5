<template>
    <div class="main-frame">
        <router-view class="frame-content">

        </router-view>
        <bg-navbar></bg-navbar>
    </div>
</template>

<script>
    import BgNavbar from './components/BgNavbar';
    export default {
        name: "frame",
        components: {
            BgNavbar
        },
        data(){
            return {
                selected: '聚会'
            }
        },
        methods: {

        }
    }
</script>

<style lang="less" scoped>
    .main-frame {
        font-size: 16/37.5rem;
        .frame-content {
            width: 100vw;
            height: calc(100% - 1.3333333333333333rem);
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
        }
    }
</style>
