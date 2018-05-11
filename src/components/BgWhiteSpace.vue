<template>
    <div class="bg-white-space" :style="{height: height, background: background}">

    </div>
</template>

<script>
    export default {
        name: "BgWhiteSpace",
        props: {
            height: {
                default: '0.2rem'
            },
            background: {
                default: '#f2f2f2'
            }
        }
    }
</script>

<style scoped>

</style>
