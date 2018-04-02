<template>
    <div class="main-frame">
        <h2>{{msg}}</h2>
        <mt-button>parcel</mt-button>
        <router-view>

        </router-view>
        <mt-tabbar v-model="selected">
            <mt-tab-item id="外卖">
                外卖
            </mt-tab-item>
            <mt-tab-item id="订单">
                订单
            </mt-tab-item>
            <mt-tab-item id="发现">
                发现
            </mt-tab-item>
            <mt-tab-item id="我的">
                我的
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>
    export default {
        name: "frame",
        data(){
            return {
                msg: 'hello parcel',
                selected: '外卖'
            }
        }
    }
</script>

<style scoped>

</style>
