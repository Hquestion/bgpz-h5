<template>
    <div class="main-frame">
        <h2>{{msg}}</h2>
        <mt-button @click="onClick">parcel</mt-button>
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
    import {TabItem, Tabbar, Button} from 'mint-ui';
    export default {
        name: "frame",
        components: {
            MtTabItem: TabItem,
            MtTabbar: Tabbar,
            MtButton: Button
        },
        data(){
            return {
                msg: 'hello parcel',
                selected: '外卖'
            }
        },
        methods: {
            onClick(){
                navigator.getUserMedia({
                    audio: false,
                    video: true
                }, function(){
                    alert('成功');
                }, function(e){
                    alert(e.name)
                })
            }
        }
    }
</script>

<style scoped>

</style>
