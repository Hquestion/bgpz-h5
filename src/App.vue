<template>
    <div class="main">
        <transition>
            <!--<navigation>-->
                <router-view></router-view>
            <!--</navigation>-->
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
            console.log(this.store);
        }
    }
</script>

<style scoped>
    .main {
        font-size: 0.45rem;
        background: #f2f2f2;
        min-height: 100vh;
    }
</style>
