<template>
    <div class="main">
        <transition>
            <navigation>
                <router-view></router-view>
            </navigation>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "app",
        data() {
            return {

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
