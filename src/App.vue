<template>
    <div class="main">
        <h2>{{msg}}</h2>
        <mt-button>parcel</mt-button>
        <transition>
            <navigation>
                <router-view></router-view>
            </navigation>
        </transition>
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
        name: "app",
        data() {
            return {
                msg: 'hello parcel',
                selected: '外卖'
            }
        },
        created() {
            // bind event
            this.$navigation.on('forward', (to, from) => {
                console.log('forward to', to, 'from ', from)
            })
            this.$navigation.on('back', (to, from) => {
                console.log('back to', to, 'from ', from)
            })
            this.$navigation.on('replace', (to, from) => {
                console.log('replace to', to, 'from ', from)
            })
            this.$navigation.on('refresh', (to, from) => {
                console.log('refresh to', to, 'from ', from)
            })
            this.$navigation.on('reset', () => {
                console.log('reset')
            })
            // and use [once, off] methods
            this.$navigation.once('forward', () => {
                console.log('appear once')
            })
            const off = () => {
                console.log('will not appear')
            }
            this.$navigation.on('forward', off)
            this.$navigation.off('forward', off)
        }
    }
</script>

<style scoped>

</style>