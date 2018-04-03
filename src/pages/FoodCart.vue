<template>
    <div class="food-cart-container">
        <bg-header :title="restaurantName">
            <div slot="action" @click="changeRestaurant()">
                <mt-button icon="more"/>
            </div>
        </bg-header>
        <div class="food-cart-main">

        </div>
        <mt-actionsheet
            :actions="actions"
            v-model="sheetVisible">
        </mt-actionsheet>
    </div>
</template>

<script>
    import BgHeader from '../components/BgHeader';
    import {Button, Actionsheet } from 'mint-ui';
    export default {
        name: "food-cart",
        components: {
            BgHeader,
            MtButton: Button,
            MtActionsheet: Actionsheet
        },
        data() {
            return {
                restaurantName: '好记大酒店',
                actions: [],
                sheetVisible: false
            };
        },
        methods: {
            init(){
                let list = [1,2,3,4,5];
                let actionList = [];
                list.forEach(function(item){
                    actionList.push({
                        name: '家家宴大酒店',
                        method: function(){
                            console.log('ee')
                        }
                    });
                });
                this.actions = actionList
            },
            back(){
                this.$router.go(-1);
            },
            changeRestaurant(){
                this.sheetVisible = true;
            }
        },
        computed:{

        },
        mounted(){
            this.init()
        }
    }
</script>

<style scoped>
    .food-cart-container {
        background: #f2f2f2;
        height: 100vh;
        padding-top: 60px;
    }
    .food-cart-main {
        width: 100%;
        height: calc(100vh - 60px);
        background: #fff;
    }
</style>
