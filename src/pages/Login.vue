<template>
    <div class="login">
        this is login page
        <mt-button @click="login">登陆</mt-button>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {

            }
        },
        methods: {
            login(){
                this.$router.push({
                    name: 'Home'
                });
            }
        }
    }
</script>

<style scoped>

</style>
